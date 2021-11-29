import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import useAuth from "../hooks/useAuth";
import getMatchedUserInfo from "../lib/getMatchedUserInfo";
import tw from "tailwind-rn";
import { db } from "../firebase";
import { collection, onSnapshot, orderBy, query } from "@firebase/firestore";

const ChatRow = ({ matchDetails }) => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [lastMessage, setLastMessage] = useState("");
  const [matchUserInfo, setMatchUserInfo] = useState(null);

  useEffect(() => {
    setMatchUserInfo(getMatchedUserInfo(matchDetails.users, user.uid));
  }, [matchDetails, user]);

  useEffect(() => {
    onSnapshot(
      query(
        collection(db, "matches", matchDetails.id, "messages"),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => setLastMessage(snapshot.docs[0]?.data()?.message)
    );
  }, [matchDetails, db]);

  return (
    <TouchableOpacity
      style={tw(
        "flex-row items-center py-1 px-4 bg-white mx-1 my-1 rounded-lg"
      )}
      onPress={() =>
        navigation.navigate("Message", {
          matchDetails,
        })
      }
    >
      <Image
        style={tw("rounded-full h-16 w-16 mr-4")}
        source={{ uri: matchUserInfo?.photoURL }}
      />
      <View>
        <Text>{matchUserInfo?.displayName}</Text>
        <Text>{lastMessage || "send a message"}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ChatRow;
