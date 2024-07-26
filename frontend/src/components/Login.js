import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { apiurl } from './api/config';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();

    const Auth = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${apiurl}/login`, {
                email: email,
                password: password
            });

            const accessToken = response.data.accessToken;

            // Decode token to get the user's role (if needed for other purposes)
            jwtDecode(accessToken);

            // Redirect to home page after successful login
            navigate("/home");
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            } else {
                setMsg('An unexpected error occurred. Please try again.');
            }
        }
    }

    return (
        <section className="bg-gray-200 min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md p-6">
                <div className="bg-white shadow-md rounded-lg p-8">
                    <div className="text-center mb-6">
                        <img src="cnm.png" alt="logo" className="w-24 h-24 mx-auto mb-4" />
                        <p className="text-red-500">{msg}</p>
                    </div>
                    <form onSubmit={Auth}>
                        <div className="mb-4">
                            <label className="block text-gray-700">Email or Username</label>
                            <input
                                type="text"
                                className="w-full p-3 border rounded-lg mt-2"
                                placeholder="Username"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Password</label>
                            <input
                                type="password"
                                className="w-full p-3 border rounded-lg mt-2"
                                placeholder="******"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="mt-6">
                            <button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-200">Login</button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default Login;
