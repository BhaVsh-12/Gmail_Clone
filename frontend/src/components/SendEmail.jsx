import React, { useState } from 'react'
import { RxCross2 } from 'react-icons/rx'
import { useDispatch, useSelector } from 'react-redux'
import { setEmails, setOpen } from '../redux/appSlice';
import toast from 'react-hot-toast';
import axios from 'axios';
import Api from '../Api';
const SendEmail = () => {
    const [formData, setFormData] = useState({
        to: "",
        subject: "",
        message: "",
        category: "primary" // Default category
    });
    const [isSending, setIsSending] = useState(false);
    const { open, emails } = useSelector(store => store.app);
    const dispatch = useDispatch();

    const changeHandler = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        setIsSending(true);
        try {
            const res = await Api.post(
                "/api/v1/email/create",
                formData,
                {
                    headers: { 'Content-Type': "application/json" },
                    withCredentials: true
                }
            );
            dispatch(setEmails([...emails, res.data.email]));
            toast.success("Email sent successfully!");
            setFormData({ to: "", subject: "", message: "", category: "primary" });
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to send email");
        } finally {
            setIsSending(false);
            dispatch(setOpen(false));
        }
    }

    const closeHandler = () => {
        if (formData.to || formData.subject || formData.message) {
            if (window.confirm("Discard this email?")) {
                dispatch(setOpen(false));
                setFormData({ to: "", subject: "", message: "", category: "primary" });
            }
        } else {
            dispatch(setOpen(false));
        }
    }

    return (
        <div className={`
            ${open ? 'fixed' : 'hidden'}
            bottom-0
            right-0
            w-full
            sm:w-[95%]
            md:w-[80%]
            lg:w-[70%]
            xl:w-[60%]
            2xl:w-[50%]
            max-w-2xl
            bg-white
            shadow-xl
            rounded-t-lg
            z-50
            mx-auto
            border
            border-gray-200
        `}>
            {/* Header */}
            <div className='flex items-center justify-between px-4 py-3 bg-[#F2F6FC] rounded-t-lg border-b'>
                <h1 className='text-sm md:text-base font-medium'>New Message</h1>
                <button
                    onClick={closeHandler}
                    className='p-1 md:p-2 rounded-full hover:bg-gray-200 cursor-pointer'
                    aria-label="Close compose window"
                >
                    <RxCross2 size={18} />
                </button>
            </div>

            {/* Form */}
            <form onSubmit={submitHandler} className='flex flex-col p-4 gap-3'>
                <input
                    onChange={changeHandler}
                    value={formData.to}
                    name="to"
                    type="email"
                    placeholder='To'
                    className='outline-none py-2 px-1 border-b border-gray-200 focus:border-blue-500 text-sm md:text-base'
                    required
                />
                <input
                    onChange={changeHandler}
                    value={formData.subject}
                    name="subject"
                    type="text"
                    placeholder='Subject'
                    className='outline-none py-2 px-1 border-b border-gray-200 focus:border-blue-500 text-sm md:text-base'
                />
                <textarea
                    onChange={changeHandler}
                    value={formData.message}
                    name="message"
                    placeholder='Compose email...'
                    className='outline-none py-2 px-1 min-h-[200px] text-sm md:text-base resize-y'
                />

                {/* Category Select */}
                <div>
                    <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-1">Category:</label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={changeHandler}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm md:text-base"
                    >
                        <option value="primary">Primary</option>
                        <option value="social">Social</option>
                        <option value="promotion">Promotion</option>
                    </select>
                </div>

                {/* Footer with send button */}
                <div className='flex justify-between items-center pt-2'>
                    <button
                        type='submit'
                        disabled={isSending || !formData.to}
                        className={`
                            bg-blue-600 hover:bg-blue-700
                            rounded-full px-4 py-2
                            text-white text-sm md:text-base
                            disabled:opacity-70 disabled:cursor-not-allowed
                            transition-colors duration-200
                        `}
                    >
                        {isSending ? 'Sending...' : 'Send'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default SendEmail