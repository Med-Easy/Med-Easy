import React, { useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import firebase from "firebase/compat/app";
import { useHistory } from "react-router-dom";

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)
  const history = useHistory();

  function loginWithGoogle() {
  // Using a popup.
  var provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope('profile');
  provider.addScope('email');
  firebase.auth().signInWithPopup(provider).then(function(result) {
  // This gives you a Google Access Token.
  var token = result.credential.accessToken;
  // The signed-in user info.
  var user = result.user;
  if(user){
    history.push("/");
  }
  });
  }

  function signup(email, password) {
    return auth.createUserWithEmailAndPassword(email, password)
  }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
  }

  function logout() {
    return auth.signOut()
  }

//   function resetPassword(email) {
//     return auth.sendPasswordResetEmail(email)
//   }

//   function updateEmail(email) {
//     return currentUser.updateEmail(email)
//   }

//   function updatePassword(password) {
//     return currentUser.updatePassword(password)
//   }




  useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
    })
    return unsubscribe;
  }, [currentUser,history])

  const value = {
    currentUser,
    loginWithGoogle,
    signup,
    login,
    logout
    // resetPassword,
    // updateEmail,
    // updatePassword
  }

  return (
    <AuthContext.Provider value={value}>
      { !loading && children }
    </AuthContext.Provider>
  )
}