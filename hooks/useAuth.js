import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { View, Text } from 'react-native'
import * as Google from 'expo-google-app-auth'
import { auth } from '../firebase';
import { GoogleAuthProvider, onAuthStateChanged, signInWithCredential, signOut } from '@firebase/auth';

const AuthContext = createContext({})

const config = {
    clientId: "418927558427-fd0c1s82bvjr6hllirkbopqoa1u4m39v.apps.googleusercontent.com",
    androidClientId: "418927558427-8eqeiv93mud07el4smmv870j1f6b5462.apps.googleusercontent.com",
    iosClientId: "418927558427-1cii9kt9pqk77iqkjsggug0s3rj023k2.apps.googleusercontent.com",
    scopes: ["profile", "email"],
    permissions: ["public_profile", "email", "gender", "location"],
};

export const AuthProvider = ({ children }) => {
    const [error, setError] = useState(null)
    const [user, setUser] = useState(null)
    // handlinging delay while login
    const [loadingInitial, setLoadingInitial] = useState(null)
    const [loading, setLoading] =useState(false)
    
    
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user)
            } else {
                setUser(null)
            }

            setLoadingInitial(false)
        })
       
    }, [])



    const logout =  () => {
        setLoading(true)

        signOut(auth).catch((error) => setError(error))
        .finally(() => setLoading(false))
    }


    const signInWithGoogle = async () => {

        setLoading(true)

       await Google.logInAsync(config).then(async (logInResult) => {
            if(logInResult.type === 'success'){
                // push user to firebase user auth
                const {idToken, accessToken} = logInResult;
                const credential = GoogleAuthProvider.credential(idToken, accessToken)
             
             
                await signInWithCredential(auth, credential)
            }

            return Promise.reject()
              
        }).catch(error => setError(error))
        .finally(() => setLoading(false))

    }

// prevent from rerendering all the things rather provide previous value
    const memoedValue = useMemo(() => ({
        user:user, loading, error, logout, signInWithGoogle
    }),[user, loading, error])

    return (
        <AuthContext.Provider value={memoedValue}>
            {!loadingInitial && children}
        </AuthContext.Provider>
    )
}
export default function useAuth() {
    return useContext(AuthContext)
}
