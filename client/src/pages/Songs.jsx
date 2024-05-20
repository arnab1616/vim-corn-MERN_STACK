import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom';

export default function Songs() {
    const CLIENT_ID = "321de952afd3454dbd227a9000ad26b9";
    const CLIENT_URI = "http://localhost:8800/spotify/api/songs/callback";
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
    const RESPONSE_TYPE = 'token'
    // var state = generateRandomString(16);
    const [traks, setTraks] = useState([]);
    useEffect(()=>{
        const fetchTraks = async () =>{
            try{
                const res = await axios.get('https://v1.nocodeapi.com/arnab1616/spotify/yFLjzXHqoAqGFvjT/search?q=daku&type=track')
                const response = res.data.tracks.items;
                console.log(response);
                console.log(response[1].preview_url)
                setTraks(response);
            } catch(err){
                console.log(err.message);
            } finally{
                console.log(true);
            }
        }
        fetchTraks();
    },[])

  return (
    <main className='bottom-part'>
    <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${CLIENT_URI}&response_type=${RESPONSE_TYPE}`}>click</a>
        <div className='d-flex flex-wrap justify-content-center'>
            {traks.map((elm)=>{
                return(
                    <>
                        <div className='d-flex flex-column' key={elm.id}>
                            <p style={{color:"white"}}>{elm.album.name}</p>
                            <img src={elm.album.images[1].url} alt="" />
                            <audio controls>
                                <source src={elm.preview_url} type="audio/MP3"/>
                            </audio>
                        </div>
                    </>
                )
            })}
        </div>
    </main>
  )
}
