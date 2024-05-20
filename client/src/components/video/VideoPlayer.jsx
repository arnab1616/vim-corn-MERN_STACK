import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom'
import { format } from 'timeago.js';
import Recomended from './Recomended';
import userContext from '../context/user/userContext';
import CommentSection from './CommentSection';
import { useDispatch } from 'react-redux';
// import Placeholders from './Placeholders';
// import { onAuthStateChanged } from 'firebase/auth';
// import { auth } from '../../firebase/firebaseConfig';
// import { setUser } from '../../redux/userSlice';

export default function VideoPlayer() {
    const dispatch = useDispatch();
    const BASE_URL = 'http://localhost:3200';
    const props = useContext(userContext);
    const currUser = props.currUser;
    const navigate = useNavigate();
    const params = useParams();
    const [videoPlayer, setVideoPlayer] = useState({});
    const [save, setSave] = useState(false);
    document.title = `VIM Corn. - Video | ${videoPlayer.title}`
    const [isLoading, setIsLoading] = useState(true);
    const [subscribed, setSubscribe] = useState(false)
    const [liked, setLiked] = useState(false)

    const subscribe = async () =>{
        if(currUser){
            if(subscribed){
                setSubscribe(false)
                const res = await axios.put(`${BASE_URL}/api/subscribe/video/${currUser.email}`, videoPlayer)
            } else{
                setSubscribe(true)
                const res = await axios.put(`${BASE_URL}/api/subscribe/video/${currUser.email}`, videoPlayer)
            }
        } else{
            navigate('/login')
        }
    }
    const saveVideo = async()=>{
        console.log("clicked to saved")
        const config = {
            userid: currUser.email,
            video_userid : videoPlayer.userid
        }
        
        const res = await axios.post(`${BASE_URL}/api/save/video/${params.id}`, config)
        const res1 = await axios.get(`${BASE_URL}/api/get/save/video?videoid=${params.id}&userid=${currUser.email}`)
        console.log(res.data)
        if(res1.data.issaved){setSave(true) }else{setSave(false)}
    }
    const likeVideo = async ()=> {
        if(currUser){
            if(liked){
                setLiked(false)
                const res = await axios.put(`${BASE_URL}/api/like/video/${params.id}`, currUser)
            } else{
                setLiked(true)
                const res = await axios.put(`${BASE_URL}/api/like/video/${params.id}`, currUser)
            }
        } else{
            navigate('/login');
        }
    }
    useEffect(()=>{
        try{
            async function fetch (){
                const res = await axios.get(`${BASE_URL}/api/get/save/video?videoid=${params.id}&userid=${currUser.email}`)
                console.log(res.data)
                if(res.data.issaved){setSave(true) }else{setSave(false)}
                const res1 = await axios.get(`${BASE_URL}/api/video/handle?videoid=${params.id}&userid=${currUser.email}`);
                const video_handle = res1.data;
                const res2 = await axios.get(`${BASE_URL}/api/issubscribe?videoid=${params.id}&userid=${currUser.email}`);
                console.log(res2.data)
                if(video_handle.isliked){setLiked(true)} else{setLiked(false)}
                if(res2.data.issubscribed){setSubscribe(true)} else{setSubscribe(false)}
            }
            fetch()
        } catch (err){
            console.log(err.message);
        }
    },[params.id])
    useEffect(()=>{
        const playVideo =async () =>{
            try{
                const res = await axios.get(`${BASE_URL}/api/play/video/${params.id}`)
                const jsonData = res.data;
                setVideoPlayer(jsonData);
            } catch(err){
                console.log(err)
            }
            finally{
                setIsLoading(false)
            }
        }
        playVideo()
    },[params.id])
  return (
    <>
    <main className='bottom-part'>
        <div className='mt-3 container-xxl video-container'>
            <div style={{width:"fit-content", height:'fit-content'}}>
                <video className='' src={videoPlayer.video_url}  controls loop title='VIM Corn video player'></video>
                <p className='videoTitle'>{videoPlayer.title}</p>
                {isLoading?
                <div className='d-flex mb-3'>
                    <h5 className="card-title placeholder-glow">
                        <span className="placeholder" style={{width:"45px", height:"45px", borderRadius:"50%",color:'darkgrey'}}></span>
                    </h5>
                    <p className="card-text placeholder-wave " style={{width:'100%'}}>
                        <span className="placeholder col-5 " style={{ color:'darkgrey',height:"20px", borderRadius:"10px"}}></span>
                        <div className='d-flex mt-2' style={{width:'100%'}}>
                            <span className="placeholder col-7" style={{color:'darkgrey', borderRadius:"10px"}}></span>
                            <div className='d-flex justify-content-end' style={{width:'100%'}}>
                                <span className="placeholder col-1 mx-2"  style={{color:'darkgrey',borderRadius:"20px",height:'20px'}}></span>
                                <span className="placeholder col-1 mx-2" style={{color:'darkgrey',borderRadius:"20px"}}></span>
                                <span className="placeholder col-1 mx-2" style={{color:'darkgrey',borderRadius:"20px"}}></span>
                                <span className="placeholder col-1 mx-2" style={{color:'darkgrey',borderRadius:"20px"}}></span>
                            </div>
                        </div>
                    </p>
                </div>
                :
                <div className=' video-component'>
                    <div className='video-owner '>
                        <div className='d-flex'>
                            <Link to={`/others/profile/${videoPlayer.userid}`}>
                                <img className='me-1' src={videoPlayer.img} height='45px' width="45px" style={{borderRadius:"50%"}} alt="user" />
                            </Link>
                            <div>
                                <p className='m-0' style={{color:"lightgray", fontSize:"0.9rem"}}>{videoPlayer.name}</p>
                                <p className='m-0' style={{color:"grey"}}>{videoPlayer.subscriber} subscribers</p>
                            </div>
                        </div>
                        <div className='subscribe' title='Subscribe'>
                            <button onClick={subscribe} style={{background: subscribed?"rgb(60, 20, 159)":null}} className='btn btn-sm'>{subscribed?"Subscribed":"Subscribe"}</button>
                        </div>
                    </div>
                    <div className=' video-handler'>
                        <div className=' m-0 btn-group '>
                            <button onClick={likeVideo} title='Like the video' className='btn btn-sm btn-secondary' style={{background:liked?"rgb(46,154,209)":null, color:liked?"lightgrey":null}}>
                                <svg className='me-1' xmlns="http://www.w3.org/2000/svg" height="24" fill='currentColor' viewBox="0 -960 960 960" width="24" ><path  d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z"/></svg>
                                {videoPlayer.likes}
                            </button>
                            
                            <button title='Dislike the video'  className='btn btn-sm btn-secondary'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill='currentColor' height="24" viewBox="0 -960 960 960" width="24"><path d="M240-840h440v520L400-40l-50-50q-7-7-11.5-19t-4.5-23v-14l44-174H120q-32 0-56-24t-24-56v-80q0-7 2-15t4-15l120-282q9-20 30-34t44-14Zm360 80H240L120-480v80h360l-54 220 174-174v-406Zm0 406v-406 406Zm80 34v-80h120v-360H680v-80h200v520H680Z"/></svg>
                            </button>
                        </div>
                        <div className=' dropdown' style={{width:"70%"}}>
                            <button title='Share this video' className='btn btn-sm btn-secondary'>
                                <svg className='me-1' xmlns="http://www.w3.org/2000/svg" fill='currentColor' x="0px" y="0px" width="20" height="20" viewBox="0 0 50 50">
                                    <path d="M 4 4 L 4 44 A 2.0002 2.0002 0 0 0 6 46 L 44 46 A 2.0002 2.0002 0 0 0 46 44 L 46 32 L 42 32 L 42 42 L 8 42 L 8 4 L 4 4 z M 35.978516 4.9804688 A 2.0002 2.0002 0 0 0 34.585938 8.4140625 L 37.171875 11 L 36.048828 11 C 25.976906 10.74934 19.618605 12.315463 15.953125 16.726562 C 12.287645 21.137662 11.831327 27.512697 12 36.039062 A 2.0003814 2.0003814 0 1 0 16 35.960938 C 15.835673 27.654299 16.533777 22.2844 19.029297 19.28125 C 21.524817 16.2781 26.334094 14.76066 35.951172 15 L 35.974609 15 L 37.171875 15 L 34.585938 17.585938 A 2.0002 2.0002 0 1 0 37.414062 20.414062 L 43.236328 14.591797 A 2.0002 2.0002 0 0 0 43.619141 14.208984 L 44.828125 13 L 43.619141 11.791016 A 2.0002 2.0002 0 0 0 43.228516 11.400391 L 37.414062 5.5859375 A 2.0002 2.0002 0 0 0 35.978516 4.9804688 z"></path>
                            </svg>
                            Share
                            </button>
                            <button title='Download this video' className='btn btn-sm  btn-secondary'>
                            <svg className='me-1' xmlns="http://www.w3.org/2000/svg" fill='currentColor' height="24" viewBox="0 -960 960 960" width="24"><path d="M180.001-100.001V-160h599.998v59.999H180.001Zm299.614-155.385L227.31-584.23h145.383v-275.769h214.229v275.769h145.384L479.615-255.386Z"/></svg>
                            Download</button>
                            <button  className='btn btn-sm  btn-secondary' type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <svg xmlns="http://www.w3.org/2000/svg" fill='currentColor' height="24" viewBox="0 -960 960 960" width="24"><path d="M140.001-254.616v-59.999h679.998v59.999H140.001Zm0-195.385v-59.998h679.998v59.998H140.001Zm0-195.384v-59.999h679.998v59.999H140.001Z"/></svg>
                            </button>
                            <ul className="dropdown-menu" data-bs-theme="dark">
                                <li><a onClick={()=>saveVideo(params.id)} className="dropdown-item" href="#">
                                    {save? <><i className= 'me-2 bi bi-bookmark-x'></i> Unsave</> :
                                    <><i className="me-2 bi bi-plus-square-dotted"></i> Save</>} 
                                </a></li>
                                <li><a className="dropdown-item" href="#"><i className="me-2 bi bi-flag"></i> Report</a></li>
                            </ul>
                        </div>
                    </div>
                </div>}
                
                <div className='video-description'>
                    {isLoading?
                    <div className='placeholder-wave mt-2' style={{width:'100%'}}>
                        <div className=' justify-content-end' style={{width:''}}>
                            <span className="placeholder col-1 mx-1"  style={{color:'darkgrey',borderRadius:"20px"}}></span>
                            <span className="placeholder col-1 mx-1" style={{color:'darkgrey',borderRadius:"20px"}}></span>
                        </div>
                        <span className="placeholder col-7" style={{color:'darkgrey', borderRadius:"10px"}}></span>
                        <span className="placeholder col-10" style={{color:'darkgrey', borderRadius:"10px"}}></span>
                    </div>
                    :
                    <>
                    <div className='d-flex'>
                        <p className='m-0 '>{videoPlayer.views} views &nbsp; -</p>
                        <p className='m-0'>{format(videoPlayer.timestamps)}</p>
                    </div>
                    <p className='m-0 mt-1 p-1' >" {videoPlayer.title} " </p>
                    <p className=''>{videoPlayer.description}</p>
                    </>}
                </div>
                <hr style={{color:"darkgray"}}/>
                <CommentSection/>
            </div>
            <div className='recomended-videos'>
                <div className='recomended-div'>
                    <p>Recomended videos</p>
                    <Recomended videoid={videoPlayer.id}/>
                </div>
            </div>
        </div>
    </main>
    </>
  )
}
