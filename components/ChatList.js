import React, { useEffect, useState } from 'react'
import { View, Text, FlatList } from 'react-native'
import {onSnapshot, collection, query, where} from "@firebase/firestore"
import {db} from "../firebase"
import useAuth from "../hooks/useAuth"
import ChatRow from '../components/ChatRow'
import tw from 'tailwind-rn'


const ChatList = () => {
    const [matches, setMatches] = useState([])
    const {user} = useAuth()

    useEffect(() => 
        onSnapshot(query(collection(db, 'matches'), where("usersMatched", 'array-contains', user.uid)
        ), (snapshot) => setMatches(snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }))))
    , [user])

    // console.log(matches)
    return matches.length > 0 ? (
     <FlatList style={tw("h-full")}
            data={matches}
            keyExtractor={item => item.id}
            renderItem={({item}) => <ChatRow matchDetails= {item}/> } 
     />
    ) : (
        <View>
            <Text style={tw('text-center text-lg')}>No one to text</Text>
        </View>
    )
}

export default ChatList
