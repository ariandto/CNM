const Transaksi = require('../models/Transaksi.js');
const moment = require('moment'); // Menggunakan moment.js untuk format tanggal
const { Op } = require('sequelize'); // Import Op from Sequelize

const getAllTransaksi = async (req, res) => {
  try {
    const transaksi = await Transaksi.findAll();
    res.status(200).json(transaksi);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const generateNewTransaksiId = async () => {
  try {
    const today = moment().format('DDMMYY');
    const prefix = `CMMIN${today}`;

    const lastTransaksi = await Transaksi.findOne({
      where: {
        idtransaksi: {
          [Op.like]: `${prefix}%`
        }
      },
      order: [['idtransaksi', 'DESC']]
    });

    if (!lastTransaksi) {
      return `${prefix}0001`; // Default ID jika tidak ada data sebelumnya
    }

    const lastId = lastTransaksi.idtransaksi;
    const lastNumber = parseInt(lastId.slice(-4));
    const newNumber = (lastNumber + 1).toString().padStart(4, '0');

    return prefix + newNumber;
  } catch (error) {
    console.error("Error generating new transaction ID:", error);
    throw new Error("Error generating new transaction ID");
  }
};

const createTransaksi = async (req, res) => {
  const { tanggal_pickup, nopol, driver, sumber_barang, nama_barang, uom, qty } = req.body;

  // Basic validation
  if (!tanggal_pickup || !nopol || !driver || !sumber_barang || !nama_barang || !uom || !qty) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const idtransaksi = await generateNewTransaksiId();

    const newTransaksi = await Transaksi.create({
      idtransaksi,
      tanggal_pickup,
      nopol,
      driver,
      sumber_barang,
      nama_barang,
      uom,
      qty
    });

    res.status(201).json({ message: 'Transaksi Created', transaksi: newTransaksi });
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getLatestTransaksiId = async (req, res) => {
  try {
    const newId = await generateNewTransaksiId();
    res.status(200).json({ idtransaksi: newId });
  } catch (error) {
    console.error("Error fetching latest transaction ID:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getTransaksiById = async (req, res) => {
  try {
    const transaksi = await Transaksi.findByPk(req.params.id);
    if (transaksi) {
      res.status(200).json(transaksi);
    } else {
      res.status(404).json({ message: 'Transaksi not found' });
    }
  } catch (error) {
    console.error("Error fetching transaction by ID:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateTransaksi = async (req, res) => {
  const { tanggal_pickup, nopol, driver, sumber_barang, nama_barang, uom, qty } = req.body;

  // Basic validation
  if (!tanggal_pickup || !nopol || !driver || !sumber_barang || !nama_barang || !uom || !qty) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const [updated] = await Transaksi.update({
      tanggal_pickup,
      nopol,
      driver,
      sumber_barang,
      nama_barang,
      uom,
      qty
    }, {
      where: { idtransaksi: req.params.id }
    });

    if (updated) {
      const updatedTransaksi = await Transaksi.findByPk(req.params.id);
      res.status(200).json(updatedTransaksi);
    } else {
      res.status(404).json({ message: 'Transaksi not found' });
    }
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteTransaksi = async (req, res) => {
  try {
    const deleted = await Transaksi.destroy({
      where: { idtransaksi: req.params.id }
    });

    if (deleted) {
      res.status(200).json({ message: 'Transaksi deleted' });
    } else {
      res.status(404).json({ message: 'Transaksi not found' });
    }
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getAllTransaksi,
  createTransaksi,
  getLatestTransaksiId,
  getTransaksiById,
  updateTransaksi,
  deleteTransaksi,
};
