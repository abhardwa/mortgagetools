/* eslint-disable no-loop-func */
import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, Container, Form } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import {
  auth,
  createUserWithEmailAndPassword,
  updateProfile,
  updateEmail,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from '../firebase_setup/firebase';
import { useDispatch, useSelector} from 'react-redux';
import { login, logout, selectUser } from '../components/userSlice';


function Login({show, handleClose, handleOpen, location, action}) {
// use state constants for the the form inputs
  const [email, setEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [btnState, setBtnState] = useState(false);
  const dispatch = useDispatch();
  const nav = useNavigate();
  const user = useSelector(selectUser);
  const ref = useRef(action);
  const initialRender = useRef(true);

  
const handleOpenModal = (e) => {
  e?.preventDefault();
  setShowModal(true);
};

const handleCloseModal = (e) => {
  e?.preventDefault();
  setShowModal(false);
};

  // console.log(action, show, handleOpen, handleClose);
  
  // setShowM(isLoggedIn===true?show:true);

  // console.log(location);

  const loginToApp = (e) => {
    e.preventDefault();
    // console.log(show);
    handleOpenModal();

    // Sign in an existing user with Firebase
    signInWithEmailAndPassword(auth, email, password)
    // returns  an auth object after a successful authentication
    // userAuth.user contains all our user details
      .then((userAuth) => {
      // store the user's information in the redux state
        dispatch(
          login({
            email: userAuth.user.email,
            uid: userAuth.user.uid,
            fName: userAuth.user.displayName.split(":")[0],
            LName: userAuth.user.displayName.split(":")[1],
          })
        );
        setIsLoggedIn(true);
        handleCloseModal();
        // console.log(user);
        nav(-1);
      })
      // display the error if any
      .catch((err) => {
        alert(err);
      });
  };

// A quick check on the name field to make it mandatory
  const Register = (e) => {
    e.preventDefault();
    handleOpenModal();
    if (initialRender.current) {
        initialRender.current = false;
        return;
    }
      
    if (!fName) {
      return alert('Please enter a first name');
    }
    if (!lName) {
      return alert('Please enter a last name');
    }

    // Create a new user with Firebase
    createUserWithEmailAndPassword(auth, email, password)
      .then((userAuth) => {
      // Update the newly created user with a display name and a picture
        // console.log(userAuth.user);
        updateProfile(userAuth.user, {
          displayName: fName + ":" + lName,
        })
          .then((userAuth)=>{
            // console.log(userAuth.user);
            // Dispatch the user information for persistence in the redux state
            dispatch(
              login({
                email: userAuth.user.email,
                uid: userAuth.user.uid,
                fName: userAuth.user.displayName.split(":")[0],
                LName: userAuth.user.displayName.split(":")[1],
              })
            );
            setIsLoggedIn(true);
            handleCloseModal();
            nav(-1);
          })
          .catch((error) => {
            console.log(error.message );
            console.log('user not updated');
            setIsLoggedIn(true);
            handleCloseModal();
            nav(-1);
          });
      })
      .catch((error) => {
        console.log(error.message );
        alert(error);
      });
  };
  const Cancel = (e) => {
    // console.log("Inside Cancel");
    e.preventDefault();
    handleCloseModal();
    nav(-1);
  }
  const pwdReset = (e) => {
    // console.log("Inside pwdReset");
    e.preventDefault();
      sendPasswordResetEmail(auth, email)
        .then(() => {
          console.log("password reset email sent");
          handleCloseModal();
          nav(-1);
          // Password reset email sent!
          // ..
        })
        .catch((error) => {
          console.log(error.message );
          // ..
        });

  }
  const PromptForCredentials = () => {
    return (
    <Modal show={true} onHide = {handleClose}  onClick={() => {setBtnState(btnState => !btnState)}}>
      <Container >
      <Modal.Header closeButton>
          <Modal.Title  style={{fontSize:'2rem', fontWeight:'bold'}} className="text-orange-600">Please re-enter you Login Email/Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label className = "mt-4" style={{fontSize:'1.6rem'}}>Password</Form.Label>
              <Form.Control
                style={{fontSize:'1.6rem'}}
                className=""
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer  style={{display: "block"}}>
        <div style={{display: "flex", justifyContent:"center"}}>
        <Button className='login btn btn-primary' style={{marginRight:"1rem", fontSize:"1.6rem"}} onClick={emailChg}>
          Submit
        </Button>
        <Button className='cancel btn btn-secondary' style={{marginRight:"1rem", fontSize:"1.6rem"}} onClick={(event)=>{ref.current="cancel"; Cancel(event)}}>
          Cancel
        </Button>
        </div>
      </Modal.Footer>
    </Container>
    </Modal>
    );
  }

  const emailChg = (e) => {
    // console.log("Inside emailChg");
    e.preventDefault();
    console.log(auth.currentUser, newEmail);
    updateEmail(auth.currentUser, newEmail)
    .then(() => {
        console.log("email updated");
        handleCloseModal(); 
        nav(-1);
        return;
        // Email updated!
        // ...
      })
    .catch((error) => {
        console.log(error.message );
        // PromptForCredentials();
        const credential = EmailAuthProvider.credential(
          auth.currentUser.email,
          password
        )
        // Get the current user
        reauthenticateWithCredential(auth.currentUser, credential).then(() => {
          console.log(user, email);
          updateEmail(auth.currentUser, newEmail)
          .then(() => {
              console.log("email updated");
              handleCloseModal(); 
              nav(-1);
              return;
              // Email updated!
              // ...
            })
          .catch((error) => {
              console.log(error.message );
          });

          // User re-authenticated.
        }).catch((error) => {
            console.log(error.message );
        });
        // ..
      });
  }

  const AppLogout = (e) => {
    console.log("Inside AppLogout");
    e.preventDefault();
    auth.signOut();
    setIsLoggedIn(false);
    dispatch(logout());
    // console.log(useSelector(selectUser));
    handleCloseModal();
    nav(-1);
    
    // return nav('/'); // Redirects to the previous route 
  };

  useEffect(() => {
    // setShowM(false);
    function handleMyClick (e) {
      // console.log(e.target.className);
        if (e.target.className==="fade modal show" || e.target.className==="btn-close") {
          e.preventDefault();
          // setShowModal(!showModal);
          // console.log(e.target.className, show);
          handleCloseModal();
          nav(-1); // Redirects to the previous route or history.push('/home') for a specific route
        }
    }
    document.body.addEventListener('click', handleMyClick, true);
    // cleanup function to remove this instance of eventlistner
    return () => {
            document.body.removeEventListener('click', handleMyClick, true);
        }
  }, [btnState]);

    // console.log(showM);

  const renderLogin = 
    <Modal show={showModal} onHide = {handleClose}  onClick={() => {setBtnState(btnState => !btnState)}}>
      <Container >
      <Modal.Header closeButton>
          <Modal.Title  style={{fontSize:'2rem', fontWeight:'bold'}} className="text-orange-600">Log In</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label style={{fontSize:'1.6rem'}}>Email address</Form.Label>
                <Form.Control
                  style={{fontSize:'1.6rem'}}
                  type="email"
                  placeholder="name@example.com"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
            <Form.Label className = "mt-4" style={{fontSize:'1.6rem'}}>Password</Form.Label>
              <Form.Control
                style={{fontSize:'1.6rem'}}
                className=""
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer  style={{display: "block"}}>
        <div style={{display: "flex", justifyContent:"center"}}>
        <Button className='login btn btn-primary' style={{marginRight:"1rem", fontSize:"1.6rem"}} onClick={(event) => loginToApp(event)}>
          Log in
        </Button>
        <Button className='register btn btn-success' style={{marginRight:"1rem", fontSize:"1.6rem"}} onClick={(event)=>{ref.current="register"; Register(event)}}>
          Register
        </Button>
        <Button className='cancel btn btn-secondary' style={{marginRight:"1rem", fontSize:"1.6rem"}} onClick={(event)=>{ref.current="cancel"; Cancel(event)}}>
          Cancel
        </Button>
        </div>
        <div style={{display: "flex", justifyContent:"center"}}>
        {/* <Button className='emailchg btn btn-info' style={{marginRight:"3rem", marginTop:"2rem", fontSize:"1.2rem"}} onClick={(event)=>{ref.current="emailchg"; emailChg(event)}}>
          Update Profile
        </Button> */}
        <p style={{marginRight:"1rem", marginTop:"3rem", fontSize:"1.2rem"}} >Forget Password?</p>
        <Button className='pwdreset btn btn-info' style={{marginRight:"1rem", marginTop:"2rem", fontSize:"1.2rem"}} onClick={(event)=>{ref.current="pwdreset"; pwdReset(event)}}>
          Password Reset
        </Button>
        </div>
      </Modal.Footer>
    </Container>
    </Modal>

    const renderRegister = 
    <Modal show={showModal} onHide = {handleClose} onClick={() => {setBtnState(btnState => !btnState)}}>
      <Container >
      <Modal.Header closeButton>
          <Modal.Title  style={{fontSize:'1.6rem', fontWeight:'bold'}} className="text-orange-600">Register</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label style={{fontSize:'1.6rem'}}>First name</Form.Label>
                <Form.Control
                  style={{fontSize:'1.6rem'}}
                  type="text"
                  placeholder=""
                  autoFocus
                  value={fName}
                  onChange={(e) => setFName(e.target.value)}
                />
            <Form.Label style={{fontSize:'1.6rem'}}>Last name</Form.Label>
                <Form.Control
                  style={{fontSize:'1.6rem'}}
                  type="text"
                  placeholder=""
                  value={lName}
                  onChange={(e) => setLName(e.target.value)}
                />
            <Form.Label style={{fontSize:'1.6rem'}}>Email address</Form.Label>
                <Form.Control
                  style={{fontSize:'1.6rem'}}
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
            <Form.Label style={{fontSize:'1.6rem'}}>Password(minimum of 6 characters)</Form.Label>
                <Form.Control
                  style={{fontSize:'1.6rem'}}
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
            <Button className="btn btn-primary" type='submit' onClick={Register}>
              Register
            </Button>
          <Button className='cancel btn btn-secondary' onClick={(event)=>{ref.current="cancel"; Cancel(event)}}>
            Cancel
          </Button>
      </Modal.Footer>
    </Container>
    </Modal>

    const renderEmailChg = 
        <Modal show={showModal} onHide = {handleClose} onClick={() => {setBtnState(btnState => !btnState)}}>
          <Container >
          <Modal.Header closeButton>
              <Modal.Title  style={{fontSize:'1.6rem', fontWeight:'bold'}} className="text-orange-600">Change Email</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label style={{fontSize:'1.6rem'}}>Current Email</Form.Label>
                    <Form.Control
                      style={{fontSize:'1.6rem'}}
                      type="email"
                      placeholder=""
                      autoFocus
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                <Form.Label style={{fontSize:'1.6rem'}}>New Email</Form.Label>
                    <Form.Control
                      style={{fontSize:'1.6rem'}}
                      type="email"
                      placeholder=""
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                    />
                <Form.Label style={{fontSize:'1.6rem'}}>Please enter password</Form.Label>
                    <Form.Control
                      style={{fontSize:'1.6rem'}}
                      type="password"
                      placeholder=""
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
                <Button className="btn btn-primary" type='submit' onClick={emailChg}>
                  Change Email
                </Button>
              <Button className='cancel btn btn-secondary' onClick={(event)=>{ref.current="cancel"; Cancel(event)}}>
                Cancel
              </Button>
          </Modal.Footer>
        </Container>
        </Modal>
      const renderPwdReset = 
      <Modal show={showModal} onHide = {handleClose} onClick={() => {setBtnState(btnState => !btnState)}}>
        <Container >
        <Modal.Header closeButton>
            <Modal.Title  style={{fontSize:'1.6rem', fontWeight:'bold'}} className="text-orange-600">Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label style={{fontSize:'1.6rem'}}>Current Email</Form.Label>
                  <Form.Control
                    style={{fontSize:'1.6rem'}}
                    type="email"
                    placeholder=""
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
              <Button className="btn btn-primary" type='submit' onClick={pwdReset}>
                Reset Password
              </Button>
            <Button className='cancel btn btn-secondary' onClick={(event)=>{ref.current="cancel"; Cancel(event)}}>
              Cancel
            </Button>
        </Modal.Footer>
      </Container>
      </Modal>

      const renderLogout = 
        // <div>
        //     {<AppLogout/>}
        // </div>
        <Modal show={showModal} onHide = {handleClose} onClick={() => {setBtnState(btnState => !btnState)}}>
        <Container >
        <Modal.Header closeButton>
            <Modal.Title className="text-orange-600">Log Out</Modal.Title>
        </Modal.Header>
        <p className = " text-3xl text-blue-800 align-middle">Are you sure you want to log out??</p>
        <Modal.Body>
        </Modal.Body>
        <Modal.Footer>
              <button className="btn btn-danger" type='submit' onClick={AppLogout}>
                Click here to Logout...
              </button>
        </Modal.Footer>
      </Container>
      </Modal>
 
  return (
    <div>
       {ref.current ==="login"? renderLogin:ref.current ==="logout"?renderLogout:ref.current ==="emailchg"?renderEmailChg:ref.current ==="pwdreset"?renderPwdReset:renderRegister}
    </div>
  );
}

export default Login;
