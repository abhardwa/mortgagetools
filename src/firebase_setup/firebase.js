// Import the functions you need from the SDKs you need
// import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    updateProfile, 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    sendEmailVerification,
    sendPasswordResetEmail,
    updateEmail,
    reauthenticateWithCredential,
    EmailAuthProvider,
    signOut 
    } from 'firebase/auth';
// import { getAnalytics } from "firebase/analytics";
// import { getFirestore } from "@firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId,
  measurementId: process.env.REACT_APP_measurementId
};

// Initialize Firebase
initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// export const firestore = getFirestore(app);

//init services
const auth = getAuth();

// Configure FirebaseUI.
// const uiConfig = {
//   // Popup signin flow rather than redirect flow.
//   signInFlow: 'popup',
//   // We will display Google and Facebook as auth providers.
//   signInOptions: [
//     auth.GoogleAuthProvider.PROVIDER_ID,
//     auth.FacebookAuthProvider.PROVIDER_ID
//   ],
//   callbacks: {
//     // Avoid redirects after sign-in.
//     signInSuccessWithAuthResult: () => false,
//   },
// };

export {
auth,
createUserWithEmailAndPassword,
updateProfile,
onAuthStateChanged,
signInWithEmailAndPassword,
sendEmailVerification,
sendPasswordResetEmail,
updateEmail,
reauthenticateWithCredential,
EmailAuthProvider,
signOut
}
