import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import useAuth from "../hooks/useAuth";
import getMatchedUserInfo from "../lib/getMatchedUserInfo";
import tw from "tailwind-rn";

const ChatRow = ({ matchDetails }) => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [matchUserInfo, setMatchUserInfo] = useState(null);

  useEffect(() => {
    setMatchUserInfo(getMatchedUserInfo(matchDetails.users, user.uid));
  }, [matchDetails, user]);

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
        <Text>{"send a message"}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ChatRow;
