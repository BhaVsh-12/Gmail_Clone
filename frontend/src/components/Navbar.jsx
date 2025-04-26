import React, { useEffect, useState } from 'react'
import { RxHamburgerMenu } from "react-icons/rx";
import { IoIosSearch } from "react-icons/io";
import { CiCircleQuestion } from "react-icons/ci";
import { IoIosSettings } from "react-icons/io";
import { TbGridDots } from "react-icons/tb";
import Avatar from 'react-avatar';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser, setOpenSidebar, setSearchText } from '../redux/appSlice';
import axios from 'axios';
import toast from "react-hot-toast"
import { useNavigate } from 'react-router-dom';
import Api from '../Api';
const Navbar = () => {
    const [text, setText] = useState("");
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState(false);
    const { user } = useSelector(store => store.app);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const SidebarHandle = () => {
        setOpen(!open);
        dispatch(setOpenSidebar(open));
    }
    const handlesearch = () => {
        setSearch(!search);
    }
    const logoutHandler = async () => {
        try {
            const res = await Api.get('/api/v1/user/logout', { withCredentials: true });
            console.log(res);
            toast.success(res.data.message);
            dispatch(setAuthUser(null));
            navigate("/login");
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        dispatch(setSearchText(text));
    }, [text]);


    return (
        
        <div className='flex items-center justify-between  h-16 z-30 relative bg-[#F8FAFD]'>
            <div className='flex items-center gap-10'>
                <div className='flex items-center gap-2'>
                    <button className='p-3 hover:bg-gray-200 rounded-full cursor-pointer' onClick={SidebarHandle}>
                        <RxHamburgerMenu />
                    </button>
                    <img className={`w-8 ${search ? "hidden" : "block"}`} src="https://mailmeteor.com/logos/assets/PNG/Gmail_Logo_512px.png" alt="logo" />
                    <h1 className={`text-2xl text-gray-500 font-medium  ${search?"hidden ":" block"}`}>Gmail</h1>
                </div>
            </div>
            {
                user && (
                    <>
                        <div className='w-[50%]  hidden md:block '>
                            <div className='flex items-center bg-[#EAF1FB] px-2 py-3 rounded-full'>
                                <IoIosSearch size={'24px'} className='text-gray-700' />
                                <input
                                    type="text"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder='Search Mail'
                                    className='rounded-full w-full bg-transparent outline-none px-1'
                                />
                            </div>
                        </div>

                        <div className={`flex items-center gap-2 `}>
                            <div className={`w-[90%] mr-2 ${search?"block":"hidden"}`}>
                                <div className='flex items-center bg-[#EAF1FB] px-2 py-2 rounded-full'>
                                    <IoIosSearch size={'24px'} className='text-gray-700' onClick={handlesearch} />
                                    <input
                                        type="text"
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        placeholder='Search Mail'
                                        className='rounded-full w-full bg-transparent outline-none px-1'
                                    />
                                </div>
                            </div>
                            <button className={` hover:bg-gray-300 p-2 hover:rounded-full ${search?"hidden ":"md:hidden block"}`} onClick={handlesearch}>
                                <IoIosSearch size={'24px'} className='text-gray-700' />
                            </button>
                            <div className='p-2 rounded-full hover:bg-gray-200 cursor-pointer hidden md:block'>
                                <CiCircleQuestion size={'24px'} />
                            </div>
                            <div className='p-2 rounded-full hover:bg-gray-200 cursor-pointer hidden md:block'>
                                <IoIosSettings size={'24px'} />
                            </div>
                            <div className='p-2 rounded-full hover:bg-gray-200 cursor-pointer hidden md:block'>
                                <TbGridDots size={'24px'} />
                            </div>
                            <span onClick={logoutHandler} className='underline cursor-pointer '>Logout</span>
                            <Avatar src={user.profilePhoto} size="40" round={true} />
                        </div>
                    </>
                )
            }

        </div>
    )
}

export default Navbar