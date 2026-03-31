import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDom_tH4uKBTBZj9W-laP6Vj4IwJWYJrbQ",
  authDomain: "bookstore-new-2998b.firebaseapp.com",
  projectId: "bookstore-new-2998b",
  appId: "1:691244624156:web:29efee222b9eec5a4e32d9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
