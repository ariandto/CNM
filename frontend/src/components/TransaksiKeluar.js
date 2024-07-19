import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import jwtDecode from "jwt-decode";
import { useNavigate } from 'react-router-dom';

const apiurl = 'http://localhost:5000'; 

const TransaksiKeluar = () => {
    const [name, setName] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [transaksi, setTransaksi] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // State for storing errors
    const navigate = useNavigate();

    // Refresh token
    const refreshToken = useCallback(async () => {
        try {
            const response = await axios.get(`${apiurl}/token`);
            setToken(response.data.accessToken);
            const decoded = jwtDecode(response.data.accessToken);
            setName(decoded.name);
            setExpire(decoded.exp);
            setLoading(false); // Set loading to false once token is refreshed
        } catch (error) {
            console.error('Error refreshing token:', error);
            navigate("/"); // Redirect if token refresh fails
        }
    }, [navigate]);

    // Fetch transactions
    const getTransaksi = useCallback(async () => {
        try {
            const response = await axios.get(`${apiurl}/transaksi-keluar`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTransaksi(response.data);
            console.log('Transaksi Data:', response.data); // Debugging log
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setError('Failed to fetch transactions.');
        } finally {
            setLoading(false); // Ensure loading is false once the request completes
        }
    }, [token]);

    useEffect(() => {
        refreshToken();
    }, [refreshToken]);

    useEffect(() => {
        if (token) {
            getTransaksi();
        }
    }, [token, getTransaksi]);

    // Axios instance with interceptors
    const axiosJWT = axios.create();

    axiosJWT.interceptors.request.use(async (config) => {
        const currentDate = new Date();
        if (expire * 1000 < currentDate.getTime()) {
            try {
                const response = await axios.get(`${apiurl}/token`);
                config.headers.Authorization = `Bearer ${response.data.accessToken}`;
                setToken(response.data.accessToken);
                const decoded = jwtDecode(response.data.accessToken);
                setName(decoded.name);
                setExpire(decoded.exp);
            } catch (error) {
                console.error('Error refreshing token in interceptor:', error);
                navigate("/"); // Redirect if token refresh fails
            }
        } else {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    return (
        <div className="container mt-5">
            <h1>Welcome Back: {name}</h1>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p> // Display error message if there is an error
            ) : (
                <table className="table is-striped is-fullwidth is-hoverable">
                    <thead>
                        <tr>
                            <th>ID Transaksi</th>
                            <th>Tanggal Pickup</th>
                            <th>Nopol</th>
                            <th>Driver</th>
                            <th>Sumber Barang</th>
                            <th>Nama Barang</th>
                            <th>UOM</th>
                            <th>Qty</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transaksi.length > 0 ? (
                            transaksi.map((item) => (
                                <tr key={item.idtransaksikeluar}>
                                    <td>{item.idtransaksikeluar}</td>
                                    <td>{new Date(item.tanggal_pickup).toLocaleDateString()}</td>
                                    <td>{item.nopol}</td>
                                    <td>{item.driver}</td>
                                    <td>{item.sumber_barang}</td>
                                    <td>{item.nama_barang}</td>
                                    <td>{item.uom}</td>
                                    <td>{item.qty}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8">No transactions found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default TransaksiKeluar;
