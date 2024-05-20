import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom';
import Placeholders from '../components/video/Placeholders';
import { increaseVews } from '../services/view';
import { format } from 'timeago.js';

export default function SearchResult() {
    const [query] = useSearchParams();
    document.title = `VIM Corn. - Result for ${query.get('search_query')}`
    const [videos, setVideos] = useState([]);
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);  
    useEffect(()=>{
        const fetchResult = async () =>{
            try{
                const search = await axios.get(`http://localhost:3200/api/search/videos?serach_query=${query.get('search_query')}`)
                console.log(search.data)
                setVideos(search.data)
                const search1 = await axios.get(`http://localhost:3200/api/search/movies?serach_query=${query.get('search_query')}`)
                console.log(search1.data)
                setMovies(search1.data)
            }catch(err){
                confirm(err.message);
            } finally{
                setTimeout(() => {
                    setIsLoading(false)
                }, 1000);
            }
        }
        fetchResult();
    },[query.get('search_query')]) 
    if(isLoading){
        return (
          <main className='bottom-part'>
          <div className='container-fluid'>
            <p className=" mt-3 text-start fs-5"> <b><i className='bi bi-play-btn'></i> Videos for {query.get('search_query')}</b> </p>
            {!videos.length? <p>No videos for "{query.get('search_query')}"</p> :null}
          </div>
          <div className='container-fluid d-flex flex-row flex-wrap '>
            
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
  return (
    <main className='bottom-part'>
    {/* <h1 className="RecomendedText"> <i className='bi bi-play-btn'></i> Videos for {query.get('search_query')}</h1> */}
    <div className='container-fluid'>
        <p className=" mt-3 text-start fs-5"> <b><i className='bi bi-play-btn'></i> Videos for {query.get('search_query')}</b> </p>
        {!videos.length? <p>No videos for "{query.get('search_query')}"</p> :null}
    </div>
      <section  className='container-fluid d-flex  flex-row flex-wrap' >
        {!videos.length?null:
        videos.map((video)=>{
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
        <div className='container-fluid'>
            <p className=" mt-3 text-start fs-5"> <b><i className='bi bi-film'></i> Movies for {query.get('search_query')}</b> </p>
            {!movies.length? <p>No movies for "{query.get('search_query')}"</p> :null}
        </div>
      
      <div className="cntr container-xxl">
              {isLoading?
                movies.map((elm)=>{
                  return (<div className='grid-box placeholder-wave' style={{background:'grey',borderRadius:"15px"}}></div>)
                })
              :
              movies.map((elm)=>{
                return(
                  <>
                  <div className="grid-box" key={elm.id}>
                    <Link to={`/movies/explore/${elm.id}`} style={{textDecoration:'none'}}>
                      <div className="moviePic  d-flex flex-column justify-content-between" style={{backgroundImage:`url('${elm.thumbnail}')`, backgroundSize:'cover'}}>
                        <p className='type'  style={{color:'white' ,width:'fit-content'}}>{elm.language}</p>
                      <p className='text-center m-0' style={{color:'white'}}>{elm.title}</p>
                      </div>
                    </Link>
                  </div>
                  </>
                )
              })}
            </div>
            
    </main>
  )
}
