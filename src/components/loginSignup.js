import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, ref, set } from '../firebase';

const LoginSignupPage = ({ onLogin, onSignup }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const validateForm = () => {
        if (!email || !password) {
            setError('Please fill out all fields.');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Invalid email address.');
            return false;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return false;
        }
        return true;
    };

    const handleSignup = async () => {
        if (!validateForm()) return;

        setLoading(true);
        setError('');

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await set(ref(db, 'users/' + user.uid), {
                email: user.email,
                uid: user.uid
            });

            onSignup(user);
            navigate('/search');
        } catch (error) {
            setError(error.message);
        }

        setLoading(false);
    };

    const handleLogin = async () => {
        if (!validateForm()) return;

        setLoading(true);
        setError('');

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            onLogin(user);
            navigate('/search');
        } catch (error) {
            setError('Invalid credentials. Please try again.');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-offwhite pt-20 flex items-center justify-center px-4">
            <div className="bg-white border border-gray-300 p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Login / Signup</h2>

                {error && <div className="mb-4 text-sm text-red-600 bg-red-100 px-4 py-2 rounded">{error}</div>}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
                />

                <div className="flex justify-between">
                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className={`w-[48%] py-2 bg-blue-600 text-white font-semibold rounded-lg 
                            hover:bg-blue-700 transition-all duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                    <button
                        onClick={handleSignup}
                        disabled={loading}
                        className={`w-[48%] py-2 bg-green-600 text-white font-semibold rounded-lg 
                            hover:bg-green-700 transition-all duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Signing up...' : 'Sign Up'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginSignupPage;
