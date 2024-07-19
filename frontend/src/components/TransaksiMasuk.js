import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import jwtDecode from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa'; // Import sort icons
import './TransaksiMasuk.css';

const apiurl = 'http://localhost:5000';

const TransaksiMasuk = () => {
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
            const response = await axios.get(`${apiurl}/transaksi`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTransaksi(response.data);
            console.log('Transaksi Data:', response.data);
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
        <div className="container">
            <h1 className="welcome-message">Welcome Back: {name}</h1>
            <div className="search-bar-container">
                <div className="search-field">
                    <input 
                        className="search-input" 
                        type="text" 
                        placeholder="Search by Nama Barang" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} 
                    />
                    <input
                        className="date-input"
                        type="date"
                        value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)}
                    />
                    <button className="search-button">
                        <FiSearch />
                    </button>
                </div>
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <>
                    <table className="table">
                        <thead>
                            <tr>
                                <th 
                                    className="sortable" 
                                    onClick={() => requestSort('idtransaksi')}
                                >
                                    ID Transaksi {getSortIcon('idtransaksi')}
                                </th>
                                <th 
                                    className="sortable" 
                                    onClick={() => requestSort('tanggal_pickup')}
                                >
                                    Tanggal Pickup {getSortIcon('tanggal_pickup')}
                                </th>
                                <th 
                                    className="sortable" 
                                    onClick={() => requestSort('nopol')}
                                >
                                    Nopol {getSortIcon('nopol')}
                                </th>
                                <th 
                                    className="sortable" 
                                    onClick={() => requestSort('driver')}
                                >
                                    Driver {getSortIcon('driver')}
                                </th>
                                <th 
                                    className="sortable" 
                                    onClick={() => requestSort('sumber_barang')}
                                >
                                    Sumber Barang {getSortIcon('sumber_barang')}
                                </th>
                                <th 
                                    className="sortable" 
                                    onClick={() => requestSort('nama_barang')}
                                >
                                    Nama Barang {getSortIcon('nama_barang')}
                                </th>
                                <th 
                                    className="sortable" 
                                    onClick={() => requestSort('uom')}
                                >
                                    UOM {getSortIcon('uom')}
                                </th>
                                <th 
                                    className="sortable" 
                                    onClick={() => requestSort('qty')}
                                >
                                    Qty {getSortIcon('qty')}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length > 0 ? (
                                currentItems.map((item) => (
                                    <tr key={item.idtransaksi}>
                                        <td>{item.idtransaksi}</td>
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
                    <div className="pagination">
                        <div className="pagination-info">
                            Page {currentPage} of {Math.ceil(filteredTransaksi.length / itemsPerPage)}
                        </div>
                        {Array.from({ length: Math.ceil(filteredTransaksi.length / itemsPerPage) }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => paginate(i + 1)}
                                disabled={currentPage === i + 1}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default TransaksiMasuk;
