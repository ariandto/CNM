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
  const navigate = useNavigate();

  const fetchTransaction = async (id) => {
    try {
      const response = await axios.get(`${apiurl}/transaksi-keluar/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData(response.data);
      setIsEditing(true);
    } catch (error) {
      console.error('Error fetching transaction details:', error.response ? error.response.data : error.message);
      alert('Failed to fetch transaction details: ' + (error.response ? error.response.data.message : error.message));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${apiurl}/transaksi-keluar/${formData.idtransaksikeluar}`, formData, {
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
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        const response = await axios.delete(`${apiurl}/transaksi-keluar/${formData.idtransaksikeluar}`, {
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
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      handleUpdate(e);
    } else {
      alert('No transaction selected for editing.');
    }
  };

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-semibold mb-6 text-center">Edit/Delete Transaksi Keluar</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="transactionId">
              Transaction ID
            </label>
            <div className="flex space-x-2">
              <input
                id="transactionId"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Enter transaction ID"
                required
              />
              <button
                type="button"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => fetchTransaction(transactionId)}
              >
                Search
              </button>
            </div>
          </div>

          {isEditing && (
            <>
              {[
                { label: 'Nopol', name: 'nopol', type: 'text' },
                { label: 'Driver', name: 'driver', type: 'text' },
                { label: 'Sumber Barang', name: 'sumber_barang', type: 'text' },
                { label: 'Nama Barang', name: 'nama_barang', type: 'text' },
                { label: 'UOM', name: 'uom', type: 'text' },
                { label: 'Qty', name: 'qty', type: 'number' },
              ].map(({ label, name, type }) => (
                <div key={name} className="mb-4">
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor={name}>
                    {label}
                  </label>
                  <input
                    id={name}
                    name={name}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type={type}
                    value={formData[name]}
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}
              
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Update
                </button>
                <button
                  type="button"
                  className="px-6 py-2 bg-red-500 text-white font-semibold rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default EditDeleteTransaksiKeluar;
