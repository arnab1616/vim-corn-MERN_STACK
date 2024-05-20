import React, { useEffect, useState } from 'react'
import RecomendedPlaceholder from './RecomendedPlaceholder'
import axios from 'axios';
import { format } from 'timeago.js';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { increaseVews } from '../../services/view.js';

export default function Recomended(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [recomended,setRecomended] = useState([]);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(()=>{
    const fetchRecomended = async ()=>{
      try{
        console.log("CUrrent vido " + props.vodeoid)
        // const res = await axios.get(`http://localhost:3200/api/videos/all`)
        const res1 = await axios.get(`http://localhost:3200/api/fetch/recomended/${params.id}`)
        console.log(res1.data)
        // console.log(res.data)
        setRecomended(res1.data);
      }catch(err){
        console.log(err.message)
      } finally{
        setIsLoading(false)
      }
    }
    fetchRecomended();
  },[params.id])
  if(isLoading){
    return (
      <div>
          <RecomendedPlaceholder/>
          <RecomendedPlaceholder/>
          <RecomendedPlaceholder/>
          <RecomendedPlaceholder/>
          <RecomendedPlaceholder/>
          <RecomendedPlaceholder/>
      </div>
    )
  }
  return(
    <div>
      {recomended.map((elm)=>{
        return(
        <Link to={`/videos/play/${elm.id}`}  style={{textDecoration:"none"}}>
          <div onClick={()=>{increaseVews(elm.id)}} className="d-flex  my-3 mx-2" aria-hidden="true" style={{background:'none', border:'none', borderRadius:"0"}}>
            <img  src={elm.thumbnail?elm.thumbnail:"/assets/image.png"} className="card-img-top"  height='120px' alt="..." style={{width:"45%",borderRadius:"10px"}} />
            <div className=" p-1 py-2" style={{width:'55%',background:'transparant'}}>                
                <p className=" placeholder-wave " >
                    <p className="m-0 p-0" style={{ color:'white'}}> {elm.title.slice(0, Math.round(Math.random() + 1) * 25)}...</p>
                    <p className="m-0 p-0 mt-1" style={{color:'darkgrey'}}>{elm.name}</p>
                    <p className='p-0 m-0 d-flex '>
                        <p className=" m-0 p-0 me-1" style={{color:'grey'}}> {elm.views} views &nbsp; -</p>
                        <p className="m-0 p-0 col-4" style={{color:'grey', width:"fit-content"}}> {format(elm.timestamps)}</p>
                    </p>
                </p>                     
            </div>
          </div>
        </Link>
        )
      })}
    </div>
  )
}
