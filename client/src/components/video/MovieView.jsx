import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { format } from 'timeago.js';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Footer from '../partials/Footer';
import ReactPlayer from 'react-player';
import userContext from '../context/user/userContext';

export default function MovieView() {
    const BASE_URL = 'http://localhost:3200'
    const props = useContext(userContext)
    const currUser = props.currUser;
    const params = useParams();
    const [movie, setMovie] = useState({});
    const [cmnt, setCmnt] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    document.title = `VIM Corn. - ${movie.title}`
    const [input, setInput] = useState({
        email: currUser.email
    })
    const postComment = async(e) =>{
        // e.preventDefault();
        console.log(input)
        setIsLoading(true)
        try{
            await axios.post(`${BASE_URL}/api/post/movie/comments/${params.id}`,input)
            const comments = await axios.get(`${BASE_URL}/api/fetch/movie/comments/${params.id}`)
            setCmnt(comments.data)
            if(comments.status === 200){setIsLoading(false)}
            setInput({})
        }catch(err){
            console.log(err.message);
        }
    }
    const onchange = (e) =>{
        const {name, value} = e.target;
        setInput((prev) => ({
            ...prev, [name]: value
        }))
    }
    useEffect(()=>{
        const fetchMovie = async()=>{
            try{
                const res = await axios.get(`${BASE_URL}/api/get/movie/${params.id}`)
                setMovie(res.data)
                console.log(res.data)
                const comments = await axios.get(`${BASE_URL}/api/fetch/movie/comments/${params.id}`)
                setCmnt(comments.data)
            }catch(err){
                console.log(err.message);
            }
        }
        fetchMovie()
    },[params.id])
  return (
    <>
    <main className='bottom-part'>
        <section className='mt-3'>
            <Link><div className='container-xxl bg-primary p-2 text-center'> <i className='mx-2 bi bi-arrow-right-circle'></i>  Join Our Official Telegram Channel <i className='mx-2 bi bi-arrow-left-circle'></i> </div></Link>
            <div className='container-xxl'>
                <div className='d-flex flex-column mt-3'>
                    <div className='' style={{backgroundImage:`url('${movie.thumbnail}')`, backgroundSize:'100% 120%', width:"100%", height:'500px'}}>
                        {/* <img src={movie.thumbnail} height="500px" width='100%' alt="" /> */}
                    </div>
                    <div className='p-2'>
                        <div className='d-flex align-items-center'>
                            <p className='m-0 fs-6'>{movie.title}</p>
                            <button className='btn btn-sm rounded-5 mx-2' style={{backgroundColor:"rgb(255, 10, 10)", color:'white'}} data-bs-toggle="modal" data-bs-target="#staticBackdrop3"> 
                            <i className='bi bi-camera-video-fill'></i> Trailer
                            </button>
                        </div>
                        <div className='d-flex mt-3' >
                            <div >
                                <p className='m-0' ><strong>Genre : </strong> {movie.genre} </p>
                                <p className='m-0'><strong>Director : </strong> {movie.director} </p>
                                <p className='m-0'><strong>Actors : </strong> {movie.actors} </p>
                                <p className='m-0'><strong>Country : </strong> {movie.country} </p>
                                <p className='m-0'><strong>Language : </strong> {movie.language} </p>
                            </div>
                            <div>
                                <p className='m-0'><strong>Post Update : </strong> {format(movie.post_updated)} </p>
                                <p className='m-0'><strong>Duration : </strong> {movie.duration} min</p>
                                <p className='m-0'><strong>Quality : </strong> {movie.quality} </p>
                                <p className='m-0'><strong>Release : </strong> {movie.release_at} </p>
                            </div>
                        </div>
                        <p className='text-center mt-2'> <strong>Movie Description :  </strong> {movie.descriptions}</p>
                    </div>
                </div>
                <hr style={{color:'darkgrey'}} />
                <p className='text-center fs-5'>{movie.title} Download in VIM CORN</p>
                <div className='text-center'>
                    <button className='btn btn-sm mx-2' style={{backgroundColor:"rgb(255, 120, 0)", color:'white'}} data-bs-toggle="modal" data-bs-target="#staticBackdrop2"><i className='bi bi-play-circle-fill'></i> Play Now</button>
                    <Link to={movie.download_link} target='_blank' className='btn btn-sm mx-2' style={{backgroundColor:"rgb(200, 50, 155)", color:'white'}}><i className='bi bi-download'></i> Download Link</Link>
                </div>
            </div>
            <div className='container-xxl py-2 mt-5' style={{background:'#2e2775ee'}}>
              <form onSubmit={postComment}>
                <p className='m-0 fs-5'>Comments</p>
                <p>Your email address will not be published. Required fields are marked <span>*</span></p>
                <label htmlFor="title" style={{color:'darkgrey'}}>Comment <span>*</span></label>
                <div className='d-flex flex-column uploadVideo'>
                    <textarea onChange={onchange} rows='5'  type="text" name='comment' id='title' required placeholder='Comment here' minLength='5' maxLength='100' ></textarea>
                </div>
                <label htmlFor="title" className='mt-2' style={{color:'darkgrey'}}>Name <span>*</span></label>
                <div className='d-flex flex-column uploadVideo'>
                    <input onChange={onchange} type="text" name='name' id='title' required placeholder='Enter your full name or username' minLength='5' maxLength='100' />
                </div>
                <label htmlFor="title" className='mt-2' style={{color:'darkgrey'}}>Email (read only) <span>*</span></label>
                <div className='d-flex flex-column uploadVideo'>
                    <input type="text" name='email' id='title' value={currUser.email} readOnly placeholder='Enter your valid email id' minLength='5' maxLength='100' />
                </div>
                <div className='text-end mt-3'>
                    <button type='submit' className='btn btn-sm rounded-3 btn-primary' style={{background:'rgb(25,110,111)'}}>{isLoading?"Comment Posting...":"Post Comment"}</button>
                </div>
              </form>
              <p className='m-0 fs-5'>{cmnt.length} Comments</p>
              <hr style={{color:'white'}} />
              <div className='container'>
                {!cmnt.length? 
                <p>No comments</p>
                :
                <div className='container'>
                    {cmnt.map((elm)=>{
                        return(
                            <div className='d-flex align-items-center mb-3'>
                                <img src={elm.img} alt="user" height='40px' width="40px" className='rounde-5' />
                                <div>
                                    <p className='m-0'>{elm.username} <code>{format(elm.timestamps)}</code></p>
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
        <Footer/>
        
    </main>
        <div className="modal fade" id="staticBackdrop3" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" >
                <div className="modal-content" style={{width:'fit-content', background:'rgb(33,35,39', color:'gray'}} >
                <div className="modal-header p-2">
                    <p className="modal-title fs-6 text-center me-2" id="staticBackdropLabel">{movie.title}</p>
                    <i type="button" className="bi bi-x-circle" fill='currentColor' data-bs-dismiss="modal" aria-label="Close"></i>
                </div>
                <div className="modal-body p-1">
                    <ReactPlayer width='100%'  url={movie.movie_trailer} controls />
                </div>                
                </div>
            </div>
        </div>
        <div className="modal fade" id="staticBackdrop2" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg" style={{width:'fit-content'}} >
                <div className="modal-content" style={{width:'fit-content', background:'rgb(33,35,39', color:'gray'}} >
                <div className="modal-header p-2">
                    <p className="modal-title fs-6 text-center me-2" id="staticBackdropLabel">{movie.title}</p>
                    <i type="button" className="bi bi-x-circle" fill='currentColor' data-bs-dismiss="modal" aria-label="Close"></i>
                </div>
                <div className="modal-body p-1">
                    {movie.full_movie?<ReactPlayer width='100%' url={movie.full_movie} controls />: <p className='fs-6 text-center'> <code>This movie not available yet</code></p> }
                </div>                
                </div>
            </div>
        </div>
    </>
  )
}
