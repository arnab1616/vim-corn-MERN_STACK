import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { selectUsers } from '../../redux/userSlice';
import {Link, useNavigate, Outlet} from 'react-router-dom'
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig';
import Login from '../../pages/authPages/Login';
import DropdownPopup from './DropdownPopup';
import Videos from '../../pages/Videos';
import SearchResult from '../../pages/SearchResult';
import UploadClips from '../video/UploadClips';

export default function Header() {
  const [currUser, setUser] = useState(false);
  const [modal, setModal] = useState(false);
  const [title, setTitle] = useState([])
  const [vTitle, setVtitle] = useState([])
  const [search_q, setSearch_q] = useState({search_query:''})
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const openModal = () =>{
    if(modal){
      setModal(false)
    }else{
      setModal(true)
    }
  }
  const searchQuery = async(e) =>{
    try{
      e.preventDefault();
      navigate(`/result?search_query=${search_q.search_query}`)
      setModal(false)
      // return <SearchResult/>
    }catch(err){
      console.log(err.massage)
      navigate('/')
    }
  }
  const onSearch = async(e) =>{
    const {name,value} = e.target
    setSearch_q((prev)=>({
      ...prev, [name]:value
    }));
    console.log(search_q)
    const search = await axios.get(`http://localhost:3200/api/search/videos?serach_query=${search_q.search_query}`)
    console.log(search.data)
    setVtitle(search.data)
    const search1 = await axios.get(`http://localhost:3200/api/search/movies?serach_query=${search_q.search_query}`)
    console.log(search1.data)
    setTitle(search1.data)
  }
  useEffect(()=>{
    onAuthStateChanged(auth, async (user)=>{
        if(user){
            console.log(user.uid);
            const res = await axios.get(`http://localhost:3200/user/callback/${user.email}`);
            console.log(res.data)
            const currUser = res.data;
            setUser(currUser);
            dispatch(setUser({id: user.uid,name:currUser.name,username:currUser.username, email: currUser.email, pic_Url: currUser.img}));
        } else{
            dispatch(setUser(null));
        }
    })
},[])
  // useEffect(()=>{
  //   const getUser = async() =>{
  //     try{
  //       const res = await axios.get('http://localhost:3200/auth/login/success');
  //       console.log(res.data)
  //       if(res.status === 200) {
  //         console.log("work");
  //       }
  //     } catch(err){
  //       console.log(err);
  //     } finally{
  //       setIsLoading(false);
  //     }
  //   }
  //   getUser();
  // },[])
  return (
    <>
      <section className="header-background fixed-top d-flex">
        <nav className="navbar navbar-expand-lg py-1 col" aria-label="Offcanvas navbar large">
          <div className="container-fluid">
            <div className="d-flex">
              {/* <!-- option button -->
              <!-- <div className="d-flex align-items-center"> --> */}
                <button id="toggleBtn" className=" btn btn-outline-dark px-0 align-items-center" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions" aria-label="Toggle navigation">
                  <svg xmlns="http://www.w3.org/2000/svg" width="35" height="25" fill="currentColor" className="bi bi-box-arrow-up" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M3.5 6a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 1 0-1h2A1.5 1.5 0 0 1 14 6.5v8a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-8A1.5 1.5 0 0 1 3.5 5h2a.5.5 0 0 1 0 1h-2z"/>
                    <path fillRule="evenodd" d="M7.646.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 1.707V10.5a.5.5 0 0 1-1 0V1.707L5.354 3.854a.5.5 0 1 1-.708-.708l3-3z"/>
                  </svg>
                </button>
              {/* <!-- </div> -->
              <!-- ------- -->
              <!-- page icon --> */}
              <Link className="navbar-brand me-lg-5 p-0" to="/">
                <div className="">
                  <img src="/assets/VIM__1_-removebg-preview.png" alt="logo" height="55"/>
                </div>
              </Link>
            </div>
            {/* <!-- toggle button --> */}
            <div className="d-flex tg">
              <button className=" btn " type="button" data-bs-toggle="collapse" data-bs-target="#navbarsExample05" aria-controls="navbarsExample05" aria-expanded="true" aria-label="Toggle navigation">
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25"  fill="currentColor" className="s bi bi-search" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
              </button>
              <button className="btn btn-outline-primary p-1" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar2" aria-controls="offcanvasNavbar2" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="loginDiv dropstart">
              {currUser? 
                  <>
                  <Link className="mx-2" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src={currUser.pic_Url} height="32x" width="32px" alt="user" style={{borderRadius:"50%",border:"1px solid white"}}/>
                  </Link> 
                  <DropdownPopup currUser={currUser} />
                  </>
                  :
                  <Link className="login" to="/login" >Login</Link>}

              </div>
            </div>
            {/* <!-- search bar and icons --> */}
            <div className="d-flex gradient-background">
              <div className="navbar-collapse collapse" id="navbarsExample05">
                <form onSubmit={searchQuery} className="d-flex p-1" role="search" style={{width: "100%"}}>
                  <input onFocus={openModal} onChange={onSearch} autoComplete='off' name='search_query' className="form-control me-1" type="search" placeholder="Search movies,videos or songs" aria-label="Search" />
                  {/* <!-- <button className="btn btn-outline-success" type="submit">Search</button> --> */}
                  <div className=" d-flex">
                    <button className="btn btn-light d-flex align-items-center mx-1 " type="submit" style={{borderBottomRightRadius: "50px", borderTopRightRadius: "50px"}} >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"  fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                      </svg>
                    </button>
                    <button className="btn btn-secondary d-flex align-items-center mx-1" type="microphone" style={{ borderRadius: "50%"}}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-mic-fill" viewBox="0 0 16 16">
                          <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0V3z"/>
                          <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"/>
                      </svg>
                    </button>
                  </div>
                </form>
              </div>
              <div className="offcanvas offcanvas-end text-bg-dark" tabIndex="-1" id="offcanvasNavbar2" aria-labelledby="offcanvasNavbar2Label">
                <div className="offcanvas-header">
                  <h5 className="offcanvas-title me-2" id="offcanvasNavbar2Label">Menu</h5>
                  <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                  <ul className="navbar-nav  justify-content-end flex-grow-1 pe-3">
                    <li className="nav-item dropdown">
                      <Link className="nav-link" data-bs-toggle="dropdown" aria-current="page" to="#">
                        <button className="btn btn-outline-light">
                          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="me-1 bi bi-plus-circle-fill" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
                          </svg>
                          <h5 className="headIcontext">Create</h5>
                        </button>
                      </Link>
                      <ul className="dropdown-menu" data-bs-theme="dark" style={{fontSize:"0.8rem"}}>
                        <li className=''>
                          <Link className="dropdown-item d-flex align-items-center gap-2" to="/upload/videos">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className=" me-2 bi bi-play-btn" viewBox="0 0 16 16">
                            <path d="M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z"/>
                            <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z"/>
                          </svg>
                            Upload video
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item d-flex align-items-center gap-2" to="suggest/movie">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="me-2 bi bi-camera-reels" viewBox="0 0 16 16">
                            <path d="M6 3a3 3 0 1 1-6 0 3 3 0 0 1 6 0M1 3a2 2 0 1 0 4 0 2 2 0 0 0-4 0"/>
                            <path d="M9 6h.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 7.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 16H2a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm6 8.73V7.27l-3.5 1.555v4.35zM1 8v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1"/>
                            <path d="M9 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6M7 3a2 2 0 1 1 4 0 2 2 0 0 1-4 0"/>
                          </svg>
                            Suggest movie
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item d-flex align-items-center gap-2" to="#" target="_blank">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="me-2 bi bi-pencil-square" viewBox="0 0 16 16">
                              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                              <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                            </svg>
                            Create post
                          </Link>
                        </li>
                      </ul>
                    </li>
                    
                    <li className="nav-item">
                      <Link className="nav-link" to="#">
                        <button className="btn btn-outline-light">
                          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className=" me-1 bi bi-bell-fill " viewBox="0 0 16 16">
                              <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z"/>
                          </svg>
                          <h5 className="headIcontext ">Notifications</h5>
                        </button>
                     </Link>
                    </li>
                    
                    <li className="nav-item">
                      <Link className="nav-link" to="#">
                        <button className="btn btn-outline-light" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-lightning-charge-fill" viewBox="0 0 16 16">
                            <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"/>
                          </svg>
                          <h5 className="headIcontext">Clips</h5>
                        </button>
                      </Link>
                    </li>
                  </ul>  
                </div>
              </div>
            </div>
          </div>
        </nav>
        <div className="col-1  dropstart" >
          {currUser? 
          <>
          <Link title={currUser.name} className="" data-bs-toggle="dropdown" aria-expanded="false">
            <img src={currUser.pic_Url} height="42px" width="42px" alt="user" style={{borderRadius:"50%",border:"1px solid white"}}/>
          </Link> 
          <DropdownPopup currUser= {currUser}/>
          </>
          :
          <Link title='Login to VIM Corn' className="login" to="/login" >Login</Link>}
            
        </div>
      </section>
      <div onClick={()=>{setModal(false)}} className='fixed-top searc-history'  style={{display: modal?'block':'none'}}>
        <div className='p-1 rounded-2' style={{}}>
          <div className='d-flex flex-column'>
              {!title.length?<Link style={{textDecoration:'none', color:'white'}}> <i className='bi bi-search'></i> No search history</Link>:
                title.map((elm)=>{
                  return (
                    <Link to={`/movies/explore/${elm.id}`} className='p-1' style={{textDecoration:'none', color:'white', fontSize:'0.8rem'}}> <i className='bi bi-search'></i> {elm.title.slice(0,45)}....</Link>
                  )
                })
              }
              {!vTitle.length?null:
                vTitle.map((elm)=>{
                  return (
                    <Link to={`/videos/play/${elm.id}`} className='p-1' style={{textDecoration:'none', color:'white', fontSize:'0.8rem'}}> <i className='bi bi-search'></i> {elm.title.slice(0,45)}....</Link>
                  )
                })
              }
            </div>
        </div>
      </div>
      <UploadClips/>
      <Outlet/>
    </>
  )
}
