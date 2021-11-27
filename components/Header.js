import React from "react";
import { View, Text } from "react-native";
import tw from "tailwind-rn";
import { Foundation, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";

const Header = ({ title, callEnabled }) => {
  const navigation = useNavigation();
  return (
    <View style={tw("p-2  items-center justify-between")}>
      <View>
        <Text style={tw("text-2xl font-bold pl-2")}>{title}</Text>
      </View>
    </View>
  );
};

export default Header;
