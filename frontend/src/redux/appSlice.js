import { createSlice } from "@reduxjs/toolkit"
import Sidebar from "../components/Sidebar";

const appSlice = createSlice({
    name: "app",
    initialState: {
        sidebaropen:false,
        open: false,
        user: null,
        emails: [],
        selectedEmail: null,
        searchText:"",
    },
    reducers: {
        // actions
        setOpen: (state, action) => {
            state.open = action.payload;
        },
        setAuthUser: (state, action) => {
            state.user = action.payload;
        },
        setEmails: (state, action) => {
            state.emails = action.payload;
        },
        setSelectedEmail: (state, action) => {
            state.selectedEmail = action.payload;
        },
        setSearchText:(state,action) => {
            state.searchText = action.payload;
        },
        setOpenSidebar:(state,action)=>{
            state.sidebaropen=action.payload;
        },
        
    }
});
export const { setOpen, setAuthUser, setEmails, setSelectedEmail, setSearchText,setOpenSidebar,setDeleteEmail } = appSlice.actions;
export default appSlice.reducer;