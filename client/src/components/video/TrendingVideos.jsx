import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { format } from 'timeago.js';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { increaseVews } from '../../services/view.js';
import Placeholders from './Placeholders.jsx';

export default function TrendingVideos(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [trending,setTrending] = useState([]);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(()=>{
    const fetchRecomended = async ()=>{
      try{
        const res = await axios.get('http://localhost:3200/api/trending/videos/all');
        if(!res){
            setTrending([])
        }else{
            setTrending(res.data)
        }
      }catch(err){
        console.log(err.message)
      } finally{
        setTimeout(() => {
            setIsLoading(false)
        }, 500);
      }
    }
    fetchRecomended();
  },[])
  if(isLoading){
    return (
      <main className='bottom-part'>
      <h1 className="RecomendedText">Trending Now</h1>
      <div className='container-fluid d-flex justify-content-center flex-row flex-wrap '>
        
        {trending.map((video)=>{
          return(
            <Placeholders/>
          )
        })}
        {!trending.length?
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
  return(
    <main className='bottom-part'>
      <h1 className="RecomendedText"> <i className="bi bi-fire" fill='currentColor'></i> Trending Now</h1>
      
      <section  className='container-fluid d-flex justify-content-center flex-row flex-wrap' >
        {!trending.length?<p>No trending videos</p> :trending.map((video)=>{
          return(
            <>
              <Link className='video-link' to={`/videos/play/${video.id}`} style={{textDecoration:"none", color:'white', width:"fit-content"}}>
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
    </main>
  )
}
