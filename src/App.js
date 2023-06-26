import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login, logout } from './store/store';
import { auth, onAuthStateChanged } from './firebase_setup/firebase';
import Main from "./layouts/Main";
import './App.scss';

function App() {
  // console.log("Inside App.js");
  const dispatch = useDispatch();

  const category = 'account'
  const label ='premium';
  const action = 'login';
  const value = 1;

  window.dataLayer.push({
    event: 'pageview'
  });

  window.dataLayer.push({
  event: 'event',
  eventProps: {
      category: category,
      action: action,
      label: label,
      value: value,
  }
});

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
  // eslint-disable-next-line
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
