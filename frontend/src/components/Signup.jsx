import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import toast from 'react-hot-toast';
import Api from "../Api";
const Signup = () => {
    const [input, setInput] = useState({
        fullname: "",
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};
        
        if (!input.fullname.trim()) {
            newErrors.fullname = 'Full name is required';
        }
        
        if (!input.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        
        if (!input.password) {
            newErrors.password = 'Password is required';
        } else if (input.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const changeHandler = (e) => {
        const { name, value } = e.target;
        setInput({...input, [name]: value});
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({...errors, [name]: ''});
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        
        try {
            const res = await Api.post(
                "/api/v1/user/register", 
                input, 
                {
                }
            );
            
            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-50 p-4'>
            <form 
                onSubmit={submitHandler} 
                className='flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md w-full max-w-md'
                noValidate
            >
                <h1 className='font-bold text-2xl text-center text-gray-800 mb-2'>Create Account</h1>
                
                <div className='space-y-2'>
                    <label htmlFor="fullname" className='block text-sm font-medium text-gray-700'>
                        Full Name
                    </label>
                    <input
                        id="fullname"
                        onChange={changeHandler}
                        value={input.fullname}
                        name='fullname'
                        type='text'
                        placeholder='Enter your full name'
                        className={`w-full border ${errors.fullname ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        required
                    />
                    {errors.fullname && (
                        <p className="text-red-500 text-xs mt-1">{errors.fullname}</p>
                    )}
                </div>
                
                <div className='space-y-2'>
                    <label htmlFor="email" className='block text-sm font-medium text-gray-700'>
                        Email
                    </label>
                    <input
                        id="email"
                        onChange={changeHandler}
                        value={input.email}
                        name='email'
                        type='email'
                        placeholder='Enter your email'
                        className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        required
                    />
                    {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                </div>
                
                <div className='space-y-2'>
                    <label htmlFor="password" className='block text-sm font-medium text-gray-700'>
                        Password
                    </label>
                    <input
                        id="password"
                        onChange={changeHandler}
                        value={input.password}
                        name='password'
                        type='password'
                        placeholder='Enter your password'
                        className={`w-full border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        required
                        minLength="6"
                    />
                    {errors.password && (
                        <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>
                </div>
                
                <button
                    type="submit"
                    disabled={loading}
                    className={`mt-4 w-full py-2 px-4 rounded-md text-white font-medium ${
                        loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    } transition-colors`}
                >
                    {loading ? (
                        <span className='flex items-center justify-center'>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating account...
                        </span>
                    ) : 'Sign Up'}
                </button>
                
                <div className='text-center mt-4 text-sm text-gray-600'>
                    <p>Already have an account?{' '}
                        <Link 
                            to="/login" 
                            className='text-blue-600 hover:text-blue-800 hover:underline'
                        >
                            Log in
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default Signup;