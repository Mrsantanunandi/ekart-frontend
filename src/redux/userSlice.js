import { createSlice } from "@reduxjs/toolkit"

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,     // logged-in user
        allUsers: [],   // for admin
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        setAllUsers: (state, action) => {
            state.allUsers = action.payload
        },
        logout: (state) => {
            state.user = null;
            state.allUsers = [];
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        },
    }
})

export const { setUser, setAllUsers, logout } = userSlice.actions
export default userSlice.reducer
