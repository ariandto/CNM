const TransaksiKeluar = require('../models/TransaksiKeluar.js');
const moment = require('moment'); // Menggunakan moment.js untuk format tanggal
const { Op } = require('sequelize'); // Import Op from Sequelize

const getAllTransaksiKeluar = async (req, res) => {
  try {
    const transaksi = await TransaksiKeluar.findAll();
    res.status(200).json(transaksi);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const generateNewTransaksiIdKeluar = async () => {
  try {
    const today = moment().format('DDMMYY');
    const prefix = `CMMOUT${today}`;

    const lastTransaksi = await TransaksiKeluar.findOne({
      where: {
        idtransaksikeluar: {
          [Op.like]: `${prefix}%`
        }
      },
      order: [['idtransaksikeluar', 'DESC']]
    });

    if (!lastTransaksi) {
      return `${prefix}0001`; // Default ID jika tidak ada data sebelumnya
    }

    const lastId = lastTransaksi.idtransaksikeluar;
    const lastNumber = parseInt(lastId.slice(-4));
    const newNumber = (lastNumber + 1).toString().padStart(4, '0');

    return prefix + newNumber;
  } catch (error) {
    console.error("Error generating new transaction ID:", error);
    throw new Error("Error generating new transaction ID");
  }
};

const createTransaksiKeluar = async (req, res) => {
  const { tanggal_pickup, nopol, driver, sumber_barang, nama_barang, uom, qty } = req.body;

  // Basic validation
  if (!tanggal_pickup || !nopol || !driver || !sumber_barang || !nama_barang || !uom || !qty) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const idtransaksikeluar = await generateNewTransaksiIdKeluar();

    const newTransaksi = await TransaksiKeluar.create({
      idtransaksikeluar,
      tanggal_pickup,
      nopol,
      driver,
      sumber_barang,
      nama_barang,
      uom,
      qty
    });

    res.status(201).json({ message: 'Transaksi Keluar Created', transaksi: newTransaksi });
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getLatestTransaksiIdKeluar = async (req, res) => {
  try {
    const newId = await generateNewTransaksiIdKeluar();
    res.status(200).json({ idtransaksikeluar: newId });
  } catch (error) {
    console.error("Error fetching latest transaction ID:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getTransaksiKeluarById = async (req, res) => {
  try {
    const transaksi = await TransaksiKeluar.findByPk(req.params.id);
    if (transaksi) {
      res.status(200).json(transaksi);
    } else {
      res.status(404).json({ message: 'Transaksi Keluar not found' });
    }
  } catch (error) {
    console.error("Error fetching transaction by ID:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateTransaksiKeluar = async (req, res) => {
  const { tanggal_pickup, nopol, driver, sumber_barang, nama_barang, uom, qty } = req.body;

  // Basic validation
  if (!tanggal_pickup || !nopol || !driver || !sumber_barang || !nama_barang || !uom || !qty) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const [updated] = await TransaksiKeluar.update({
      tanggal_pickup,
      nopol,
      driver,
      sumber_barang,
      nama_barang,
      uom,
      qty
    }, {
      where: { idtransaksikeluar: req.params.id }
    });

    if (updated) {
      const updatedTransaksi = await TransaksiKeluar.findByPk(req.params.id);
      res.status(200).json(updatedTransaksi);
    } else {
      res.status(404).json({ message: 'Transaksi Keluar not found' });
    }
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteTransaksiKeluar = async (req, res) => {
  try {
    const deleted = await TransaksiKeluar.destroy({
      where: { idtransaksikeluar: req.params.id }
    });

    if (deleted) {
      res.status(200).json({ message: 'Transaksi Keluar deleted' });
    } else {
      res.status(404).json({ message: 'Transaksi Keluar not found' });
    }
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getAllTransaksiKeluar,
  createTransaksiKeluar,
  getLatestTransaksiIdKeluar,
  getTransaksiKeluarById,
  updateTransaksiKeluar,
  deleteTransaksiKeluar,
};
