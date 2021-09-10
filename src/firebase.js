import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const app = firebase.initializeApp({
    apiKey: "AIzaSyCT-6Mh-EdnUwOYVgACJTYBaIbQaXVYiqI",
    authDomain: "med-easy-5dd1a.firebaseapp.com",
    projectId: "med-easy-5dd1a",
    storageBucket: "med-easy-5dd1a.appspot.com",
    messagingSenderId: "554659111349",
    appId: "1:554659111349:web:109c63a4ab7783076cb9fc"
})

export const auth = app.auth();
export default app;