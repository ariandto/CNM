import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { apiurl } from './api/config';

const TransaksiKeluar = () => {
    const [name, setName] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [transaksi, setTransaksi] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchDate, setSearchDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const itemsPerPage = 10;
    const navigate = useNavigate();

    const refreshToken = useCallback(async () => {
        try {
            const response = await axios.get(`${apiurl}/token`);
            setToken(response.data.accessToken);
            const decoded = jwtDecode(response.data.accessToken);
            setName(decoded.name);
            setExpire(decoded.exp);
            setLoading(false);
        } catch (error) {
            console.error('Error refreshing token:', error);
            navigate("/");
        }
    }, [navigate]);

    const getTransaksi = useCallback(async () => {
        try {
            const response = await axios.get(`${apiurl}/transaksi-keluar`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTransaksi(response.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setError('Failed to fetch transactions.');
        } finally {
            setLoading(false);
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
                navigate("/");
            }
        } else {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    const filteredTransaksi = transaksi.filter(item => {
        const itemDate = new Date(item.tanggal_pickup).toLocaleDateString();
        const formattedSearchDate = new Date(searchDate).toLocaleDateString();
        return item.nama_barang.toLowerCase().includes(searchTerm.toLowerCase()) && 
               (!searchDate || itemDate === formattedSearchDate);
    });

    const sortedTransaksi = [...filteredTransaksi].sort((a, b) => {
        if (sortConfig.key) {
            const isAscending = sortConfig.direction === 'asc';
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return isAscending ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return isAscending ? 1 : -1;
            }
            return 0;
        }
        return 0;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedTransaksi.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />;
        }
        return <FaSort />;
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Welcome Back: {name}</h1>
            <div className="flex mb-4">
                <input 
                    className="border p-2 mr-2 flex-grow" 
                    type="text" 
                    placeholder="Search by Nama Barang" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} 
                />
                <input
                    className="border p-2"
                    type="date"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                />
            </div>
            {loading ? (
                <p className="text-center">Loading...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : (
                <>
                    <table className="min-w-full bg-white border">
                        <thead>
                            <tr>
                                <th className="py-2 border-b" onClick={() => requestSort('idtransaksikeluar')}>
                                    ID Transaksi {getSortIcon('idtransaksikeluar')}
                                </th>
                                <th className="py-2 border-b" onClick={() => requestSort('tanggal_pickup')}>
                                    Tanggal Pickup {getSortIcon('tanggal_pickup')}
                                </th>
                                <th className="py-2 border-b" onClick={() => requestSort('nopol')}>
                                    Nopol {getSortIcon('nopol')}
                                </th>
                                <th className="py-2 border-b" onClick={() => requestSort('driver')}>
                                    Driver {getSortIcon('driver')}
                                </th>
                                <th className="py-2 border-b" onClick={() => requestSort('sumber_barang')}>
                                    Sumber Barang {getSortIcon('sumber_barang')}
                                </th>
                                <th className="py-2 border-b" onClick={() => requestSort('nama_barang')}>
                                    Nama Barang {getSortIcon('nama_barang')}
                                </th>
                                <th className="py-2 border-b" onClick={() => requestSort('uom')}>
                                    UOM {getSortIcon('uom')}
                                </th>
                                <th className="py-2 border-b" onClick={() => requestSort('qty')}>
                                    Qty {getSortIcon('qty')}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length > 0 ? (
                                currentItems.map((item) => (
                                    <tr key={item.idtransaksikeluar}>
                                        <td className="py-2 border-b text-center">{item.idtransaksikeluar}</td>
                                        <td className="py-2 border-b text-center">{new Date(item.tanggal_pickup).toLocaleDateString()}</td>
                                        <td className="py-2 border-b text-center">{item.nopol}</td>
                                        <td className="py-2 border-b text-center">{item.driver}</td>
                                        <td className="py-2 border-b text-center">{item.sumber_barang}</td>
                                        <td className="py-2 border-b text-center">{item.nama_barang}</td>
                                        <td className="py-2 border-b text-center">{item.uom}</td>
                                        <td className="py-2 border-b text-center">{item.qty}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="py-2 text-center">No transactions found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className="flex justify-between items-center mt-4">
                        <button 
                            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                            onClick={() => paginate(currentPage - 1)} 
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span className="text-gray-700">
                            Page {currentPage} of {Math.ceil(filteredTransaksi.length / itemsPerPage)}
                        </span>
                        <button 
                            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                            onClick={() => paginate(currentPage + 1)} 
                            disabled={currentPage === Math.ceil(filteredTransaksi.length / itemsPerPage)}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default TransaksiKeluar;
