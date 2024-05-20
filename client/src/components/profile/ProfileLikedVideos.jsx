import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { increaseVews } from '../../services/view';
import { format } from 'timeago.js';
import Placeholders from '../video/Placeholders';
import userContext from '../context/user/userContext';


export default function ProfileLikedVideos() {
    const params = useParams();
    const props = useContext(userContext);
    const currUser = props.currUser;
    const BASE_URL = 'http://localhost:3200';
    const [yourVideos, setVideos ] = useState([]);
    const [isLoading, setIsLoading] = useState(true)

    useEffect(()=>{
        const yourVideos = async () =>{
            try{
                const res = await axios.get(`${BASE_URL}/api/fetch/user/liked/videos/${params.userid}`)
                console.log(res.data.length)
                setVideos(res.data);
            } catch(err){
                console.log(err.message)
            } finally{
                setTimeout(() => {
                    setIsLoading(false);
                }, 1000);
            }
        }
        yourVideos()
    },[])
    if(isLoading){
        return(
          <div className='container-xxl mb-2'>
         <p className='mt-4' style={{fontSize:'1rem'}}>
            <i className='bi bi-hand-thumbs-up'></i> Liked
        </p>
          <section  className=' d-flex  flex-row flex-wrap' >
            {
              yourVideos.map((elm)=>{
                return <Placeholders/>
              })
            }
            {!yourVideos.length?
            <>
            <Placeholders/>
            <Placeholders/>
            <Placeholders/>  
            <Placeholders/>
            </>: null}
          </section>
          </div>
        )
      }
  return (
    <div className='container-xxl mb-2'>
        <p className='mt-4' style={{fontSize:'1rem'}}>
            <i className='bi bi-hand-thumbs-up'></i> Liked
        </p>
        <section  className=' d-flex  flex-row flex-wrap' >
        {!yourVideos.length?<p>No liked videos</p>:
        yourVideos.map((video)=>{
          return(
            <>
              <Link className='video-link' to={`/videos/play/${video.id}`} style={{textDecoration:"none", color:'white', width:"fit-content"}}>
                <div onClick={()=>{increaseVews(video.id)}} className="card  video-card" aria-hidden="true" >
                  <img  src={video.thumbnail?video.thumbnail:"/assets/image.png"} className="card-img-top thumbnail"  alt="thumbnail"  />
                  <div className="card-body d-flex p-1 py-2" style={{background:'transparant'}}>
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
    </div>
  )
}
