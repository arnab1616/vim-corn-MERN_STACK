import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
// import { Placeholder } from 'react-bootstrap';
import ReactPlayer from 'react-player'
import Placeholders from '../components/video/Placeholders.jsx';
import { format } from 'timeago.js';
import { Link, Outlet } from 'react-router-dom';
import allVideoContext from '../components/context/movies/allVideoContext.js';
import { increaseVews } from '../services/view.js';
import { increaseClipVews } from '../services/clipView.js';

export default function Videos() {
  document.title = 'VIM Corn. - videos | random'
  const [videos, setVideos] = useState([]);
  const [clips, setClips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // const videos = videoContext.videos;
  // const isLoading = videoContext.isLoading;

  useEffect(()=>{
    const fetchAllVideos = async () =>{
      try{
        const res = await axios.get('http://localhost:3200/api/videos/all');
        const res1 = await axios.get('http://localhost:3200/api/get/clips/all');
        if(!res){console.log({Error: "Somthing went wrong!"})}
        const result = res.data;
        setVideos(result);
        setClips(res1.data)
        console.log(res1.data)
        console.log("videos")
          console.log(videos)
        
      } catch(err){
        alert(err.message)
        console.log(err.message);
      } finally{
        setInterval(()=>{
          setIsLoading(false);
        },1000)
        
      }
    }
   
    fetchAllVideos();
  },[])

  if(isLoading){
    return (
      <main className='bottom-part'>
      <h1 className="RecomendedText"> <i className='bi bi-play-btn'></i> Videos for you</h1>
      <div className='container-fluid d-flex justify-content-center flex-row flex-wrap '>
        
        {videos.map((video)=>{
          return(
            <Placeholders/>
          )
        })}
        {!videos.length?
        <>
          <Placeholders/>
          <Placeholders/>
          <Placeholders/>
          <Placeholders/>
          <Placeholders/>
          <Placeholders/>
          <Placeholders/>
          <Placeholders/>
        </>
        :null}
      </div>
      </main>
    )
  }
  return (<>
    <main className='bottom-part'>
      <h1 className="RecomendedText"> <i className='bi bi-play-btn-fill '></i> Videos for you</h1>
      
      <section  className='container-fluid d-flex justify-content-center flex-row flex-wrap' >
        {!videos.length?<p>No videos</p> :videos.map((video)=>{
          return(
            <>
              <Link className='video-link' to={`play/${video.id}`} style={{textDecoration:"none", color:'white', width:"fit-content"}}>
                <div onClick={()=>{increaseVews(video.id)}} className="card  video-card" aria-hidden="true" >
                  <img  src={video.thumbnail?video.thumbnail:"/assets/image.png"} className="card-img-top thumbnail"  alt="thumbnail"  />
                  <div className="card-body d-flex p-1 py-2" style={{background:'transparant'}}>
                    <div className="  ">
                      <img src={video.img} className="mt-1" style={{width:"40px", height:"40px", borderRadius:"50%"}} />
                    </div>
                    <p className="card-text text-start" >
                      <p className='m-0' style={{fontSize:"0.85rem"}}>{video.title.slice(0, Math.round(Math.random() + 1) * 31)}...</p>
                      <p className='m-0 mt-1' style={{color:"darkgrey"}}> <>{video.name}</> </p>
                      <p className='m-0' style={{color:"darkgrey"}}> {video.views} views - {format(video.timestamps)}</p>
                    </p>
                  </div>
                </div>
              </Link>
            </>
          )
        })}
        
      </section>
      <section  className='container-fluid ' style={{overflow:'auto'}}>
        <p className='mt-3' style={{fontSize:'1rem'}}> <i className="bi bi-lightning-charge-fill"></i> <b> Clips</b></p>
        
        <div className='d-flex flex-row'>
          {!clips.length?<p>No clips</p>:
           clips.map((elm)=>{
            return(
              <Link to={`/play/clips/${elm.id}`} style={{textDecoration:'none'}}>
                <div onClick={()=>{increaseClipVews(elm.id)}} className='mx-2' style={{width:'min-content'}}>
                  <div className='rounded-3 placeholder-wave' style={{background:'grey'}}>
                    <ReactPlayer width='280px' height="460px" url={elm.clip_url} />
                  </div>
                  <p className='m-0' style={{fontSize:'0.9rem'}}>{elm.caption.slice(0, Math.round(Math.random() + 1) * 35)}...</p>
                  <p className='' style={{color:'darkgrey'}}>{elm.views} views - {format(elm.timestamps)}</p>
                </div>
              </Link>
            )
           })
          }
        </div>
      </section>

    </main>
    
    </>
  )
}
