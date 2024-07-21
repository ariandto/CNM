import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwtDecode from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import { apiurl } from './api/config';

const ListUser = () => {
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [users, setUsers] = useState([]);
    const [expire, setExpire] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            setName(decoded.name);
            setRole(decoded.role); // If role is encoded in the token
            setExpire(decoded.exp);
            getUsers(token);
        } else {
            navigate('/');
        }
    }, []);

    const axiosJWT = axios.create();

    axiosJWT.interceptors.request.use(async (config) => {
        const currentDate = new Date();
        if (expire * 1000 < currentDate.getTime()) {
            try {
                const response = await axios.get(`${apiurl}/token`);
                config.headers.Authorization = `Bearer ${response.data.accessToken}`;
                localStorage.setItem('token', response.data.accessToken);
                const decoded = jwtDecode(response.data.accessToken);
                setName(decoded.name);
                setExpire(decoded.exp);
            } catch (error) {
                navigate('/');
            }
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    const getUsers = async (token) => {
        try {
            const response = await axiosJWT.get(`${apiurl}/users`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Users:', response.data); // Log the response data
            setUsers(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container mt-5">
            <h1>Welcome Back: {name}</h1>
            <table className="table is-striped is-fullwidth">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user.id}>
                            <td>{index + 1}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListUser;
