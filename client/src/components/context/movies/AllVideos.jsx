import React, { useEffect, useState } from 'react'
import AllVideoContext from './allVideoContext';
import axios from 'axios';

export default function AllVideos(props) {
    const [videos, setVideos] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(()=>{
    const fetchAllVideos = async () =>{
      try{
        const res = await axios.get('http://localhost:3200/api/videos/all');
        if(!res){console.log({Error: "Somthing went wrong!"})}
        const result = res.data;
        // setAllvideo(result);
        setVideos(result);
        console.log("videos")
        console.log(videos)
      } catch(err){
        console.log(err.message);
      } finally{
        setIsLoading(false);
      }
    }
   
    fetchAllVideos();
  },[])
  return (
    <AllVideoContext.Provider value={{videos, isLoading}}>
      {props.children}
    </AllVideoContext.Provider>
  )
}

