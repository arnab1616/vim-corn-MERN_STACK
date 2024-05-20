import { createSlice } from '@reduxjs/toolkit';

export const subscribeSlice = createSlice({
    name:'subscribe',
    initialState: {
        currUser : null
    },
    reducers: {
        setSubscribe : (users, action)=>{
            users.currUser = action.payload;
        }
    }
})

export const {setSubscribe} = subscribeSlice.actions;
export const selectSubscribe = state => state.subscribe;
export default subscribeSlice.reducer;