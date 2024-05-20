import React, { useEffect, useState } from 'react'
import './login.css'
import axios from 'axios'
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/firebaseConfig';
import { createUserWithEmailAndPassword, getRedirectResult, signInWithPopup, GoogleAuthProvider  } from "firebase/auth";
import {useDispatch} from 'react-redux';
import { setUser } from '../../redux/userSlice';

export default function SignUp() {
    document.title = 'SignUp | VIM Corn.';
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading ]= useState(false);
    const [error, setError ] = useState('');
    const [invalid, setInvalid]= useState(false)
    const [input, setInput] = useState({
        username:'',
        email:'',
        Password:'',
        cPassword:'',
        photoURL: ''
    })
    const handleSignup = async (e) =>{
        e.preventDefault();
        createUserWithEmailAndPassword(auth, input.email, input.Password ,input.username).then(setIsLoading(true))
        .then(async(userCredential) => {
            const user = userCredential.user;
            input.photoURL = user.photoURL;
            setIsLoading(true);
            console.log(user);
            dispatch(setUser({id: user.uid, email: user.email, pic_url: user.photoURL}));
            const res = await axios.post('http://localhost:3200/auth/login/success',input);
            console.log(res);
            navigate('/login');
        })
        .catch((error) => {
            console.log(error.code);
            console.log(error.message);
            setError(error.message);
            setInvalid(true);
            setIsLoading(false);
        });

    }
    const handleChange = (event) =>{
        const {name , value } = event.target;
        setInvalid(false)
        setInput((prev)=>({
            ...prev, [name]:value
        }))
    }
    function match(){
        if((input.Password !== input.cPassword)&& input.cPassword !== '' )
        return 'red'
    }
    const googleAuth = () =>{
        const GoogleProvider = new GoogleAuthProvider();
        signInWithPopup(auth, GoogleProvider).then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const userD = result.user;
            console.log(userD);
            console.log(token);
            navigate('/')
          }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.customData.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
            console.log(errorCode);
            console.log(errorMessage);
            console.log(email);
            console.log(credential);
          });
    }
    useEffect(()=>{
        getRedirectResult(auth)
        .then(async(result) => {
         const credential = GoogleAuthProvider.credentialFromResult(result);
         const token = credential.accessToken;
         const user = result.user;
         await axios.post('http://localhost:3200/auth/google/login/success',user)
         console.log(user)
         dispatch(setUser({id: user.uid, email: user.email, name: user.displayName, pic_url: user.photoURL}));
         navigate('/');
       }).catch((error) => {
         console.log(error.code);
         console.log(error.message);
         console.log(error.customData.email);
         console.log(GoogleAuthProvider.credentialFromError(error));
       });
    })
  return (
    <main className='bottom-part' style={{width:'99%', position:'absolute', top:'5px', left:"0"}}>
      <div className="container-xxl my-2 py-3" id="loginPortal">
            
        <div className="headerText"> Welcome to <img src="./public/assets/VIM icon.png" height="45" width="40" className=" mx-2" alt=""/></div>
        <p className="text-center" style={{color:"lightgrey"}}>Please signup into VIM Corn.com. to continue</p>
        {/* <p className='text-center' style={{background:"rgba(240, 202, 202, 0.486)", color:"rgb(224, 62, 62)"}}>{invalid&& "User already exist !"}</p> */}
        {invalid && 
            <Alert variant="danger" onClose={() => setInvalid(false)} dismissible>
                <p className='p-0 m-0'>{error}</p>
            </Alert>
        }
        
        <div className='d-flex my-2'>
            <form className="" onSubmit={handleSignup} id="logindetail" style={{borderRight:"1px solid grey"}}>
                <section className="userDetail">
                    <div className="name">
                        <div className="inputText">
                            <label htmlFor="UserId">Username <span>*</span></label>
                            <input onChange={handleChange} type="text" name="username" placeholder="Enter user id " required/>
                        </div>
                    </div>
                    <div className="inputText">
                        <label htmlFor="EmailorPhoneNumber">Email <span>*</span></label>
                        <input onChange={handleChange} type="email" name="email" placeholder="Enter email id" required/>
                    </div>
                    
                    <div className="inputText">
                        <div className="passwordS">
                            <label style={{width:"100%",color: match()}} htmlFor="password">New Password : <span>*</span></label>
                            <input onChange={handleChange} type="password" name="Password" autoComplete="off" placeholder="New password" required/>
                        </div>
                        <div className="passwordS">
                            <label style={{width:"100%", color: match()}} htmlFor="password">Confirm Password : <span>*</span></label>
                            <input onChange={handleChange} type="password" name="cPassword" autoComplete="off" placeholder="Confirm password"  required/>
                        </div>
                    </div>
                    <p className="text-center">Already have an account ? <Link to="/login">Login</Link></p>
                    <div className="res-log">
                        <button type="reset" className="resetBtn">Reset</button>
                        <button type="submit" className="loginBtn text-center">{isLoading?
                        <div className="spinner-border spinner-border-sm text-light" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        :"Sign Up"}</button>
                    </div>
                </section>
            </form>
            <div className="d-flex flex-column justify-content-center mx-3">
                        <button className="btn btn-outline-info my-2" onClick={googleAuth} role="button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="me-3 bi bi-google" viewBox="0 0 16 16">
                                <path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z"/>
                            </svg>
                            Continue with Google
                        </button>
                        <button className="btn btn-outline-warning my-2" onClick={googleAuth} role="button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="me-2 bi bi-facebook" viewBox="0 0 16 16">
                            <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/>
                            </svg>
                            Continue with Facebook
                        </button>
                </div>
        </div>
    </div>
    </main>
  )
}
