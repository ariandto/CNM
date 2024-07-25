import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { apiurl } from './api/config';

function About() {
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const navigate = useNavigate();

  // Refresh token
  const refreshToken = useCallback(async () => {
    try {
      const response = await axios.get(`${apiurl}/token`);
      if (response.data) {
        setToken(response.data.accessToken);
        const decoded = jwtDecode(response.data.accessToken);
        setExpire(decoded.exp);
      } else {
        throw new Error('Invalid response data');
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      navigate("/"); // Redirect if token refresh fails
    }
  }, [navigate]);

  // Token expiration handling and periodic refresh
  useEffect(() => {
    const axiosJWT = axios.create();

    axiosJWT.interceptors.request.use(async (config) => {
      const currentDate = new Date();
      if (expire * 1000 < currentDate.getTime()) {
        // Token expired, refresh it
        try {
          const response = await axios.get(`${apiurl}/token`);
          if (response.data) {
            const newToken = response.data.accessToken;
            config.headers.Authorization = `Bearer ${newToken}`;
            setToken(newToken);
            const decoded = jwtDecode(newToken);
            setExpire(decoded.exp);
          } else {
            throw new Error('Invalid response data');
          }
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

    // Refresh token on component mount
    const initialize = async () => {
      await refreshToken();
    };
    initialize();

    // Periodic refresh every 5 minutes
    const intervalId = setInterval(() => {
      const currentDate = new Date();
      if (expire * 1000 < currentDate.getTime() && token) {
        refreshToken();
      }
    }, 300000); // 5 minutes

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [expire, token, navigate, refreshToken]);

  return (
    <div className="container mx-auto p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4 md:text-3xl">About Us</h1>
        <p className="text-sm md:text-base">
          PT. Cholyfour Mitra Mandiri, sebagai sebuah perusahaan dalam negeri, sesuai dengan Akte Pendirian yang disahkan oleh Departemen Kehakiman dan Hak Asasi Manusia No. C–12010 HT.01.01.TH.2003, Keputusan Mentri Hukum dan Hak Asasi Manusia Republik Indonesia No. AHU-34540.AH.01.02 Tahun 2008 tentang Persetujuan Perubahan Anggaran Dasar Perseroan dan telah terdaftar di Dinas Perindustrian Perdagangan Koperasi dan PMD No. 100715103157 adalah sebuah badan usaha yang bergerak dalam bidang perdagangan besar dengan spesifikasi kegiatan usaha di bidang pengelolaan barang-barang rijek, bekas dan segala jenis limbah industri serta penanganan kebersihaan (K3). Seiring berjalannya waktu, PT. Cholyfour Mitra Mandiri saat ini telah menjadi salah satu perusahaan pengelola limbah besar yang ada di Wilayah Jabodetabek.
        </p>
        <p className="mt-4 text-sm md:text-base">
          Aplikasi ini dibuat untuk memudahkan pengelolaan inventaris barang dan stok. Dengan sistem ini, kami dapat mengelola transaksi barang masuk dan keluar dengan lebih efisien, mengurangi kesalahan manusia, dan memastikan informasi stok selalu up-to-date. Tujuan utama kami adalah meningkatkan akurasi dan kecepatan dalam proses pengelolaan inventaris untuk mendukung operasional perusahaan secara keseluruhan.
        </p>
      </div>
    </div>
  );
}

export default About;
