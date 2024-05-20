import React, { useContext, useEffect, useState } from 'react'
import './profile.css'
import { Link, Outlet, useParams } from 'react-router-dom'
import { auth, storage } from '../firebase/firebaseConfig';
// import { onAuthStateChanged } from 'firebase/auth';
// import { setUser } from '../redux/userSlice';
// import { useDispatch } from 'react-redux';
import axios from 'axios';
// import { Link} from 'react-router-dom';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import userContext from '../components/context/user/userContext';
import { format} from 'timeago.js';


export default function Profile() {
  const params = useParams();
  

  const props = useContext(userContext);
  const currUser = props.currUser;
  console.log(currUser)

  // const [currUser, setUser] = useState(null)
  const [visible, setvisibale]  = useState(false);
  // const[otherUsers, setOtherUsers] = useState(false)
  const [bar, setBar]  = useState(false);
  document.title = `VIM Corn. - Profile | ${currUser.name}`;
  const [dp , setFile] = useState(null);
  const [dpPreview,setDpPreview] = useState(null);
  const [process, setProcess] = useState(0);
  const [basic, setBasic] = useState({
    name:'',
    username:'',
    phonenumber:'',
    photoURL:'',
    cover:''
  })

  // useEffect(()=>{
  //   try{
  //     console.log(params.userid)
  //     if(currUser.email === params.userid){
  //       console.log("Current user: "+currUser.email)
  //       setOtherUsers(false)        
  //       console.log(otherUsers)
  //     } else{
  //       console.log("User params : "+params.userid)
  //       setOtherUsers(true)
  //       console.log(otherUsers)
  //     }
  //   } catch(err){
  //     console.log(err.message);
  //   } finally{
  //     // setIsLoading(false)
  //   }
  // },[])
const dpChange = (e)=>{
  const file = e.target.files[0];
  setFile(file);
  console.log(file)
  const reader = new FileReader();
      reader.onloadend = () => {
        setDpPreview(reader.result);
      };
      reader.readAsDataURL(file);
}
const coverChange = (e)=>{
  const file = e.target.files[0];
  setBar(true);
  const coverRef = ref(storage, 'photos/cover/'+file.name);
  const upload = uploadBytesResumable(coverRef, file);
  upload.on("state_changed",  async (snapshot)=>{
    const percent = Math.round((snapshot.bytesTransferred/snapshot.totalBytes)*100);
    if(percent === 100){setBar(false)};
    setProcess(percent);
    },(err)=> console.error(err),
    async()=>{
      const url = await getDownloadURL(upload.snapshot.ref);
      console.log(url)
      basic.cover = url
      const res = await axios.post(`http://localhost:3200/user/update/cover/${currUser.email}`, basic);
      console.log(res.data);
    }
  )

}
const onChange = (event) =>{
  const {name, value} = event.target;
   setBasic((prev)=>({
    ...prev, [name]:value
   }))
   console.log(basic);
}

const handleSubmit = (e) =>{
  e.preventDefault();
  setvisibale(true);
  setBar(true);
  try{
    console.log(dp)
    if(dp){
      const coverRef = ref(storage, 'photos/dp/'+dp.name);
      const upload = uploadBytesResumable(coverRef, dp);
      upload.on("state_changed",  async (snapshot)=>{
        const percent = Math.round((snapshot.bytesTransferred/snapshot.totalBytes)*100);
        if(percent === 100){setBar(false)};
        setProcess(percent);
      },(err)=> console.error(err),
      async()=>{
        const url = await getDownloadURL(upload.snapshot.ref);
        setDpPreview(url);
        basic.photoURL = url;
        const res = await axios.post(`http://localhost:3200/user/update/${currUser.email}`,basic);
        console.log(res.data);
      }
      )
    }
   console.log(process)
  } catch(err){
    console.log(err.message);
  }
}
if(props.isLoading){
  return <main className='bottom-part text-center'><p style={{color:'white'}}>Loading...</p></main>
}
  return (
    <>
      {bar?
        <div className="progress" role="progressbar" aria-label="Example 1px high" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" >
          <div className="progress-bar bg-danger" style={{width: `${process}%`}}></div>
        </div>
        :null}
      <main className='bottom-part'>
      
        <div className='profileElm' style={{color:"white"}}>
        
            <div className='text-end heroImage' style={{backgroundImage:`url('${currUser.cover?currUser.cover:"/assets/2.png"}')`}}>
              <div className='text-center ' style={{transform :"translate(12%,50%)", width:"fit-content"}}>
                <img className='userImage' src={currUser?currUser.img:'/assets/image.png'} alt="user" />
              </div>
              <div className='coverImage'>
                <label htmlFor="formFile" className="form-label px-3" > <i className='btn btn-sm btn-dark rounded-circle bi bi-camera'></i> </label>
                <input onChange={coverChange} className="form-control" type="file" id="formFile"  style={{display:"none"}}></input>
                
              </div>
            </div>
            <div className='userInfo'>
                <div className=''>
                  <strong>{currUser.name}</strong>
                  <p className='m-0'>@{currUser.username} - {currUser.subscriber} subscriber</p>
                  <p className='m-0'>{currUser.about}</p>
                  <p className='m-0' style={{color:"grey", fontSize:"0.85rem"}}>Last update at - {format(currUser.timestamps, 'en_US')}</p>

                </div>
                <div className='mt-2' style={{height:"fit-content",position:"relative", bottom:'0px'}}>
                  <button className='m-1 btn btn-secondary btn-sm' type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                    Edit profile <i className="bi bi-pen"></i>
                  </button>
                  <button className=' m-1 btn btn-secondary btn-sm'>
                  Manage videos
                  <svg className='mx-1' xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M480-160H160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v200h-80v-200H160v480h320v80ZM380-300v-360l280 180-280 180ZM714-40l-12-60q-12-5-22.5-10.5T658-124l-58 18-40-68 46-40q-2-14-2-26t2-26l-46-40 40-68 58 18q11-8 21.5-13.5T702-380l12-60h80l12 60q12 5 22.5 11t21.5 15l58-20 40 70-46 40q2 12 2 25t-2 25l46 40-40 68-58-18q-11 8-21.5 13.5T806-100l-12 60h-80Zm40-120q33 0 56.5-23.5T834-240q0-33-23.5-56.5T754-320q-33 0-56.5 23.5T674-240q0 33 23.5 56.5T754-160Z"/></svg>
                  </button>
                </div>
            </div>
            <div className="collapse editProfile mt-5" id="collapseExample" style={{ background:"transparent", margin:'auto'}}>
              <div className="card card-body m-0 " style={{background: "transparent", boxShadow:"1px 1px 2px 0px black" ,color:'lightgrey'}}>
                  {visible?
                  <div className="editUser text-center" style={{zIndex:"3",background:"rgba(20, 20, 20, 0.359)",borderRadius:"5px", width:"100%", height:"100%", position:"absolute", left:"0" ,top:"0", display:""}}>
                      <div style={{transform:"translate(0%,100%)", color:"white"}}>
                        {process !== 100?<>
                          <div className="spinner-border text-light spinner-border-sm" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          <p className='m-0'>Please wait...</p>
                        </>:
                        <p className="p-0"> Complete ! <img className="m-0" height="20px" width="20px" src="https://upload.wikimedia.org/wikipedia/commons/7/74/Eo_circle_cyan_checkmark.svg" alt="tick" /> </p>
                        }
                        <p >Updating your data... {process}%</p>
                        <Link to="/"  className="btn btn-info btn-sm">Go back</Link>
                      </div>
                  </div>:null}
              <form className="containeer-fluid" onSubmit={handleSubmit}>
                  <section className='mb-3 collapse show'>
                    <div className='d-flex justify-content-evenly'>
                        <div className="photoGroup ">
                            <label htmlFor="user" className="form-label">
                            {/* <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-cloud-arrow-down-fill" viewBox="0 0 16 16">
                            <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2m2.354 6.854-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5a.5.5 0 0 1 1 0v3.793l1.146-1.147a.5.5 0 0 1 .708.708"/>
                            </svg> */}
                            Profile photo <span>*</span>
                            </label>
                            
                            <input required onChange={dpChange}  className="form-control" name='user' type="file" accept="image/*" style={{display:""}} />
                        </div>
                        <div className="photoGroup" >
                            <img src={dpPreview?dpPreview:'/assets/nophoto.png'} alt="preview" height="120px" width="200" />
                        </div>
                    </div>
                  </section>
                  <section >
                  <div className="d-flex align-items-center justify-content-evenly">
                      <div className="inputGroup me-2" style={{textAlign: "left"}}>
                          <label className="" htmlFor="EmailorPhoneNumber">Full Name <span>*</span></label>
                          <input onChange={onChange} type="text" name="name" required/>
                      </div>
                      <div className="inputGroup mt-2">
                          <label className="" htmlFor="email">Email</label>
                          <input readOnly  className="" type="email" name="email" value={currUser.email} />
                      </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-evenly mt-2">
                      <div className="inputGroup me-2 " style={{textAlign: "left"}}>
                          <label className="" htmlFor="EmailorPhoneNumber">Username <span>*</span></label>
                          <input onChange={onChange}  className="" type="username" name="username" required/>
                      </div>
                      <div className="inputGroup" style={{textAlign: "left"}}>
                          <label className="" htmlFor="EmailorPhoneNumber">Phone<span>*</span></label>
                          <input onChange={onChange}  className="" type="number" name="phonenumber" required/>
                      </div>
                  </div>
                  <div className='aboutGroup mt-3'>
                      <label  htmlFor="about">About you</label>
                      <textarea onChange={onChange} name="about" id="" cols="30" rows="3"></textarea>
                  </div>
                  </section>
                  <div className="mt-3" style={{textAlign: "end"}}>
                      <button type="reset" className="px-2 py-1 mx-2 btn btn-sm btn-warning">Cancle</button>
                      <button type="submit" className="px-2 py-1 mx-2 btn  btn-sm btn-primary">Save chenges</button>
                  </div>
              </form>
              </div>
            </div>
        </div>
          <div className='mx-3 mt-3 profileNavigation' >
            <ul className="nav " >
              <li className="nav-item">
                <Link className="nav-link  py-1" aria-current="page" to={`home/${currUser.email}`}>Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link  py-1" to={`your/videos/${currUser.email}`}>Videos</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link  py-1" to={`your/videos/${currUser.email}`}>Clips</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link  py-1" to="#">Playlist</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link  py-1" to={`subscriptions/${currUser.email}`}>Subscriptions</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link py-1" to={`saved/videos/${currUser.email}`}>Saved</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link py-1" to={`liked/videos/${currUser.email}`}>Liked</Link>
              </li>
              <li className="nav-item mx-2 d-flex align-items-center">
                <form className='searchIntoProfile px-2 d-flex align-item-center'>
                  <button className="btn btn-sm p-0 m-0 me-2 bi bi-search border-0" type="submit" style={{color:"lightgrey"}}></button>
                  <input type="search" name='search' id='search' required/>
                </form>
              </li>
            </ul>
          </div>
          <Outlet/>
      </main>
    </>
  )
}

