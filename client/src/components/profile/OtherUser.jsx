import React, { useContext, useEffect, useState } from 'react'
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom'
import userContext from '../context/user/userContext';
import Profile from '../../pages/Profile';
import { format } from 'timeago.js';
import axios from 'axios';

export default function OtherUser() {
    const BASE_URL = 'http://localhost:3200'
    const params = useParams();
    const navigate = useNavigate();
    const props = useContext(userContext);
    const currUser = props.currUser;
    const [isLoading, setIsLoading] = useState(true)
    const [otherUser, setUser] = useState({});
    document.title = `VIM Corn. - Profile | ${otherUser.name}`
    const [subscribed, setSubscribe] = useState(false)
    const [otherUserid , setOther ] = useState({
        userid: ''
    })
    const subscribe = async () =>{
        if(currUser){
            if(subscribed){
                setSubscribe(false)
                const res = await axios.put(`${BASE_URL}/api/subscribe/video/${currUser.email}`, otherUserid)
            } else{
                setSubscribe(true)
                const res = await axios.put(`${BASE_URL}/api/subscribe/video/${currUser.email}`, otherUserid)
            }
        } else{
            navigate('/login')
        }
    }
    useEffect(()=>{
        const fetchOtherUser = async() =>{
            try{
                const res = await axios.get(`${BASE_URL}/user/callback/${params.userid}`);
            console.log(res.data)
            setUser(res.data);
            otherUserid.userid = res.data.email

            const res2 = await axios.get(`${BASE_URL}/api/issubscribe?videoid=${params.id}&userid=${currUser.email}&other_user=${params.userid}`);
            if(res2.data.issubscribed){setSubscribe(true)} else{setSubscribe(false)}
            } catch(err){
                console.log(err.message);
            } finally{
                setIsLoading(false);
            }
        }
        fetchOtherUser();
    },[])
    if(currUser.email === params.userid){
        return navigate(`/profile/${currUser.email}`)
    }
    if(isLoading){
        return (
            <main className='bottom-part'>
                <p className='text-center mt-3'>Loading...</p>
            </main>
        )
    }
  return (
    <main className='bottom-part'>
    <div className='profileElm' style={{color:"white"}}>
        
        <div className='text-end heroImage' style={{backgroundImage:`url('${otherUser.cover?otherUser.cover:"/assets/2.png"}')`}}>
          <div className='text-center ' style={{transform :"translate(12%,50%)", width:"fit-content"}}>
            <img className='userImage' src={otherUser?otherUser.img:'/assets/image.png'} alt="user" />
          </div>
        </div>
        <div className='userInfo'>
            <div className=''>
              <strong>{otherUser.name}</strong>
              <p className='m-0'>@{otherUser.username} - {otherUser.subscriber} subscriber</p>
              <p className='m-0'>{otherUser.about}</p>
              <p className='m-0' style={{color:"grey", fontSize:"0.85rem"}}>Last update at - {format(otherUser.timestamps, 'en_US')}</p>
              
            </div>
            <div className='subscribe mt-2' title='Subscribe' style={{transform:'translate(0%,0%)',width:'fit-content'}}>
                <button onClick={subscribe} style={{background: subscribed?"rgb(60, 20, 159)":null}} className='btn btn-sm'>{subscribed?"Subscribed":"Subscribe"}</button>
            </div>
        </div>
        
    </div>
      <div className='mx-3 mt-3 profileNavigation' >
            <ul className="nav " >
              <li className="nav-item 1st">
                <Link className="nav-link  py-1" aria-current="page" to={`home/${params.userid}`}>Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link  py-1" to={`your/videos/${params.userid}`}>Videos</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link  py-1" to={`subscriptions/${params.userid}`}>Subscriptions</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link  py-1" to="#">Clips</Link>
              </li>
              <li className="nav-item mx-2 d-flex align-items-center">
                <form className='searchIntoProfile px-2 d-flex align-item-center'>
                  <button className="btn btn-sm p-0 m-0 me-2 bi bi-search border-0" type="submit" style={{color:"lightgrey"}}></button>
                  <input type="search" name='search' id='search' required/>
                </form>
              </li>
            </ul>
          </div>
          <Outlet/>
    </main>
  )
}
