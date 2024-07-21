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
-- Table structure for table `inv_transaksi_masuk`
--

CREATE TABLE `inv_transaksi_masuk` (
  `idtransaksi` int(20) NOT NULL,
  `tanggal_pickup` datetime NOT NULL,
  `nopol` varchar(255) NOT NULL,
  `driver` text NOT NULL,
  `sumber_barang` text NOT NULL,
  `nama_barang` text NOT NULL,
  `uom` varchar(255) NOT NULL,
  `qty` int(11) NOT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `refresh_token` text NOT NULL,
  `updatedAt` timestamp(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `inv_transaksi_masuk`
--

INSERT INTO `inv_transaksi_masuk` (`idtransaksi`, `tanggal_pickup`, `nopol`, `driver`, `sumber_barang`, `nama_barang`, `uom`, `qty`, `createdAt`, `refresh_token`, `updatedAt`) VALUES
(1, '2024-07-19 18:05:03', 'SIP', 'WEWER', 'ASFASF', 'DFVASF', 'KG', 100, '2024-07-19 18:05:03.852900', '', '2024-07-19 18:05:03.852900'),
(3, '2024-07-19 18:10:08', 'dfsf', 'sdgsg', 'sdf', 'afsf', 'KGS', 100, '2024-07-19 18:10:08.180059', '', '2024-07-19 18:10:08.180059');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `inv_transaksi_masuk`
--
ALTER TABLE `inv_transaksi_masuk`
  ADD PRIMARY KEY (`idtransaksi`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `inv_transaksi_masuk`
--
ALTER TABLE `inv_transaksi_masuk`
  MODIFY `idtransaksi` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
