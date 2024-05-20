import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { format } from 'timeago.js';

export default function ProfileSubscriptions() {
    const params = useParams();
    const [subscriptions, setSubscriptions ] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [noSubs, setNoSubs] = useState(true);

    useEffect(()=>{
        const fetchSubscriptions =async () =>{

            try{
                const res = await axios.get(`http://localhost:3200/api/fetch/user/subscriptions/${params.userid}`)
                setSubscriptions(res.data)
                if(res.status === 201){
                    setNoSubs(false)
                }
            }catch(err){
    
            } finally{
                setIsLoading(true)
            }
        }
        fetchSubscriptions()
    },[])
  return (
    <div>
      <div className='container-xxl mb-2'>
          <p className='mt-4' style={{fontSize:'1rem'}}>
            <svg xmlns="http://www.w3.org/2000/svg" className='mb-1 me-1' fill='currentColor' height="24" viewBox="0 -960 960 960" width="24"><path d="M160-80q-33 0-56.5-23.5T80-160v-400q0-33 23.5-56.5T160-640h640q33 0 56.5 23.5T880-560v400q0 33-23.5 56.5T800-80H160Zm240-120 240-160-240-160v320ZM160-680v-80h640v80H160Zm120-120v-80h400v80H280Z"/></svg>
            <b>Subscriptions</b>
          </p>
          <section  className=' d-flex  flex-row flex-wrap' >
            {!noSubs? <p className='m-auto mb-2'>No subscriptions yet !</p>: 
            subscriptions.map((elm)=>{
                return (
                <Link to={`/others/profile/${elm.email}`} style={{textDecoration:'none'}}>
                <div className='d-flex p-2 mx-3 mb-3' style={{border:"1px solid grey"}}>
                    <div>
                        <img src={elm.img} height='120px' width='120px' alt="subscription_user"  style={{borderRadius:'50%', border:'3px solid darkgrey'}}/>
                    </div>
                    <div className='p-2'>
                        <p className='m-0' style={{fontSize:'1rem' , fontWeight:'bold'}}>{elm.name}</p>
                        <p className='m-0' style={{color:'lightgrey'}}>{elm.username}</p>
                        <div className='d-flex' >
                            <p className='m-0' style={{color:'darkgrey'}}>{elm.subscriber} subscriber -</p>
                            <p className='m-0' style={{color:'darkgrey'}}>{format(elm.timestamps)}</p>
                        </div>
                    </div>
                </div>
                </Link>
                )
            })
            }
          </section>
        </div>
    </div>
  )
}
