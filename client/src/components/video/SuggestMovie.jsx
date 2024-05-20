import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import userContext from '../context/user/userContext';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../../firebase/firebaseConfig';
import axios from 'axios';

export default function SuggestMovie() {
    document.title = 'VIM Corn. - Suggest a movie'
    const navigate = useNavigate();
    const a = useContext(userContext);
    const [process, setProcess] = useState(0)
    const currUser = a.currUser;
    const [bar, setBar] = useState(false);
    const [dummyForm, setDummyForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [thumb, setThumb] = useState('')
    const [input, setInput] = useState({
        thumbnail:'',
    })
    const dummySubmit = (e) =>{
        setLoading(true)
        e.preventDefault();
        setDummyForm(true)
        setLoading(false)
    }
    const suggestMovie = (e) =>{
        e.preventDefault();
        setLoading(true)
        setBar(true)
        const thumbs = input.thumbnail;
        const uploadRef = ref(storage, '/thumbnail/'+thumbs.name)
        const uploadMovie = uploadBytesResumable(uploadRef, thumbs);
        uploadMovie.on('state_changed',async (snapshot)=>{
            const percent = Math.round((snapshot.bytesTransferred/snapshot.totalBytes)*100);
            if(percent === 100){setBar(false); setDummyForm(false);};
            setProcess(percent);
            },(err)=> console.error(err),
            async()=>{
              const url = await getDownloadURL(uploadMovie.snapshot.ref);
              console.log(url);
              input.thumbnail = url;
              console.log(input)
              const post = await axios.post(`http://localhost:3200/api/suggest/movie/${currUser.email}`,input);
              console.log(post.data)
              if(post.data){navigate('/')}
            })
    }
    const onChange = (e) =>{
        const {name, value} = e.target;
        setInput((prev) =>({
            ...prev, [name]:value
        }))
        console.log(input)
    }
    const changeThumb = (e) =>{
        const file = e.target.files[0];
        console.log(file)
        input.thumbnail = file;
        const reader = new FileReader();
      reader.onloadend = () => {
        setThumb(reader.result);
      };
      reader.readAsDataURL(file);
    }
  return (
    <>
    {bar?
        <div className="progress" role="progressbar" aria-label="Example 1px high" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" >
          <div className="progress-bar" style={{width: `${process}%`, background:"red"}}></div>
        </div>
        :null}
        {dummyForm?
        <div className="editUser text-center" style={{zIndex:"3",background:"rgba(20, 20, 20, 0.779)",borderRadius:"5px", width:"100%", height:"100%", position:"fixed", left:"0" ,top:"0", display:""}}>
            <div style={{transform: process>0?"translate(0%,200%)":"translate(0%,50%)", color:"white", width:'fit-content',margin:'auto'}}>
                {process > 0?
                <>
                <div className="spinner-border text-light spinner-border-sm" role="status">
                  <span className="visually-hidden m-1">Loading...</span>
                </div>
                <p className='m-2'>Please wait...</p>
                <p>{process}%</p>
                </>
                :
                <div>
                    <form onSubmit={suggestMovie}>
                        <div className='d-flex flex-column uploadVideo mb-3'>
                            <label htmlFor="title">Download link of your movie (required)</label>
                            <input onChange={onChange}  type="url" name='download_link' id='title' required placeholder='Please provide download link' minLength='5' maxLength='100' />
                        </div>
                        
                        <div className='d-flex flex-column uploadVideo'>
                            <label htmlFor="title">Please paste the link if full movie available on youtube (optional)</label>
                            <i className='bi bi-youtube'></i>
                            <input onChange={onChange}  type="url" name='youtube_link' id='title'  placeholder='Please provide full movie link' minLength='5' maxLength='100' />
                        </div>
                        or
                        <div className='d-flex flex-column uploadVideo'>
                            <label htmlFor="title">Upload full movie (optional)</label>
                            <input  type="file" name='full_movie' id='title' placeholder='Please provide download link' minLength='5' maxLength='100' />
                        </div>
                        <hr />
                        <button type='submit' className='btn btn-sm btn-secondary'>{loading?"Loading...":"Suggest"}</button>
                    </form>
                </div>
                }
                <code className='m-2'> <i className=' bi bi-arrow-return-right'></i> Don't go back while uploading</code>
            </div>
        </div>:null}
    <main className='bottom-part'>
      <h2 className="RecomendedText">Suggest a new movie</h2>   
      <div className='container my-3 p-0'>
        <div className='d-flex justify-content-between uploadForm' style={{color:"white"}}>
            <div>
                <div className='mb-4'>
                    <p className='d-flex align-items-center'>Thumbnail preview 
                    </p>
                    <img src={thumb!==''?`${thumb}`:'/assets/nophoto.png'} alt="thumbnail" height="200px"  width='300px'/>
                    {/* <div style={{backgroundImage:thumbnail?`url('${thumbnail}')`:`url('/assets/nophoto.png')`,height:"200px", width:'300px', backgroundSize:"cover"}} ></div> */}
                </div>
                
            </div>
            <form onSubmit={dummySubmit}>
                <p style={{color:'lightgrey'}}>Please fill all the details carefully. Before submitting please select visibility, this will help to choose when to publish and who can see your video.</p>
                <div className='d-flex flex-column uploadVideo'>
                    <label htmlFor="title">Title (required)</label>
                    <textarea onChange={onChange} type="text" name='title' id='title' required placeholder='Give some attractive title' minLength='5' maxLength='100' ></textarea>
                    <p className='m-0 text-end'>{input.title?input.title.split(' ').length:'0'}/100</p>
                </div>
                <div className='d-flex justify-content-between align-items-center mt-3'>
                    <div className='p-0' style={{width:'50%',height:"100%"}}>
                        <div className='d-flex flex-column uploadVideo mb-2'>
                            <label htmlFor="title">Genre <span>*</span></label>
                            <input onChange={onChange} required type="text" name='genre' placeholder='Genretion of your movie'/>  
                        </div>
                        <div className='d-flex flex-column uploadVideo mb-2'>
                            <label htmlFor="title">Actors <span>*</span></label>
                            <input onChange={onChange} required type="text" name='actors' placeholder='Actors of this movie'/>  
                        </div>
                        <div className='d-flex flex-column uploadVideo mb-1'>
                            <label htmlFor="title">Quality <span>*</span></label>
                            <select onChange={onChange} required name='quality' aria-label="Default select example" style={{outline:'none', background:'transparent', color:'darkgrey'}}>
                                <option selected value=''>Select quality</option>
                                <option value='1080p'>1080p</option>
                                <option value="720p">720p</option>
                                <option value="480p">480p</option>
                                <option value="WEBRIP">WEBRIP</option>
                            </select>
                        </div>
                    </div>
                    <div className='uploadSection mt-0'>
                        <label >Thumnail (required)
                            <p className='m-0' style={{color:'grey', fontSize:"0.7rem"}}>Select or upload a picture that shows what's in your video. A good thumbnail stands out and draws viewers' attention.</p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="m-3 bi bi-image-fill" viewBox="0 0 16 16">
                            <path d="M.002 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-12a2 2 0 0 1-2-2zm1 9v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062zm5-6.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0"/>
                            </svg>
                        </label>
                        <input onChange={changeThumb} required className='text-center m-2 px-2' type="file" name='thumbnail' id='thumbnail' accept='image/*'  style={{fontSize:"0.7rem", width:'100%'}} />
                    </div>
                </div>
                <div className='d-flex justify-content-between  align-items-center mt-3'>
                    <div className='d-flex flex-column uploadVideo mb-1 me-1' style={{width:"20%"}}>
                        <label htmlFor="title">Release at <span>*</span></label>
                        <input type="date" onChange={onChange} name='release_at'/>  
                    </div>
                    <div className='d-flex flex-column uploadVideo mb-1 me-1' style={{width:"50%"}}>
                        <label htmlFor="title">Director <span>*</span></label>
                        <input onChange={onChange} required name='director' type="text"  placeholder='Who directed this movie'/>  
                    </div>
                    <div className='d-flex flex-column uploadVideo mb-1' >
                        <label htmlFor="title" style={{width:"max-content"}}>Select language of your movie <span>*</span></label>
                        <select onChange={onChange} required name='language' aria-label="Default select example" style={{outline:'none', background:'transparent', color:'darkgrey'}}>
                            <option selected value=''>Select language</option>
                            <option value='Hindi'>Hindi</option>
                            <option value="Bengali">Bengali</option>
                            <option value="English">English</option>
                            <option value="Tamil">Tamil</option>
                        </select>
                    </div>
                </div>
                <div className='d-flex justify-content-between align-items-center mt-3'>
                    <div className='d-flex flex-column uploadVideo mb-1 me-1' style={{width:"50%"}}>
                        <label htmlFor="title">Trailer of your movie <span>*</span></label>
                        <input onChange={onChange} name='movie_trailer' type="url"  placeholder='Paste link of trailer from youtube' required/>  
                    </div>
                    <div className='d-flex flex-column uploadVideo mb-1 me-1' style={{width:"max-content"}}>
                        <label htmlFor="title">Duration of your movie <span>*</span></label>
                        <input type="number" onChange={onChange} name='duration' placeholder='Duration of your movie in minute' required/>  
                    </div>
                    <div className='d-flex flex-column uploadVideo mb-1 me-1' style={{width:"20%"}}>
                        <label htmlFor="title">Country <span>*</span></label>
                        <input onChange={onChange} name='country' type="country"  placeholder='Where the movie was made' required/>  
                    </div>
                </div>
                
                <div className='d-flex flex-column uploadVideo mt-4'>
                    <label htmlFor="description">Description</label>
                    <textarea onChange={onChange}  type='text' name="description" id="description" cols="30" rows="5" placeholder='Tell viewers about your movie briefly' minLength='10' maxLength='5000'></textarea>
                    <p className='m-0 text-end'>{input.description?input.description.split(' ').length:'0'}/5000</p>
                </div>
                
                <hr />
                <div className="mt-3" style={{textAlign: "end"}}>
                    <button type="reset" className="px-2 py-1 mx-2 btn btn-sm btn-secondary">Cancle</button>
                    <button  type="submit" className="px-2 py-1 mx-2 btn  btn-sm btn-primary">{
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
