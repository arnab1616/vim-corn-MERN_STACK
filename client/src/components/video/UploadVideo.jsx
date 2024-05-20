import React, { useContext, useState } from 'react'
import './video.css'
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { storage } from '../../firebase/firebaseConfig'
import userContext from '../context/user/userContext'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function UploadVideo() {
    document.title = 'VIM Corn. - Upload new video'
    const navigate = useNavigate();
    const a = useContext(userContext);
    const currUser = a.currUser;
    const [bar, setBar] = useState(false);
    const [loading, setLoading] = useState(false);
    const [thumbnail, setThumbnail] = useState(null)
    const [videoSrc, setVideoSrc] = useState(null)
    const [thumb, setThumb] = useState(null)
    const [video, setVideo] = useState(null)
    const [process, setProcess] = useState(0)
    const [input, setInput] = useState({
        title:'',
        description:'',
        thumbnail:'',
        video:'',
        visibility:'on'
    })
    const navigateLogin =()=>{
        if(!currUser){
            navigate('/login');
        }
    }
    const deleteThumb = (item) =>{
        console.log("Clicked")
        console.log(item);
        const desertRef = ref(storage, item);
        // Delete the file
        deleteObject(desertRef).then(() => {
            console.log("File deleted successfully")
            alert("Thumbnail deleted successfully !")
            setThumbnail(null);
            input.thumbnail = '';
        }).catch((error) => {
            alert(error.message)
            console.log(error.message);
        })
    }

    const deleteVideo = (item) =>{
        console.log("Clicked")
        console.log(item);
        const desertRef = ref(storage, item);
        // Delete the file
        deleteObject(desertRef).then(() => {
            console.log("File deleted successfully")
            alert("Video deleted successfully !")
            setVideoSrc(null);
            input.video = '';
        }).catch((error) => {
            alert(error.message)
            console.log(error.message);
        })
    }
    
    const changeThumb = (e) =>{
        try{
            const file = e.target.files[0];
            setThumb('photos/thumbnail/'+file.name);
            setBar(true);
            const thumbRef = ref(storage, 'photos/thumbnail/'+file.name);
            const upload = uploadBytesResumable(thumbRef, file);
            upload.on("state_changed",  async (snapshot)=>{
              const percent = Math.round((snapshot.bytesTransferred/snapshot.totalBytes)*100);
              if(percent === 100){setBar(false)};
              setProcess(percent);
              },(err)=> console.error(err),
              async()=>{
                const url = await getDownloadURL(upload.snapshot.ref);
                // console.log(url);
                input.thumbnail = url;
                setThumbnail(url);
              }
            )
        } catch(err){
            console.error(err.message);
        }
    }
    const changeVideo = (e) =>{
        setBar(true);
        const file = e.target.files[0];
        setVideo('videos/'+file.name);
        const videoRef = ref(storage, 'videos/'+file.name);
        const upload = uploadBytesResumable(videoRef, file);
        upload.on("state_changed", async (snapshot)=>{
            const percent = Math.round((snapshot.bytesTransferred/snapshot.totalBytes)*100);
            setProcess(percent);
            if(percent === 100){setBar(false)};
        },(err)=>console.error(err),
        async()=>{
            const video_url = await getDownloadURL(upload.snapshot.ref);
            setVideoSrc(video_url);
            input.video = video_url;
        }
        )
    }
    const submitVideo = async (e)=>{
        e.preventDefault();
        try{
            if(thumbnail && videoSrc){
                setLoading(true);
                const res = await axios.post(`http://localhost:3200/api/upload/new/video/${currUser.email}`, input);
                console.log(res.data)
                if(res.status === 200){
                    navigate('/videos');
                }
            } else{
                alert("Please upload your thumbnail and video")
            }
        } catch(err){
            console.log(err)
            alert(err.message);
        }
    }
    const onChange = (event) =>{
        const {name, value} = event.target;
         setInput((prev)=>({
          ...prev, [name]:value
         }))
         console.log(input);
      }
  return (
    <>
    {bar?
        <div className="progress" role="progressbar" aria-label="Example 1px high" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" >
          <div className="progress-bar" style={{width: `${process}%`, background:"red"}}></div>
        </div>
        :null}
        {bar?
        <div className="editUser text-center" style={{zIndex:"3",background:"rgba(20, 20, 20, 0.779)",borderRadius:"5px", width:"100%", height:"100%", position:"fixed", left:"0" ,top:"0", display:""}}>
            <div style={{transform:"translate(0%,200%)", color:"white", width:'fit-content',margin:'auto'}}>
                <div className="spinner-border text-light spinner-border-sm" role="status">
                  <span className="visually-hidden m-1">Loading...</span>
                </div>
                <p className='m-2'>Please wait...</p>
                <p>{process}%</p>
                <code className='m-2'> <i className=' bi bi-arrow-return-right'></i> Don't go back while uploading</code>
            </div>
        </div>:null}
    <main className='bottom-part'>
      <h2 className="RecomendedText">Upload new video </h2>   
      <div className='container my-3 p-0'>
        <div className='d-flex justify-content-between uploadForm' style={{color:"white"}}>
            <div>
                <div className='mb-4'>
                    <p className='d-flex align-items-center'>Thumbnail preview 
                        <div className='text-end' style={{height:"30px"}}>
                        <button onClick={()=>{deleteThumb(thumb)}} className='mx-3 bg-warning border-0' style={{display:thumbnail?"block":"none"}}>Delete</button>
                        </div>
                    </p>
                    <img src={thumbnail?thumbnail:'/assets/nophoto.png'} alt="thumbnail" height="200px"  width='300px'/>
                    {/* <div style={{backgroundImage:thumbnail?`url('${thumbnail}')`:`url('/assets/nophoto.png')`,height:"200px", width:'300px', backgroundSize:"cover"}} ></div> */}
                </div>
                <div className='mt-3'>
                    <p className='d-flex align-items-center'>Video preview 
                    <div className='text-end' style={{height:"30px"}}>
                        {videoSrc?<button onClick={()=>{deleteVideo(video)}} className='mx-3 bg-warning border-0'>Delete</button>:null}
                        </div>
                    </p>
                    <iframe  width="100%" height="200" src={videoSrc?videoSrc:"https://firebasestorage.googleapis.com/v0/b/react-app-47bc4.appspot.com/o/videos%2FINTRO%201.mp4?alt=media&token=546ebb96-9469-4f03-8a9e-f2827cbdea9d" } title="VIM CORN.com video player"  ></iframe>
                </div>
            </div>
            <form onSubmit={submitVideo}>
            <p style={{color:'lightgrey'}}>Please fill all the details carefully. Before submitting please select visibility, this will help to choose when to publish and who can see your video.</p>
                <div className='d-flex flex-column uploadVideo'>
                    <label htmlFor="title">Title (required)</label>
                    <textarea onChange={onChange} type="text" name='title' id='title' required placeholder='Give some attractive title' minLength='5' maxLength='100' ></textarea>
                    <p className='m-0 text-end'>{input.title!== ''?input.title.split(' ').length:'0'}/100</p>
                </div>
                <div className='d-flex flex-column uploadVideo mt-4'>
                    <label htmlFor="description">Description</label>
                    <textarea onChange={onChange} type='text' name="description" id="description" cols="30" rows="5" placeholder='Tell viewers about your video' minLength='10' maxLength='5000'></textarea>
                    <p className='m-0 text-end'>{input.description!=='' ?input.description.split(' ').length:'0'}/5000</p>
                </div>
                <div className='d-flex justify-content-between'>
                    <div className='uploadSection'>
                        <label onClick={navigateLogin} >Thumnail (required)
                            <p className='m-0' style={{color:'grey', fontSize:"0.7rem"}}>Select or upload a picture that shows what's in your video. A good thumbnail stands out and draws viewers' attention.</p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="m-3 bi bi-image-fill" viewBox="0 0 16 16">
                            <path d="M.002 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-12a2 2 0 0 1-2-2zm1 9v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062zm5-6.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0"/>
                            </svg>
                        </label>
                        <input className='text-center m-2 px-2' onChange={changeThumb} type="file" name='thumbnail' id='thumbnail' accept='image/*'  style={{fontSize:"0.7rem", width:'100%'}}  />
                    </div>
                    <div className='uploadSection'>
                        <label onClick={navigateLogin}  className=''>
                            Upload video (required)
                            <p className='m-0' style={{color:'grey', fontSize:"0.7rem"}}>Select or upload a video that viewers can enjoy your video. A good video stands for good gain of your profile.</p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="m-3 bi bi-play-btn-fill" viewBox="0 0 16 16">
                        <path d="M0 12V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2m6.79-6.907A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z"/>
                        </svg>
                        </label>
                        <input className='text-center m-2 px-2' onChange={changeVideo} type="file" name='video' id='video' accept="video/*" style={{fontSize:"0.7rem", width:'100%'}}  />
                    </div>
                </div>
                <p className='mt-4 m-1' style={{fontSize:'1rem', color:'darkgrey'}}>Visibility ( Please select visibility of your video. )</p>
                <div className='d-flex text-end'>
                    <div className="form-check mx-2">
                        <input onClick={()=>{input.visibility = 'off'}} className="form-check-input" type="radio" name="visibility" id="flexRadioDefault1" />
                        <label className="form-check-label" htmlFor="flexRadioDefault1">
                            Private
                        </label>
                    </div>
                    <div className="form-check mx-2">
                        <input onClick={()=>{input.visibility = 'on'}} className="form-check-input" type="radio" name="visibility" id="flexRadioDefault2" checked />
                        <label  className="form-check-label" htmlFor="flexRadioDefault2">
                        Public <code>(Default)</code>
                        </label>
                    </div>
                </div>
                <hr />
                <div className="mt-3" style={{textAlign: "end"}}>
                    <button type="reset" className="px-2 py-1 mx-2 btn btn-sm btn-secondary">Cancle</button>
                    <button onClick={navigateLogin} type="submit" className="px-2 py-1 mx-2 btn  btn-sm btn-primary">{
                        loading?
                        <div className='d-flex align-items-center'>
                        <div className="spinner-border text-light spinner-border-sm me-2" role="status">
                        <span className="visually-hidden m-1">loading...</span>
                        </div>Loading...</div>
                        :"Upload"}</button>
                </div>
            </form>
        </div>
      </div>
    </main>
    </>
  )
}
