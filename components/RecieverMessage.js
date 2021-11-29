import React from "react";
import { View, Text, Image } from "react-native";
import tw from "tailwind-rn";

const RecieverMessage = ({ message }) => {
  return (
    <View
      style={[
        tw(" rounded-lg rounded-tr px-5 py-3 mx-3 my-3 ml-14"),
        { alignSelf: "flex-start", backgroundColor: "#606060FF" },
      ]}
    >
      <Image
        style={tw("h-12 w-12 rounded-full absolute top-0 -left-14")}
        source={{ uri: message.photoURL }}
      />
      <Text style={tw("text-white")}>{message.message}</Text>
    </View>
  );
};

export default RecieverMessage;
