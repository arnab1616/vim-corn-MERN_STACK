import { createSlice } from '@reduxjs/toolkit';

export const videoSlice = createSlice({
    name:'video',
    initialState: {
        currVideo : null
    },
    reducers: {
        setVideoPlayer : (video, action)=>{
            video.currVideo = action.payload;
        }
    }
})

export const {setUser} = videoSlice.actions;
export const selectVideo = state => state.video;
export default videoSlice.reducer;