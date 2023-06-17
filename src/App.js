import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout, selectUser } from './components/userSlice';
import { auth, onAuthStateChanged } from './firebase_setup/firebase';
import Main from "./layouts/Main";
import './App.scss';

function App() {
  // console.log("Inside App.js");
const user = useSelector(selectUser);
const dispatch = useDispatch();

// check at page load if a user is authenticated
  useEffect(() => {
    onAuthStateChanged(auth, (userAuth) => {
      if (userAuth) {
        // console.log(userAuth);
        // user is logged in, send the user's details to redux, store the current user in the state
        dispatch(
          login({
            email: userAuth.email,
            uid: userAuth.uid,
            uName: userAuth.displayName,
          })
        );
      } else {
        dispatch(logout());
      }
    });
  }, []);
  // console.log(user);
  return (
    // check if a user is logged in, display the login form, else display the rest of the app 
        // !user ? <Login /> : <Main />
        <BrowserRouter>
          <Main />
        </BrowserRouter>
        
  );
}

export default App;
