import { useEffect, useState } from 'react'
import './App.css'
import Header from './components/partials/Header'
import Sidebar from './components/partials/Sidebar'
import Home from './pages/Home'
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom'
import Login from './pages/authPages/Login'
import SignUp from './pages/authPages/SignUp'
import Videos from './pages/Videos'
import { selectUsers } from './redux/userSlice'
import { useSelector } from 'react-redux'
import Loading from './components/partials/Loading'
import Profile from './pages/Profile'
import UserState from './components/context/user/UserState'
import Songs from './pages/Songs'
import UploadVideo from './components/video/UploadVideo'
import VideoPlayer from './components/video/VideoPlayer'
import OtherUser from './components/profile/OtherUser'
import { Placeholder } from 'react-bootstrap'
import RecomendedPlaceholder from './components/video/RecomendedPlaceholder'
import ProfileHome from './components/profile/ProfileHome'
import ProfileVideos from './components/profile/ProfileVideos'
import ProfileSubscriptions from './components/profile/ProfileSubscriptions'
import ProfileSavedVideos from './components/profile/ProfileSavedVideos'
import ProfileLikedVideos from './components/profile/ProfileLikedVideos'
import TrendingVideos from './components/video/TrendingVideos'
import SuggestMovie from './components/video/SuggestMovie'
import MovieView from './components/video/MovieView'
import SearchResult from './pages/SearchResult'
import ClipsPlayer from './components/video/ClipsPlayer'



function App() {
  const user = useSelector(selectUsers);
  const [isLoading, setIsLoading ] = useState(true)
  const params = useParams()
  setInterval(()=>{
    setIsLoading(false)
  },2000)

  if(isLoading){
    return(
      <Loading />
    )
  }
  return (
    <>
    <UserState>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<><Header/> <Sidebar/></>}>
            <Route index element={<Home />} />
            <Route path='/result' element={<SearchResult/>} />
            <Route path='videos' element={<Videos/>} />
            <Route path='videos/play/:id' element={<VideoPlayer />} />
            <Route path='/play/clips/:id' element={<ClipsPlayer/>} />
            <Route path='movies/explore/:id' element={<MovieView/>} />
            <Route path='/api/songs/callback' element={<Songs/>} />
            <Route path='/trending' element={<TrendingVideos/>} />
            <Route path='/recomended' element={<Videos/>} />
            <Route path='/profile/:userid' element={<Profile/>} >
              <Route index element={ <ProfileHome/> } />
              <Route path='home/:userid' element={ <ProfileHome/> } />
              <Route path='your/videos/:userid' element={ <ProfileVideos/> } />
              <Route path='subscriptions/:userid' element={ <ProfileSubscriptions/> } />
              <Route path='saved/videos/:userid' element={ <ProfileSavedVideos/> } />
              <Route path='liked/videos/:userid' element={ <ProfileLikedVideos/> } />
            </Route>
            <Route path='/others/profile/:userid' element={<OtherUser/>} >
            <Route index element={ <ProfileHome/> } />
              <Route path='home/:userid' element={ <ProfileHome/> } />
              <Route path='your/videos/:userid' element={ <ProfileVideos/> } />
              <Route path='subscriptions/:userid' element={ <ProfileSubscriptions/> } />
            </Route>
            <Route path='/upload/videos' element={<UploadVideo/>} />
            <Route path='suggest/movie' element={<SuggestMovie/>} />
          </Route>
          <Route path='/login' element={<Login/>} />
          <Route path='/signup' element={<SignUp/>} />
        </Routes>
      </BrowserRouter>
    </UserState>
    </>
  )
}

export default App
