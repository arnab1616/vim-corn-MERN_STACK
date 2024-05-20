import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name:'users',
    initialState: {
        currUser : null
    },
    reducers: {
        setUser : (users, action)=>{
            users.currUser = action.payload;
        }
    }
})

export const {setUser} = userSlice.actions;
export const selectUsers = state => state.users;
export default userSlice.reducer;