import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const apiurl = 'http://localhost:5000';

function EditDeleteTransaksi() {
  const [formData, setFormData] = useState({
    idtransaksi: '',
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
      const response = await axios.get(`${apiurl}/transaksi/${id}`, {
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
      const response = await axios.put(`${apiurl}/transaksi/${formData.idtransaksi}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const message = response.data.message || 'Transaction updated successfully!';
      alert(message);
      setIsEditing(false);
      setTransactionId('');
      setFormData({
        idtransaksi: '',
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
        const response = await axios.delete(`${apiurl}/transaksi/${formData.idtransaksi}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const message = response.data.message || 'Transaction deleted successfully!';
        alert(message);
        setFormData({
          idtransaksi: '',
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
    <div className="container">
      <h1 className="title">Edit/Delete Transaksi</h1>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="label">Transaction ID</label>
          <div className="control">
            <input
              className="input"
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="Enter transaction ID"
              required
            />
            <button
              type="button"
              className="button is-info"
              onClick={() => fetchTransaction(transactionId)}
            >
              Fetch Details
            </button>
          </div>
        </div>

        {isEditing && (
          <>
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
                <button className="button is-primary" type="submit">Update</button>
                <button
                  type="button"
                  className="button is-danger"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </>
        )}
      </form>
    </div>
  );
}

export default EditDeleteTransaksi;
