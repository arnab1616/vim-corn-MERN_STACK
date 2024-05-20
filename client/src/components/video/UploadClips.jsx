import React, { useContext, useState } from 'react'
import { storage } from '../../firebase/firebaseConfig';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import axios from 'axios'
import userContext from '../context/user/userContext';
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom'
export default function UploadClips() {
    const BASE_URL = 'http://localhost:3200';
    const navigate = useNavigate()
    const props = useContext(userContext);
    const currUser = props.currUser;
    const [form, setForm] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [bar, setBar] = useState(false)
    const [clip,setClip] = useState('');
    const [input, setInput] = useState({
        title:'',clips_url:''
    })
    const [process,setProcess] = useState(0);
    const [clipSrc, setClipSrc] = useState(false);
    const UploadClips = async(e)=>{
        e.preventDefault();
        console.log(input)
        setIsLoading(true)
        if(!input.clips_url){
            alert("Please select clips !")
        }else{
            try{
                const res = await axios.post(`${BASE_URL}/api/upload/new/clips/${currUser.email}`,input);
                if(res.data){
                    navigate('/videos')
                    input.clips_url = '';
                    setClip(false)
                    setClipSrc(null);
                    setForm(false)
                    setTimeout(() => {
                        setIsLoading(false)
                    }, 1000);
                }
            }catch(err){
                alert(err.message);
            }
        }
    }
    const onchange = (e) =>{
        const {name, value} = e.target;
        setInput((prev)=>({
            ...prev, [name]:value
        }))
    }
    const deleteClip = (item) =>{
        console.log("Clicked")
        console.log(item);
        const desertRef = ref(storage, clip);
        // Delete the file
        deleteObject(desertRef).then(() => {
            console.log("File deleted successfully")
            alert("Video deleted successfully !")
            setClipSrc(null);
            input.clips_url = '';
        }).catch((error) => {
            alert(error.message)
            console.log(error.message);
        })
    }
    const changeClips = (e) =>{
        setBar(true);
        // setForm(false)
        const file = e.target.files[0];
        setClip('videos/clips/'+file.name);
        const videoRef = ref(storage, 'videos/clips/'+file.name);
        const upload = uploadBytesResumable(videoRef, file);
        upload.on("state_changed", async (snapshot)=>{
            const percent = Math.round((snapshot.bytesTransferred/snapshot.totalBytes)*100);
            setProcess(percent);
            console.log(percent)
            if(percent === 100){
                setBar(false)
                // setForm(true)
            };
        },(err)=>console.error(err),
        async()=>{
            const video_url = await getDownloadURL(upload.snapshot.ref);
            setClipSrc(video_url);
            console.log(video_url)
            input.clips_url = video_url;
        }
        )
    }
  return (
    <div>
        {bar?
        <div className="progress" role="progressbar" aria-label="Example 1px high" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" >
          <div className="progress-bar" style={{width: `${process}%`, background:"red"}}></div>
        </div>
        :null}
      <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className={form?"modal-dialog modal-lg modal-dialog-centered":"modal-dialog modal-dialog-centered"}>
            <div className="modal-content" style={{background:'rgb(33,35,39', color:'gray'}}>
                {bar?<div className='d-flex align-items-center justify-content-center placeholder-wave' style={{position:'absolute',height:'100%', width:'100%', background:"rgb(33,35,39", zIndex:'1'}}>
                    <div className='text-center'>
                        <h4 className='placeholder-wave'>Uploading clips... {process}%</h4>
                        <div className="spinner-border text-secondary spinner-border-sm" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className='m-0'>Please wait...</p>
                    </div>
                </div>:null}
                <>
                <div className="modal-header p-1 px-2">
                    <h1 className="modal-title fs-5" id="staticBackdropLabel"> <i className="bi bi-lightning-charge-fill"></i> Clips</h1>
                    <i onClick={()=>{setForm(false)}} type="button" className="bi bi-x-circle fs-5" data-bs-dismiss="modal" aria-label="Close"></i>
                </div>
                <div className="modal-body">
                    {!form?"Do you want to explore Clips or Upload Clips ?"
                    :
                    <form onSubmit={UploadClips}>
                        <div className='d-flex flex-column uploadVideo'>
                            <label htmlFor="title">Caption (required)</label>
                            <textarea onChange={onchange} type="text" name='title' id='title' required placeholder='Give some attractive title' minLength='5' maxLength='100' ></textarea>
                            <p className='m-0 text-end'>{input.title!== ''?input.title.split(' ').length:'0'}/100</p>
                        </div>
                        <div className='d-flex align-items-center justify-content-between mt-2'>
                            <div className='uploadSection mt-0'>
                                <label  className=''>
                                    Upload Clip (required)
                                    <p className='m-0' style={{color:'grey', fontSize:"0.7rem"}}>Select or upload a video that viewers can enjoy your video. A good video stands for good gain of your profile.</p>
                                    <i className='bi bi-lightning-charge-fill fs-4'></i>
                                </label>
                                <input onChange={changeClips} className='text-center m-2 px-2' type="file" name='video' id='video' accept="video/*" style={{fontSize:"0.7rem", width:'100%'}}  />
                            </div>
                            <div className=''>
                                <p className='d-flex align-items-center m-0'>Clip preview 
                                    <div className='text-end' style={{height:"30px"}}>
                                    {clipSrc?<button onClick={deleteClip} className='mx-3 bg-warning border-0'>Delete</button>:null}
                                    </div>
                                </p>
                                <iframe  width="100%" height="200" src={clipSrc?clipSrc:"https://firebasestorage.googleapis.com/v0/b/react-app-47bc4.appspot.com/o/videos%2FINTRO%201.mp4?alt=media&token=546ebb96-9469-4f03-8a9e-f2827cbdea9d" } title="VIM CORN.com video player"  ></iframe>
                            </div>
                        </div>
                        <div className="mt-3 text-end">
                            <button type="reset" className="btn btn-secondary btn-sm rounded-5 mx-1" >Reset</button>
                            <button type="submit" className="mx-1 btn btn-info btn-sm rounded-5" data-bs-dismiss={isLoading?"modal":null} aria-label={isLoading?"Close":null}>{isLoading?"Uploading...":"Upload"}</button>
                        </div>
                    </form>}
                </div>
                {!form?<div className="modal-footer">
                    <Link to='/videos'><button type="" className="btn btn-secondary btn-sm rounded-4" data-bs-dismiss="modal">Explore</button></Link>
                    <button onClick={()=>{setForm(true)}} type="button" className="btn btn-primary btn-sm rounded-4">Upload</button>
                </div>:null}
                </>
            </div>
        </div>
        {/* <div className='modal-dialog modal-dialog-center'>
            <div className='modal-content'>
                <h1>kdfbsdf</h1>
            </div>
        </div> */}
        </div>
    </div>
  )
}
