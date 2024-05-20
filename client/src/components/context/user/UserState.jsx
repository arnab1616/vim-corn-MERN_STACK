import React, { useEffect, useState } from 'react'
import UserContext from './userContext'
import axios from 'axios';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../firebase/firebaseConfig';
import { useDispatch } from 'react-redux';

export default function UserState(props) {
    const [currUser, setUser] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(()=>{
        try{
          onAuthStateChanged(auth, async (user)=>{
            if(user){
                console.log(user.uid);
                const res = await axios.get(`http://localhost:3200/user/callback/${user.email}`);
                console.log(res.data)
                const currUser = res.data;
                setUser(currUser);
                // dispatch(setUser({id: user.uid, name:currUser.name,username:currUser.username, email: currUser.email, pic_Url: currUser.img, subscriber: currUser.subscriber}));
            } else{
                // dispatch(setUser(null));
                setUser(false);
                navigate('/login')
            }
          })
        } catch(err){
          console.log(err.message);
        } finally{
            setIsLoading(false)
        }
    },[])

  return (
    <UserContext.Provider value={{currUser,isLoading}}>
      {props.children}
    </UserContext.Provider>
  )
}
