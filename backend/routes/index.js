const express = require('express');
const { getUsers, register, login, logout } = require('../controllers/Users.js');
const { verifyToken } = require('../middleware/VerifyToken.js');
const { refreshToken } = require('../controllers/RefreshToken.js');
const { getAllTransaksi, createTransaksi, getLatestTransaksiId, getTransaksiById, updateTransaksi, deleteTransaksi } = require('../controllers/TransaksiController.js');
const { getAllTransaksiKeluar, createTransaksiKeluar, getLatestTransaksiIdKeluar, getTransaksiKeluarById, updateTransaksiKeluar, deleteTransaksiKeluar } = require('../controllers/TransaksiKeluarController.js');

const router = express.Router();

router.get('/users', verifyToken, getUsers);
router.post('/users', register); // Gunakan 'register' dari 'Users.js'
router.post('/login', login); // Gunakan 'login' dari 'Users.js'
router.get('/token', refreshToken);
router.delete('/logout', logout); // Gunakan 'logout' dari 'Users.js'

// Rute untuk transaksi masuk
router.get('/transaksi', verifyToken, getAllTransaksi); // Ensure that only authenticated users can get transactions
router.post('/transaksi', verifyToken, createTransaksi); // Ensure that only authenticated users can create transactions
router.get('/transaksi/latest-id', verifyToken, getLatestTransaksiId); // New route to get the latest transaction ID
router.get('/transaksi/:id', verifyToken, getTransaksiById); // Ensure that only authenticated users can get transaction by ID
router.put('/transaksi/:id', verifyToken, updateTransaksi); // Ensure that only authenticated users can update transactions
router.delete('/transaksi/:id', verifyToken, deleteTransaksi); // Ensure that only authenticated users can delete transactions

// Rute untuk transaksi keluar
router.get('/transaksi-keluar', verifyToken, getAllTransaksiKeluar); // Ensure that only authenticated users can get transactions
router.post('/transaksi-keluar', verifyToken, createTransaksiKeluar); // Ensure that only authenticated users can create transactions
router.get('/transaksi-keluar/latest-id', verifyToken, getLatestTransaksiIdKeluar); // New route to get the latest transaction ID
router.get('/transaksi-keluar/:id', verifyToken, getTransaksiKeluarById); // Ensure that only authenticated users can get transaction by ID
router.put('/transaksi-keluar/:id', verifyToken, updateTransaksiKeluar); // Ensure that only authenticated users can update transactions
router.delete('/transaksi-keluar/:id', verifyToken, deleteTransaksiKeluar); // Ensure that only authenticated users can delete transactions

router.get('/', (req, res) => {
  res.send('Hello World!');
});

module.exports = router;
