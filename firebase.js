// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {  getAuth  } from "firebase/auth"
import {  getFirestore  } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCXzBNpS-F-brGr6CPTulrQqolkuGZYDs8",
  authDomain: "tinder-clone-7654a.firebaseapp.com",
  projectId: "tinder-clone-7654a",
  storageBucket: "tinder-clone-7654a.appspot.com",
  messagingSenderId: "418927558427",
  appId: "1:418927558427:web:0b27d15d257a46b6459dbe"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth()
const db = getFirestore()

export {  auth, db }