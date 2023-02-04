// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import 'firebase/firestore'
import { getFirestore } from "firebase/firestore";
import {getStorage} from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCu6A7z9ZSzb9kBJ05YYwntdBJdH-DTG_k",
  authDomain: "fb-crud-react-aff5c.firebaseapp.com",
  projectId: "fb-crud-react-aff5c",
  storageBucket: "fb-crud-react-aff5c.appspot.com",
  messagingSenderId: "441919959467",
  appId: "1:441919959467:web:1bc4deada4bbb15b42e2ee"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);