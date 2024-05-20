import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import userContext from '../context/user/userContext';

export default function ClipsPlayer() {
    // const vid = document.getElementById('myClips');
    // const [toggle, setToggle] = useState(true)
    // function playVid() { 
    //     if(toggle){
    //         setToggle(false)
    //         vid.play(); 
    //         console.log(toggle)
    //     } else{
    //         setToggle(true);
    //         vid.pause();
    //         console.log(toggle)
    //     }
    //   } 
    const BASE_URL = 'http://localhost:3200';
    const props = useContext(userContext);
    const currUser = props.currUser;
    const [clip, setClip] = useState({});
    const [toggle, setToggle] = useState({})
    const [subscribed, setSubscribe] = useState(false)
    const [liked, setLiked] = useState(false)
    const [disLiked, setDisLiked] = useState(false)
    const [cmnt, setCmnt] = useState(false)
    const params = useParams();
    const [cmntBox, setCmntBox] = useState({})
    const navigate = useNavigate()

    const playNext = async(id) =>{
        console.log("next video " + id)
        const res = await axios.get(`${BASE_URL}/api/play/clip/next/${id}`)
        setClip(res.data)
        console.log(res.data)
        params.id = clip.id
        // navigate(`/play/clips/${clip.id}`)
    }
    const next = ()=> {
        // setInterval(() => {
            setToggle({transform:'translate(0,-100%)', transition:"ease-in 200ms"})
        // }, 1000);
        setTimeout(() => {
            setToggle({})
        }, 400);
    }
    const prev = ()=> {
        // setInterval(() => {
            setToggle({transform:'translate(0,100%)', transition:"ease-in 200ms"})
        // }, 1000);
        setTimeout(() => {
            setToggle({})
        }, 400);
    }
    const subscribe = async () =>{
        if(currUser){
            if(subscribed){
                setSubscribe(false)
                // const res = await axios.put(`${BASE_URL}/api/subscribe/video/${currUser.email}`, videoPlayer)
            } else{
                setSubscribe(true)
                // const res = await axios.put(`${BASE_URL}/api/subscribe/video/${currUser.email}`, videoPlayer)
            }
        } else{
            navigate('/login')
        }
    }
    const likeClips = async ()=> {
        if(currUser){
            if(liked){
                setLiked(false)
                setDisLiked(false)
                const res = await axios.put(`${BASE_URL}/api/like/clips/${params.id}?toggle=like`, currUser)
            } else{
                setLiked(true)
                setDisLiked(false)
                const res = await axios.put(`${BASE_URL}/api/like/clips/${params.id}?toggle=like`, currUser)
            }
            console.log(liked)
        } else{
            navigate('/login');
        }
    }
    const DisLikeClips = async ()=> {
        if(currUser){
            if(disLiked){
                setLiked(false)
                setDisLiked(false)
                const res = await axios.put(`${BASE_URL}/api/like/clips/${params.id}?toggle=dislike`, currUser)
            } else{
                setLiked(false)
                setDisLiked(true)
                const res = await axios.put(`${BASE_URL}/api/like/clips/${params.id}?toggle=dislike`, currUser)
            }
            console.log(disLiked)
        } else{
            navigate('/login');
        }
    }
    const clickComment = async ()=> {
        if(currUser){
            if(!cmnt){
                setCmnt(true);
                setCmntBox({background:'rgb(33,35,39)', width:'400px', transition:'ease-in-out 200ms'})
            } else{
                setCmnt(false)
                setCmntBox({width:"0px",transition:'ease-in-out 600ms'})
            }
            console.log(cmnt)
        } else{
            navigate('/login');
        }
    }
    useEffect(()=>{
        const fetchClips = async () =>{
            try{
                const res = await axios.get(`${BASE_URL}/api/play/clip/${params.id}`)
                const jsonData = res.data;
                setClip(jsonData);

                const res2 = await axios.get(`${BASE_URL}/api/clips/handle/${params.id}?userid=${currUser.email}`);
                // console.log(res2.data)
                // if(res2.data.issubscribed){setSubscribe(true)} else{setSubscribe(false)}
            }catch(err){
                alert(err.message);
            }
        }
        fetchClips()
    },[])
  return (
    <main className='bottom-part'>
        <section className='d-flex justify-content-center mt-2' >
            <div className='d-flex justify-content-center' style={{overflow:'hidden'}}>
                <div className='d-flex flex-column justify-content-between me-3'>
                    <div className='clips-handle-button'>
                        <button title='Previous clip' className='btn btn-sm btn-secondary' onClick={()=>{playNext(clip.id); prev()}} >
                            <i className='bi bi-arrow-up' fill='currentColor' ></i>
                        </button>
                    </div>
                    <div className='clips-handle-button' onClick={()=>{playNext(clip.id); next()}}>
                        <button title='Next clip' className='btn btn-sm btn-secondary'>
                            <i className='bi bi-arrow-down' fill='currentColor'></i>
                        </button>
                    </div>
                </div>
                <div className='d-flex' style={toggle}>
                    <div>
                        <video id='myClips'  controlsList='nodownload nofullscreen'  controls loop src={clip.clip_url} style={{width: "319px", height: "567px", left:" 0px", top: "0px", background:'grey', borderRadius:'10px'}}></video>
                        <div style={{position:'absolute', top:'0',width:'319px', transform:"translate(0,15%)"}}>
                            <div className='d-flex align-items-center mx-2'>
                                <Link to={`/others/profile/${clip.userid}`} className='me-2'>
                                    <img src={clip.img} height='45px' width='45px' className='rounded-5' alt="" />
                                </Link>
                                <div className='subscribe' title='Subscribe'>
                                    <button onClick={subscribe} style={{background: subscribed?"rgb(60, 20, 159)":null}} className='btn btn-sm'>{subscribed?"Subscribed":"Subscribe"}</button>
                                </div>
                            </div>
                            <p>{clip.caption}</p>
                        </div>
                    </div>
                    <div className='d-flex align-items-end'>
                        <div className='clips-handle mb-2'>
                            <div className='clips-handle-button'>
                                <button onClick={likeClips} title='Like the video' className='btn btn-sm btn-secondary' style={{color: liked?'black':'', background: liked?'white':''}}>
                                    <svg className='' xmlns="http://www.w3.org/2000/svg" height="24" fill='currentColor' viewBox="0 -960 960 960" width="24" ><path  d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z"/></svg>
                                </button>
                                <p className='m-0 p-0'>{clip.likes}</p>
                            </div>
                            <div className='clips-handle-button'>
                                <button onClick={DisLikeClips} title='Dislike the video'  className='btn btn-sm btn-secondary' style={{color: disLiked?'black':'', background: disLiked?'white':''}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill='currentColor' height="24" viewBox="0 -960 960 960" width="24"><path d="M240-840h440v520L400-40l-50-50q-7-7-11.5-19t-4.5-23v-14l44-174H120q-32 0-56-24t-24-56v-80q0-7 2-15t4-15l120-282q9-20 30-34t44-14Zm360 80H240L120-480v80h360l-54 220 174-174v-406Zm0 406v-406 406Zm80 34v-80h120v-360H680v-80h200v520H680Z"/></svg>
                                </button>
                                <p className='m-0 p-0'>Dislike</p>
                            </div>
                            <div className='clips-handle-button'>
                                <button title='Comment on this clips'  className='btn btn-sm btn-secondary' onClick={clickComment} style={{color: cmnt?'black':'', background: cmnt?'white':''}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-chat-heart-fill" viewBox="0 0 16 16">
                                        <path d="M8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6-.097 1.016-.417 2.13-.771 2.966-.079.186.074.394.273.362 2.256-.37 3.597-.938 4.18-1.234A9 9 0 0 0 8 15m0-9.007c1.664-1.711 5.825 1.283 0 5.132-5.825-3.85-1.664-6.843 0-5.132"/>
                                    </svg>
                                </button>
                                <p className='m-0 p-0'>0</p>
                            </div>
                            <div className='clips-handle-button'>
                                <button title='Share this video' className='btn btn-sm btn-secondary'>
                                    <svg className='me-1' xmlns="http://www.w3.org/2000/svg" fill='currentColor' x="0px" y="0px" width="20" height="20" viewBox="0 0 50 50">
                                        <path d="M 4 4 L 4 44 A 2.0002 2.0002 0 0 0 6 46 L 44 46 A 2.0002 2.0002 0 0 0 46 44 L 46 32 L 42 32 L 42 42 L 8 42 L 8 4 L 4 4 z M 35.978516 4.9804688 A 2.0002 2.0002 0 0 0 34.585938 8.4140625 L 37.171875 11 L 36.048828 11 C 25.976906 10.74934 19.618605 12.315463 15.953125 16.726562 C 12.287645 21.137662 11.831327 27.512697 12 36.039062 A 2.0003814 2.0003814 0 1 0 16 35.960938 C 15.835673 27.654299 16.533777 22.2844 19.029297 19.28125 C 21.524817 16.2781 26.334094 14.76066 35.951172 15 L 35.974609 15 L 37.171875 15 L 34.585938 17.585938 A 2.0002 2.0002 0 1 0 37.414062 20.414062 L 43.236328 14.591797 A 2.0002 2.0002 0 0 0 43.619141 14.208984 L 44.828125 13 L 43.619141 11.791016 A 2.0002 2.0002 0 0 0 43.228516 11.400391 L 37.414062 5.5859375 A 2.0002 2.0002 0 0 0 35.978516 4.9804688 z"></path>
                                    </svg>
                                </button>
                                <p className='m-0 p-0'>Share</p>
                            </div>
                            <div className='clips-handle-button'>
                                <button className='btn btn-sm btn-secondary'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                                        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                                    </svg>
                                </button>
                            </div>
                            <div className='clips-handle-button'>
                                <Link to={`/others/profile/${clip.userid}`}>
                                    <img src={clip.img} height='45px' width='45px' className='rounded-2' alt="" />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className='rounded-4 ' style={cmntBox}>
                        <div style={{display: cmnt?"block":"none"}}>
                            <div className='d-flex justify-content-between align-items-center m-2' style={{color:'darkgrey'}}>
                                <p className='m-0 fs-6 p-0'>Comments 0</p>
                                <i type='button' className='bi bi-x-circle' onClick={clickComment}></i>
                            </div>
                            <hr className='mt-1'style={{color:'lightgrey'}}/>
                            <div className='d-flex align-items-center px-2' style={{position:''}}>
                                <Link to={`/profile/${currUser.email}`}>
                                    <img className='me-1' src={currUser.img} height='42px' width="42px" style={{borderRadius:"50%"}} alt="user" />
                                </Link>
                                <div style={{width:'100%'}}>
                                <form className='comment-div' >
                                    <input autocomplete="off" type="text" name='comment' minLength='3' placeholder='Add a comment here...' required/>
                                    {cmnt ?<div>
                                        <button className='btn  btn-sm btn-info' type='submit'>Post</button>
                                    </div>:null}
                                </form>                            
                                </div>
                            </div>
                            <div className='mt-3 m-1' style={{overflow:'auto', height:"430px",}}>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
  )
}
