import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const apiurl = 'http://localhost:5000';

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
            console.log('Response:', response.data);
            navigate("/home");
        } catch (error) {
            if (error.response) {
                console.error('Error response:', error.response);
                setMsg(error.response.data.msg);
            } else {
                console.error('Error message:', error.message);
                setMsg('An unexpected error occurred. Please try again.');
            }
        }
    }

    return (
        <section className="hero has-background-grey-light is-fullheight is-fullwidth">
            <div className="hero-body">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-4-desktop is-6-tablet is-10-mobile">
                            <div className="box has-text-centered">
                                <img src="cnm.png" alt="logo" width="100" height="100" className="mb-5" />
                                <p className="has-text-centered has-text-danger">{msg}</p>
                                <form onSubmit={Auth}>
                                    <div className="field mt-3">
                                        <label className="label">Email or Username</label>
                                        <div className="control">
                                            <input type="text" className="input" placeholder="Username" value={email} onChange={(e) => setEmail(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="field mt-3">
                                        <label className="label">Password</label>
                                        <div className="control">
                                            <input type="password" className="input" placeholder="******" value={password} onChange={(e) => setPassword(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="field mt-5">
                                        <button className="button is-link is-fullwidth">Login</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Login;
