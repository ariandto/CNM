import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { apiurl } from './api/config';

function EditDeleteTransaksiKeluar() {
  const [formData, setFormData] = useState({
    idtransaksikeluar: '',
    nopol: '',
    driver: '',
    sumber_barang: '',
    nama_barang: '',
    uom: '',
    qty: ''
  });
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Function to fetch transaction details based on ID
  const fetchTransaction = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiurl}/transaksi-keluar/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData(response.data);
      setIsEditing(true);
    } catch (error) {
      console.error('Error fetching transaction details:', error.response ? error.response.data : error.message);
      setError('Failed to fetch transaction details: ' + (error.response ? error.response.data.message : error.message));
    } finally {
      setLoading(false);
    }
  };

  // Function to handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
  };

  // Function to handle update request
  const handleUpdate = async (e) => {
    e.preventDefault();
    const { idtransaksikeluar, ...dataToUpdate } = formData; // Exclude idtransaksi from update
    try {
      setLoading(true);
      const response = await axios.put(`${apiurl}/transaksi-keluar/${idtransaksikeluar}`, dataToUpdate, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const message = response.data.message || 'Transaction updated successfully!';
      alert(message);
      setIsEditing(false);
      setTransactionId('');
      setFormData({
        idtransaksikeluar: '',
        nopol: '',
        driver: '',
        sumber_barang: '',
        nama_barang: '',
        uom: '',
        qty: ''
      });
    } catch (error) {
      console.error('Error updating transaction:', error.response ? error.response.data : error.message);
      alert('Failed to update transaction: ' + (error.response ? error.response.data.message : error.message));
    } finally {
      setLoading(false);
    }
  };

  // Function to handle delete request
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        setLoading(true);
        const response = await axios.delete(`${apiurl}/transaksi/${formData.idtransaksikeluar}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const message = response.data.message || 'Transaction deleted successfully!';
        alert(message);
        setFormData({
          idtransaksikeluar: '',
          nopol: '',
          driver: '',
          sumber_barang: '',
          nama_barang: '',
          uom: '',
          qty: ''
        });
        setIsEditing(false);
        setTransactionId('');
      } catch (error) {
        console.error('Error deleting transaction:', error.response ? error.response.data : error.message);
        alert('Failed to delete transaction: ' + (error.response ? error.response.data.message : error.message));
      } finally {
        setLoading(false);
      }
    }
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      handleUpdate(e);
    } else {
      alert('No transaction selected for editing.');
    }
  };

  // Function to refresh token
  const refreshToken = useCallback(async () => {
    try {
      const response = await axios.get(`${apiurl}/token`);
      setToken(response.data.accessToken);
      const decoded = jwtDecode(response.data.accessToken);
      setExpire(decoded.exp);
    } catch (error) {
      console.error('Error refreshing token:', error);
      navigate("/"); // Redirect if token refresh fails
    }
  }, [navigate]);

  // Axios JWT interceptor for handling token refresh
  const axiosJWT = axios.create();
  axiosJWT.interceptors.request.use(async (config) => {
    const currentDate = new Date();
    if (expire * 1000 < currentDate.getTime()) {
      try {
        const response = await axios.get(`${apiurl}/token`);
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        setToken(response.data.accessToken);
        const decoded = jwtDecode(response.data.accessToken);
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

  useEffect(() => {
    refreshToken(); // Refresh token on component mount
  }, [refreshToken]);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Edit or Delete Transaksi Barang Keluar</h1>
      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Transaction ID</label>
          <div className="flex space-x-2 mt-1">
            <input
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="Enter transaction ID"
              required
            />
            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={() => fetchTransaction(transactionId)}
            >
              Search
            </button>
          </div>
        </div>

        {isEditing && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nopol</label>
              <input
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                type="text"
                name="nopol"
                value={formData.nopol}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Driver</label>
              <input
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                type="text"
                name="driver"
                value={formData.driver}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Supplier</label>
              <input
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                type="text"
                name="sumber_barang"
                value={formData.sumber_barang}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Nama Barang</label>
              <input
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                type="text"
                name="nama_barang"
                value={formData.nama_barang}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">UOM</label>
              <input
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                type="text"
                name="uom"
                value={formData.uom}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Qty</label>
              <input
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                type="number"
                name="qty"
                value={formData.qty}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex space-x-2 mt-4">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600" type="submit">Update</button>
              <button
                type="button"
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}

export default EditDeleteTransaksiKeluar;
