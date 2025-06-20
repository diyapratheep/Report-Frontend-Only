import React, { useState } from 'react';
import Button from '../components/ui/Button';
import CustomInput from '../components/ui/CustomInput';
import Notification from '../components/Notification';
import StackIcon from '../assets/StackIcon';
import { cn } from '../utils/cn';

// Icons for the login page (Google icon is inlined for simplicity as it's small)
const GoogleIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        width="20px"
        height="20px"
        {...props}
    >
        <path
            fill="#FFC107"
            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,8,3.029l5.479-5.479C34.464,6.536,29.849,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
        />
        <path
            fill="#FF3D00"
            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,8,3.029l5.479-5.479C34.464,6.536,29.849,4,24,4C12.955,4,4,12.955,4,24c0,2.109,0.395,4.14,1.115,6.006l7.461-2.903C12.333,26.33,12,25.132,12,24C12,21.659,12.721,19.497,14.041,17.756L6.306,14.691z"
        />
        <path
            fill="#4CAF50"
            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.571,4.819C9.22,39.317,16.297,44,24,44z"
        />
        <path
            fill="#1976D2"
            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,8,3.029l5.479-5.479C34.464,6.536,29.849,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
        />
    </svg>
);


const LoginPage = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '' });

    const handleLogin = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setNotification({ message: '', type: '' });

        setTimeout(() => {
            setIsLoading(false);
            if (username === 'user' && password === 'pass') {
                setNotification({ message: 'Login successful!', type: 'success' });
                onLoginSuccess();
            } else {
                setNotification({ message: 'Invalid credentials. Try "user" and "pass".', type: 'error' });
            }
        }, 1500);
    };

    const handleGoogleSignIn = () => {
        setIsLoading(true);
        setNotification({ message: '', type: '' });
        setTimeout(() => {
            setIsLoading(false);
            setNotification({ message: 'Signed in with Google (mock)!', type: 'success' });
            onLoginSuccess();
        }, 1500);
    };

    return (
        <div className="flex flex-col md:flex-row h-screen w-screen font-inter bg-white">
            <div className="hidden md:flex md:w-[65%] h-full items-center justify-center bg-primaryBlue text-white p-8 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center opacity-50">
                    <StackIcon className="w-4/5 h-4/5 text-blue-300" />
                </div>
                <h2 className="relative z-10 text-5xl font-bold text-center leading-snug">
                    Manage Your <br /> Exceptional Reports
                </h2>
            </div>

            <div className="flex-1 flex items-center justify-center p-6 md:p-10 lg:p-12">
                <div className="w-full max-w-sm flex flex-col items-center justify-center h-full">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-8">
                        <span className="text-primaryBlue">Exceptional Report </span>
                        <span className="text-primaryGreen">Generator</span>
                    </h1>

                    <form onSubmit={handleLogin} className="space-y-6 w-full">
                        <div>
                            <label htmlFor="username" className="block text-base font-medium text-black mb-2">
                                Username
                            </label>
                            <CustomInput
                                id="username"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-base font-medium text-black mb-2">
                                Email
                            </label>
                            <CustomInput
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-base font-medium text-black mb-2">
                                Password
                            </label>
                            <CustomInput
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 bg-buttonGreen text-textMuted rounded-full hover:bg-buttonGreenHover font-medium text-lg shadow-md hover:shadow-lg"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing In...
                                </span>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>

                    <div className="flex items-center my-8 w-full">
                        <hr className="flex-grow border-t border-gray-300" />
                        <span className="mx-4 text-gray-500">OR</span>
                        <hr className="flex-grow border-t border-gray-300" />
                    </div>

                    <Button
                        onClick={handleGoogleSignIn}
                        className="w-full h-12 bg-white text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50 font-medium text-lg shadow-md hover:shadow-lg"
                        disabled={isLoading}
                    >
                        <GoogleIcon className="mr-2" />
                        Sign in with Google
                    </Button>
                </div>
            </div>
            <Notification
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification({ message: '', type: '' })}
            />
        </div>
    );
};

LoginPage.displayName = "LoginPage";

export default LoginPage;