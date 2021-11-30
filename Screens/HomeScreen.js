import { useNavigation } from "@react-navigation/core";
import React, { useLayoutEffect, useState, useRef, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  Button,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import tw from "tailwind-rn";
import useAuth from "../hooks/useAuth";
import { AntDesign, Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import Swiper from "react-native-deck-swiper";
import {
  query,
  where,
  doc,
  onSnapshot,
  collection,
  setDoc,
  getDocs,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import generateId from "../lib/generateId";

const DUMMYDATA = [
  {
    firstName: "raj",
    lastName: "chakraborty",
    occupation: "student",
    photoURL:
      "https://picjumbo.com/wp-content/uploads/alone-with-his-thoughts-1080x720.jpg",
    age: "25",
    id: 123,
  },
  {
    firstName: "raj",
    lastName: "chakraborty",
    occupation: "student",
    photoURL:
      "https://api.time.com/wp-content/uploads/2019/08/better-smartphone-photos.jpg",
    age: "25",
    id: 456,
  },
  {
    firstName: "raj",
    lastName: "chakraborty",
    occupation: "student",
    photoURL:
      "https://picjumbo.com/wp-content/uploads/alone-with-his-thoughts-1080x720.jpg",
    age: "25",
    id: 789,
  },
];

const HomeScreen = () => {
  const navigation = useNavigation();

  const [profiles, setProfiles] = useState([]);

  const { user, logout } = useAuth();
  // console.log(user)

  const swipeRef = useRef(null);

  useLayoutEffect(
    () =>
      onSnapshot(doc(db, "users", user.uid), (snapshot) => {
        // console.log(snapshot)
        if (!snapshot.exists()) {
          navigation.navigate("Modal");
        }
      }),
    []
  );

  useEffect(() => {
    let unsub;

    const fetchCards = async () => {
      const passes = await getDocs(
        collection(db, "users", user.uid, "passes")
      ).then((snapshot) => snapshot.docs.map((doc) => doc.id));

      const swipes = await getDocs(
        collection(db, "users", user.uid, "swipes")
      ).then((snapshot) => snapshot.docs.map((doc) => doc.id));

      const passedUser = passes.length > 0 ? passes : ["text"];
      const swipedUser = swipes.length > 0 ? swipes : ["text"];
      // console.log([...passedUser, ...swipedUser])

      unsub = onSnapshot(
        query(
          collection(db, "users"),
          where("id", "not-in", [...passedUser, ...swipedUser])
        ),
        (snapshot) => {
          setProfiles(
            snapshot.docs
              .filter((doc) => doc.id !== user.uid)
              .map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))
          );
        }
      );
    };
    // whenever you want to call async-
    // inside a useEffect you need to wrap it with an async function
    fetchCards();
    return unsub;
  }, [db]);

  const swipeLeft = async (cardIndex) => {
    if (!profiles[cardIndex]) return;

    const userSwiped = profiles[cardIndex];
    console.log(`you swiped pass on ${userSwiped.displayName}`);

    setDoc(doc(db, "users", user.uid, "passes", userSwiped.id), userSwiped);
  };

  const swipeRight = async (cardIndex) => {
    if (!profiles[cardIndex]) return;

    const userSwiped = profiles[cardIndex];
    const loggedInProfile = await (
      await getDoc(doc(db, "users", user.uid))
    ).data();

    // check if the user swipes on you, (it is usually done in server)

    getDoc(doc(db, "users", userSwiped.id, "swipes", user.uid)).then(
      (DocumentSnapshot) => {
        if (DocumentSnapshot.exists()) {
          //user swipes on you before you swipes on her
          //create a Match
          console.log(`you matched with ${userSwiped.displayName}`);

          setDoc(
            doc(db, "users", user.uid, "swipes", userSwiped.id),
            userSwiped
          );

          //create a match
          setDoc(doc(db, "matches", generateId(user.uid, userSwiped.id)), {
            users: {
              [user.uid]: loggedInProfile,
              [userSwiped.id]: userSwiped,
            },
            usersMatched: [user.uid, userSwiped.id],
            Timestamp: serverTimestamp(),
          });

          navigation.navigate("Match", {
            loggedInProfile,
            userSwiped,
          });
        } else {
          console.log(
            `you swiped on ${userSwiped.displayName} (${userSwiped.job})`
          );

          setDoc(
            doc(db, "users", user.uid, "swipes", userSwiped.id),
            userSwiped
          );
        }
      }
    );
  };

  return (
    <SafeAreaView style={tw("flex-1")}>
      {/* header */}
      <View style={tw("flex-row items-center justify-between px-5")}>
        <TouchableOpacity onPress={logout}>
          <Image
            style={tw("h-10 w-10 rounded-full")}
            source={{ uri: user.photoURL }}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
          <Image
            style={tw("h-10 w-20 rounded-full")}
            source={require("../image/logo1-removebg-preview.png")}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
          <MaterialIcons name="chat" size={30} color="#54b7de" />
        </TouchableOpacity>
      </View>

      {/* cards */}
      <View style={tw("flex-1 -mt-6")}>
        <Swiper
          ref={swipeRef}
          containerStyle={{ backgroundColor: "transparent" }}
          cards={profiles}
          stackSize={5}
          cardIndex={0}
          animateCardOpacity
          verticalSwipe={false}
          onSwipedLeft={(cardIndex) => {
            console.log("Swipe notpass");
            swipeLeft(cardIndex);
          }}
          onSwipedRight={(cardIndex) => {
            console.log("Swipe pass");
            swipeRight(cardIndex);
          }}
          overlayLabels={{
            left: {
              title: "NOT",
              style: {
                label: {
                  textAlign: "right",
                  color: "red",
                },
              },
            },
            right: {
              title: "HOT",
              style: {
                label: {
                  textAlign: "left",
                  color: "green",
                },
              },
            },
          }}
          renderCard={(card) =>
            card ? (
              <View
                key={card.id}
                style={tw("relative bg-blue-500 h-3/4 rounded-xl")}
              >
                <Image
                  style={tw("h-full w-full")}
                  source={{ uri: card.photoURL }}
                />

                <View
                  style={tw(
                    "absolute bottom-0 bg-white w-full justify-between flex-row items-center h-20 px-6 py-2"
                  )}
                >
                  <View>
                    <Text style={tw("text-xl font-bold")}>
                      {card.displayName}
                    </Text>
                    <Text>{card.job}</Text>
                  </View>
                  <Text style={tw("text-2xl font-bold")}>{card.age}</Text>
                </View>
              </View>
            ) : (
              <View
                style={[
                  tw(
                    "relative bg-white h-3/4 rounded-xl justify-center items-center"
                  ),
                ]}
              >
                <Text styles={tw("font-bold pb-5")}>No more profiles</Text>
                <Image
                  style={tw("h-20 w-20")}
                  height={100}
                  width={100}
                  source={{ uri: "https://links.papareact.com/6gb" }}
                />
              </View>
            )
          }
        />
      </View>

      <View style={tw("flex flex-row justify-evenly")}>
        <TouchableOpacity
          onPress={() => swipeRef.current.swipeLeft()}
          style={tw(
            "items-center justify-center rounded-full w-16 h-16 bg-red-200"
          )}
        >
          <Entypo name="cross" size={30} color="red" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => swipeRef.current.swipeRight()}
          style={tw(
            "items-center justify-center rounded-full w-16 h-16 bg-green-200"
          )}
        >
          <AntDesign name="heart" size={24} color="green" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
