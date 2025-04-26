import axios from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setAuthUser } from '../redux/appSlice';
import Api from "../Api";
const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false); // Add loading state
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeHandler = (e) => {
        setInput({...input, [e.target.name]: e.target.value});
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true when submitting
        
        // Basic validation
        if (!input.email || !input.password) {
            toast.error('Please fill in all fields');
            setLoading(false);
            return;
        }

        try {
            const res = await Api.post("/api/v1/user/login", input, {
                withCredentials: true
            });

            if (res.data.success) {
                dispatch(setAuthUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false); // Reset loading state
        }
    }

    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-50 p-4'>
            <form 
                onSubmit={submitHandler} 
                className='flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md w-full max-w-md'
            >
                <h1 className='font-bold text-2xl text-center text-gray-800 mb-2'>Login</h1>
                
                <div className='space-y-2'>
                    <label htmlFor="email" className='block text-sm font-medium text-gray-700'>
                        Email
                    </label>
                    <input
                        id="email"
                        onChange={changeHandler}
                        value={input.email}
                        name="email"
                        type='email'
                        placeholder='Enter your email'
                        className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        required
                    />
                </div>
                
                <div className='space-y-2'>
                    <label htmlFor="password" className='block text-sm font-medium text-gray-700'>
                        Password
                    </label>
                    <input
                        id="password"
                        onChange={changeHandler}
                        value={input.password}
                        name="password"
                        type='password'
                        placeholder='Enter your password'
                        className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        required
                        minLength="6"
                    />
                </div>
                
                <button
                    type="submit"
                    disabled={loading}
                    className={`mt-2 w-full py-2 px-4 rounded-md text-white font-medium ${
                        loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    } transition-colors`}
                >
                    {loading ? (
                        <span className='flex items-center justify-center'>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </span>
                    ) : 'Login'}
                </button>
                
                <div className='text-center mt-4 text-sm text-gray-600'>
                    <p>Don't have an account?{' '}
                        <Link 
                            to="/signup" 
                            className='text-blue-600 hover:text-blue-800 hover:underline'
                        >
                            Sign up
                        </Link>
                    </p>
                    <p className='mt-2'>
                        <Link 
                            to="/forgot-password" 
                            className='text-blue-600 hover:text-blue-800 hover:underline'
                        >
                            Forgot password?
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    )
}

export default Login;