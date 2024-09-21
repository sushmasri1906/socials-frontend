import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyC8PiHNUKzKl4N0iYEHJ66td2xT1oESVu8",
	authDomain: "hex-socials.firebaseapp.com",
	projectId: "hex-socials",
	storageBucket: "hex-socials.appspot.com",
	messagingSenderId: "702340815681",
	appId: "1:702340815681:web:55d9feda322965fdf25fc0",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Firebase Auth
const storage = getStorage(app); // Firebase Storage

export { auth, storage };
