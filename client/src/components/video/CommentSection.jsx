import React, { useContext, useEffect, useState } from 'react'
import userContext from '../context/user/userContext';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { format } from 'timeago.js';

export default function CommentSection() {
    const BASE_URL = 'http://localhost:3200'
    const props = useContext(userContext);
    const currUser = props.currUser;
    const params = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [cmntPost , setCmntPost] = useState(false);
    const [allComments , setAllComments] = useState([]);
    const [comment, setComment] = useState({
        comment:'',
        currUserId: currUser.email
    })
    const comments = (e) => {
        const {name, value} = e.target;
        setComment(prev=>({
            ...prev, [name]:value
        }))
        if(comment.comment.length != 0 && comment.comment.length != 1){setCmntPost(true)}else{setCmntPost(false)}
    }
    const postComment = async(e) =>{
        e.preventDefault();
        try{
            const res = await axios.post(`${BASE_URL}/api/post/comments/${params.id}`, comment)
            console.log(res.data);
            setCmntPost(false);

            const res1 = await axios.get(`${BASE_URL}/api/fetch/comments/${params.id}`)
            console.log(res1.data);
            setAllComments(res1.data);
        }catch(err){
            console.log(err.message);
        }
    }
    useEffect(()=>{
        const fetchComments = async() =>{
            try{
                const res = await axios.get(`${BASE_URL}/api/fetch/comments/${params.id}`)
                console.log(res.data);
                setAllComments(res.data);
            }catch(err){
                console.log(err.message)
            }finally{
                setIsLoading(false)
            }
        }
        fetchComments();
    },[])
if(!currUser){
    return (
        <p style={{fontSize:"1rem", color:"darkgray"}}>You can't comment please <Link title='Login to VIM Corn' to='/login' className='login' style={{textDecoration:"",color:"skyblue"}}>login</Link></p>
    )
}
  return (
    <section>
    <div>
        <p style={{fontSize:"1.2rem"}}>{allComments.length} comments</p>
        <div className='d-flex align-items-center'>
            <Link to={`/profile`}>
                <img className='me-1' src={currUser.img} height='42px' width="42px" style={{borderRadius:"50%"}} alt="user" />
            </Link>
            <div style={{width:'100%'}}>
               <form className='comment-div' onSubmit={postComment}>
                <input onChange={comments} autocomplete="off" type="text" name='comment' minLength='3' placeholder='Add a comment here...'/>
                {cmntPost ?<div>
                    <button className='btn  btn-sm btn-secondary' type='reset'>Cancel</button>
                    <button className='btn  btn-sm btn-info' type='submit'>Comment</button>
                </div>:null}
               </form>                            
            </div>
        </div>
        <div className='mt-3'>
            {!allComments.length?<p>No comments yet! </p>:
                <div className='container d-flex flex-column pt-2'>
                    {allComments.map((elm)=>{
                        return(
                            <div className='d-flex mb-3'>
                               <Link to={`/others/profile/${elm.userid}`}>
                                <img src={elm.img} height='40px' width='40px' alt="user" style={{borderRadius:"50%", border:'1px solid grey'}} />
                               </Link>
                                <div>
                                    <div className='d-flex'>
                                        <p className='m-0' style={{color:"lightgrey"}}>@{elm.username}</p>
                                        <p className='m-0' style={{color:"grey", fontSize:"0.7rem"}}>{format(elm.timestamps)}</p>
                                    </div>
                                    <p className='m-0'>{elm.comment}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            }
        </div>
    </div>
    </section>
  )
}
