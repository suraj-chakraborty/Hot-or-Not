import { useNavigation } from '@react-navigation/core'
import React, { useLayoutEffect } from 'react'
import { View, Text, Button, ImageBackground, TouchableOpacity } from 'react-native'
import useAuth from '../hooks/useAuth'
import tw from 'tailwind-rn'

const LoginScreen = () => {
    const {signInWithGoogle, loading} = useAuth()
    // console.log(user)
    const navigation = useNavigation()

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        })
    })
    return (
        <View style={tw("flex-1")}>
            <ImageBackground 
            resizeMode="cover"
            style={tw("flex-1")}
            source={require("../image/bg2.jpg")}>
               <TouchableOpacity style={[tw("absolute bottom-20 w-52 bg-blue-100 p-4 rounded-2xl"), {marginHorizontal: "25%"}]}
                onPress={signInWithGoogle}>
                   <Text style={tw("font-semibold text-center")}>Sign in</Text>
               </TouchableOpacity>
                
            </ImageBackground>
        </View>
    )
}

export default LoginScreen
