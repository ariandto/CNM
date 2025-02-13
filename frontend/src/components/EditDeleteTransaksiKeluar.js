import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { apiurl } from './api/config';
import barangMasukIcon from './images/barangkeluar.png';

function EditDeleteTransaksiKeluar() {
  const [formData, setFormData] = useState({
    idtransaksivarchar: '',
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

  useEffect(() => {
    refreshToken(); // Initial token fetch

    const interval = setInterval(() => {
      refreshToken(); // Refresh token every 15 minutes (or adjust as needed)
    }, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, [refreshToken]);

  const fetchTransaction = useCallback(async (id) => {
    if (!id) {
      setError('Transaction ID is required.');
      return;
    }
    try {
      setLoading(true);
      console.log(`Fetching transaction with ID: ${id}`); // Debug log
      const response = await axios.get(`${apiurl}/transaksi-keluar/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      //console.log('API Response:', response.data); // Debug log
      if (response.data && response.data.idtransaksivarchar) {
        setFormData(response.data);
        setIsEditing(true);
        setError(null); // Clear previous errors
      } else {
        setError('Transaction not found.');
        setIsEditing(false);
        setFormData({
          idtransaksivarchar: '',
          nopol: '',
          driver: '',
          sumber_barang: '',
          nama_barang: '',
          uom: '',
          qty: ''
        });
      }
    } catch (error) {
      console.error('Error fetching transaction details:', error.response ? error.response.data : error.message);
      setError('Error fetching transaction details: ' + (error.response ? error.response.data.message : error.message));
      setIsEditing(false);
      setFormData({
        idtransaksivarchar: '',
        nopol: '',
        driver: '',
        sumber_barang: '',
        nama_barang: '',
        uom: '',
        qty: ''
      });
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { idtransaksivarchar, ...dataToUpdate } = formData;
    try {
      setLoading(true);
      console.log(`Updating transaction with ID: ${idtransaksivarchar}`, dataToUpdate); // Debug log
      const response = await axios.put(`${apiurl}/transaksi-keluar/${idtransaksivarchar}`, dataToUpdate, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Update Response:', response.data); // Log the response
      const message = response.data.message || 'Transaction updated successfully!';
      setError(null); // Clear previous errors
      alert(message);
      setIsEditing(false);
      setTransactionId('');
      setFormData({
        idtransaksivarchar: '',
        nopol: '',
        driver: '',
        sumber_barang: '',
        nama_barang: '',
        uom: '',
        qty: ''
      });
    } catch (error) {
      console.error('Error updating transaction:', error.response ? error.response.data : error.message);
      setError('Failed to update transaction: ' + (error.response ? error.response.data.message : error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        setLoading(true);
        console.log(`Deleting transaction with ID: ${formData.idtransaksivarchar}`); // Debug log
        const response = await axios.delete(`${apiurl}/transaksi-keluar/${formData.idtransaksivarchar}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Delete Response:', response.data); // Log the response
        const message = response.data.message || 'Transaction deleted successfully!';
        setError(null); // Clear previous errors
        alert(message);
        setFormData({
          idtransaksivarchar: '',
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
        setError('Failed to delete transaction: ' + (error.response ? error.response.data.message : error.message));
      } finally {
        setLoading(false);
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

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex items-center mb-4">
        <img 
          src={barangMasukIcon} 
          alt="Barang Masuk Icon" 
          className="w-8 h-8 mr-3"  // Adjust width, height, and margin
        />
        <h1 className="text-2xl font-semibold">Edit or Delete Transaksi Barang Keluar</h1>
      </div>
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
              <label className="block text-sm font-medium text-gray-700">Sumber Barang</label>
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
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                type="number"
                name="qty"
                value={formData.qty}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                disabled={loading}
              >
                Update
              </button>
              <button
                type="button"
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                onClick={handleDelete}
                disabled={loading}
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
