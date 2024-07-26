import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { apiurl } from './api/config';
import { FaBoxOpen, FaBox, FaDollarSign, FaCalendarAlt } from 'react-icons/fa';
import { Doughnut} from 'react-chartjs-2';


const Home = () => {
  const [token, setToken] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [expire, setExpire] = useState('');
  const [transaksiMasuk, setTransaksiMasuk] = useState([]);
  const [transaksiKeluar, setTransaksiKeluar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const refreshToken = useCallback(async () => {
    try {
      const response = await axios.get(`${apiurl}/token`);
      const newToken = response.data.accessToken;
      setToken(newToken);
      const decoded = jwtDecode(newToken);
      setName(decoded.name);
      setRole(decoded.role);
      setExpire(decoded.exp);
    } catch (error) {
      console.error('Error refreshing token:', error);
      navigate('/');
    }
  }, [navigate]);

  const fetchData = useCallback(async () => {
    try {
      const responseMasuk = await axios.get(`${apiurl}/transaksi`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const responseKeluar = await axios.get(`${apiurl}/transaksi-keluar`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const dataMasuk = responseMasuk.data;
      const dataKeluar = responseKeluar.data;

      setTransaksiMasuk(dataMasuk);
      setTransaksiKeluar(dataKeluar);

      



    
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const fetchDataAndRefreshToken = async () => {
      try {
        await refreshToken();
        if (token) {
          await fetchData();
        }
      } catch (error) {
        console.error('Error during fetch:', error);
        setError('Error during data fetch.');
      }
    };

    fetchDataAndRefreshToken();
  }, [fetchData, refreshToken, token]);

  useEffect(() => {
    const currentDate = new Date();
    if (expire * 1000 < currentDate.getTime()) {
      refreshToken();
    }
  }, [expire, refreshToken]);

  const totalQtyMasuk = transaksiMasuk.reduce((acc, item) => acc + item.qty, 0);
  const totalQtyKeluar = transaksiKeluar.reduce((acc, item) => acc + item.qty, 0);
  
  const doughnutData = {
    labels: ['Incoming Transactions', 'Outgoing Transactions'],
    datasets: [
      {
        data: [totalQtyMasuk, totalQtyKeluar],
        backgroundColor: ['#3b82f6', '#f97316'],
        hoverOffset: 4
      }
    ]
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Welcome Back: {name}, {role}</h1>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 hover:shadow-xl transition-transform duration-300 ease-in-out relative flex flex-col items-center">
              <FaBoxOpen className="text-5xl mb-4" />
              <h2 className="text-lg font-semibold">Supplier of Incoming</h2>
              <p className="text-4xl font-bold mt-2">{new Set(transaksiMasuk.map(item => item.sumber_barang)).size}</p>
              <p className="mt-2">Total Qty: {totalQtyMasuk}</p>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-orange-700 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 hover:shadow-xl transition-transform duration-300 ease-in-out relative flex flex-col items-center">
              <FaBox className="text-5xl mb-4" />
              <h2 className="text-lg font-semibold">Supplier of Outcoming</h2>
              <p className="text-4xl font-bold mt-2">{new Set(transaksiKeluar.map(item => item.sumber_barang)).size}</p>
              <p className="mt-2">Total Qty: {totalQtyKeluar}</p>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 hover:shadow-xl transition-transform duration-300 ease-in-out relative flex flex-col items-center">
              <FaDollarSign className="text-5xl mb-4" />
              <h2 className="text-lg font-semibold">Transaksi Masuk</h2>
              <p className="text-4xl font-bold mt-2">{transaksiMasuk.length}</p>
              <p className="mt-2">Total Qty: {totalQtyMasuk}</p>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-red-700 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 hover:shadow-xl transition-transform duration-300 ease-in-out relative flex flex-col items-center">
              <FaCalendarAlt className="text-5xl mb-4" />
              <h2 className="text-lg font-semibold">Transaksi Keluar</h2>
              <p className="text-4xl font-bold mt-2">{transaksiKeluar.length}</p>
              <p className="mt-2">Total Qty: {totalQtyKeluar}</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Transaction Summary</h2>
            <div className="flex justify-center">
              <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
            </div>
          </div>

          
        </>
      )}
    </div>
  );
};

export default Home;
