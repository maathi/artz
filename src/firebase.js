import firebase from "firebase/app"
import "firebase/storage"

const firebaseConfig = {
  storageBucket: "artist-4bd1b.appspot.com",
}

firebase.initializeApp(firebaseConfig)

const storage = firebase.storage()

export default storage
