const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/Database.js');

const Transaksi = db.define('inv_transaksi_masuk', {
  idtransaksi: {
    type: DataTypes.INTEGER, // Changed to INTEGER for auto-increment
    primaryKey: true,
    autoIncrement: true // Automatically increment the ID
  },
  tanggal_pickup: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  nopol: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  driver: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  sumber_barang: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  nama_barang: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  uom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  qty: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  freezeTableName: true,
  timestamps: false // Disable timestamps if not needed
});

module.exports = Transaksi;
