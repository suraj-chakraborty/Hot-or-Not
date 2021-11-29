import { useRoute } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  FlatList,
} from "react-native";
import Header from "../components/Header";
import useAuth from "../hooks/useAuth";
import tw from "tailwind-rn";
import getMatchedUserInfo from "../lib/getMatchedUserInfo";
import SendMessage from "../components/SendMessage";
import RecieverMessage from "../components/RecieverMessage";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "@firebase/firestore";
import { db } from "../firebase";

const Messages = () => {
  const { user } = useAuth();
  const { params } = useRoute();
  const { matchDetails } = params;
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    onSnapshot(
      query(
        collection(db, "matches", matchDetails.id, "messages"),
        orderBy("timestamp", "desc")
      ),
      (snapshot) =>
        setMessages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        )
    );
  }, [matchDetails, db]);

  const sendMessage = () => {
    addDoc(collection(db, "matches", matchDetails.id, "messages"), {
      timestamp: serverTimestamp(),
      userId: user.uid,
      displayName: user.displayName,
      photoURL: matchDetails.users[user.uid].photoURL,
      message: input,
    });

    setInput("");
  };

  return (
    <SafeAreaView style={tw("flex-1")}>
      <Header
        title={getMatchedUserInfo(matchDetails.users, user.uid).displayName}
        callEnabled
      />
      {/* KeyboardAvoidingView is us for avoiding of keyboard overlay on chatinput bar */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw("flex-1")}
        keyboardVerticalOffset={10}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <FlatList
            data={messages}
            inverted={-1}
            style={tw("pl-4")}
            keyExtractor={(item) => item.id}
            renderItem={({ item: message }) =>
              message.userId === user.uid ? (
                <SendMessage key={message.id} message={message} />
              ) : (
                <RecieverMessage key={message.id} message={message} />
              )
            }
          />
        </TouchableWithoutFeedback>
        <View
          style={tw(
            "flex-row bg-white justify-between items-center border-t border-gray-200 px-5 py-2"
          )}
        >
          <TextInput
            style={tw("h-10 text-lg")}
            placeholder="send a message..."
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            value={input}
          />
          <Button onPress={sendMessage} title="Send" color="blue" />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Messages;
