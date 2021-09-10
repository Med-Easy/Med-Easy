import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const app = firebase.initializeApp({
    apiKey: "AIzaSyCbza8bXIM3nc9xEtLSM8kcDf-oVjVyVi8",
    authDomain: "med-easy-2f018.firebaseapp.com",
    projectId: "med-easy-2f018",
    storageBucket: "med-easy-2f018.appspot.com",
    messagingSenderId: "557176427355",
    appId: "1:557176427355:web:ed8282ece7882f72a6407e"
})

export const auth = app.auth();
export default app;