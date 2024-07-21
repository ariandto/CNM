import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

import { apiurl } from './api/config';

function FormTransaksiKeluar() {
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
  const navigate = useNavigate();

  // Fetch a new ID for transaksi
  const handleFetchNewId = async () => {
    try {
      const response = await axios.get(`${apiurl}/transaksi-keluar/latest-id`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Fetched new transaction ID:', response.data);
      setFormData((prevData) => ({ ...prevData, idtransaksikeluar: response.data.idtransaksikeluar }));
    } catch (error) {
      console.error('Error fetching new transaction ID:', error.response ? error.response.data : error.message);
      alert('Failed to fetch new transaction ID: ' + (error.response ? error.response.data.message : error.message));
    }
  };

  // Submit the transaction form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Set current timestamp for tanggal_pickup
    const currentTimestamp = new Date().toISOString();

    const dataToSend = {
      ...formData,
      tanggal_pickup: currentTimestamp // Add timestamp to data
    };

    console.log('Submitting form with data:', dataToSend);

    try {
      const response = await axios.post(`${apiurl}/transaksi-keluar`, dataToSend, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Create transaction response:', response.data);
      alert(response.data.message);
      // Reset form data after successful submission
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
      console.error('Error creating transaction:', error.response ? error.response.data : error.message);
      alert('Failed to create transaction: ' + (error.response ? error.response.data.message : error.message));
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Updating field ${name} with value ${value}`);
    setFormData({ ...formData, [name]: value });
  };

  // Refresh token
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

  // Token expiration handling
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
    <div className="container">
      <h1 className="title">Form Transaksi Barang Keluar</h1>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="label">ID Transaksi</label>
          <div className="control">
            <input
              className="input"
              type="text"
              name="idtransaksi"
              value={formData.idtransaksikeluar}
              onChange={handleChange}
              placeholder="Enter transaction ID"
              required
            />
            <button
              type="button"
              className="button is-info"
              onClick={handleFetchNewId}
            >
              Fetch New ID
            </button>
          </div>
        </div>

        <div className="field">
          <label className="label">Nopol</label>
          <div className="control">
            <input
              className="input"
              type="text"
              name="nopol"
              value={formData.nopol}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="field">
          <label className="label">Driver</label>
          <div className="control">
            <input
              className="input"
              type="text"
              name="driver"
              value={formData.driver}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="field">
          <label className="label">Sumber Barang</label>
          <div className="control">
            <input
              className="input"
              type="text"
              name="sumber_barang"
              value={formData.sumber_barang}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="field">
          <label className="label">Nama Barang</label>
          <div className="control">
            <input
              className="input"
              type="text"
              name="nama_barang"
              value={formData.nama_barang}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="field">
          <label className="label">UOM</label>
          <div className="control">
            <input
              className="input"
              type="text"
              name="uom"
              value={formData.uom}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="field">
          <label className="label">Qty</label>
          <div className="control">
            <input
              className="input"
              type="number"
              name="qty"
              value={formData.qty}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="field">
          <div className="control">
            <button className="button is-primary" type="submit">Submit</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default FormTransaksiKeluar;
