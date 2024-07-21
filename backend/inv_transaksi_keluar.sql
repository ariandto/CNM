-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jul 20, 2024 at 01:29 AM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `auth_db2`
--

-- --------------------------------------------------------

--
-- Table structure for table `inv_transaksi_keluar`
--

CREATE TABLE `inv_transaksi_keluar` (
  `idtransaksikeluar` int(11) DEFAULT NULL,
  `tanggal_pickup` datetime NOT NULL,
  `nopol` varchar(255) CHARACTER SET latin1 NOT NULL,
  `driver` text CHARACTER SET latin1 NOT NULL,
  `sumber_barang` text CHARACTER SET latin1 NOT NULL,
  `nama_barang` text CHARACTER SET latin1 NOT NULL,
  `uom` varchar(255) CHARACTER SET latin1 NOT NULL,
  `qty` int(11) NOT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `refresh_token` text CHARACTER SET latin1 NOT NULL,
  `updatedAt` timestamp(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `inv_transaksi_keluar`
--

INSERT INTO `inv_transaksi_keluar` (`idtransaksikeluar`, `tanggal_pickup`, `nopol`, `driver`, `sumber_barang`, `nama_barang`, `uom`, `qty`, `createdAt`, `refresh_token`, `updatedAt`) VALUES
(1, '2024-07-19 20:30:45', 'BGWG1TG', 'AKU', 'DIA', 'OKEs', 'KG', 100, '2024-07-19 19:30:36.284576', '', '0000-00-00 00:00:00.000000');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
