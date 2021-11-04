import 'firebase/firestore'
import { getFirestore ,collection } from "firebase/firestore"
import { getDatabase, ref } from "firebase/database";
// import 'firebase/storage'

import { initializeApp } from 'firebase/app';
// Initialize Firebase

const firebaseConfig = {
    apiKey: "AIzaSyCgELZ6lqaB6z-2XDUpIetNMf0GyaAXIbw",
    authDomain: "cs476project.firebaseapp.com",
    projectId: "cs476project",
    storageBucket: "cs476project.appspot.com",
    messagingSenderId: "657562998482",
    appId: "1:657562998482:web:7eeda8454ef8837055bf0b"
  };


  const app = initializeApp(firebaseConfig);

// const performance = firebase.performance()
// const analytics = firebase.analytics()

const db = getFirestore()

// firebase collections
const usersCollection = collection(db,'users')
const appointmentCollection = collection(db,'appointments')
// const postsCollection = db.collection('posts')
// const commentsCollection = db.collection('comments')
// const likesCollection = db.collection('likes')

// // Create a storage reference from our storage service
// const storageRef = firebase.storage().ref()
// // Create a child reference
// const avatarsRef = storageRef.child('Avatars')

const realTimeDB = getDatabase();

export {
  // storageRef,
  // avatarsRef,
  db,
  usersCollection,
  appointmentCollection,
  realTimeDB,
  // postsCollection,
  // commentsCollection,
  // likesCollection,
  // performance,
  // analytics
}

