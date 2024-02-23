-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 23, 2024 at 02:21 PM
-- Server version: 10.1.38-MariaDB
-- PHP Version: 5.6.40

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `employee_manager`
--

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `employeeId` varchar(255) NOT NULL,
  `mobileNumber` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `age` int(11) NOT NULL,
  `phoneNumber` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `name`, `email`, `employeeId`, `mobileNumber`, `gender`, `age`, `phoneNumber`, `createdAt`, `updatedAt`) VALUES
(1, 'Krishna Ram', 'krish.rama@yopmail.com', 'AJHJHD8997', '9877667766', 'Male', 35, '7878787878', '2024-02-23 09:59:16', '2024-02-23 13:11:58'),
(2, 'Raju Ram', 'raju.ram@yopmail.com', 'AJHJHD8999', '9877667765', 'Male', 23, NULL, '2024-02-23 10:31:19', '2024-02-23 10:31:19'),
(3, 'Sonia Joy', 'sonia.joy@yopmail.com', 'AJHJH55999', '9877668865', 'Female', 28, NULL, '2024-02-23 10:31:54', '2024-02-23 10:31:54'),
(4, 'Martha Joy', 'martha.joy@yopmail.com', 'MRHJH55999', '6177668865', 'Female', 28, NULL, '2024-02-23 10:32:47', '2024-02-23 10:32:47'),
(5, 'James', 'james@yopmail.com', '987987AHDG', '9898989898', 'Male', 25, NULL, '2024-02-23 11:19:10', '2024-02-23 11:19:10'),
(6, 'Sarojini Naidu', 'saroji.naidu@yopmail.com', '678678HARO', '7878676767', 'Female', 56, NULL, '2024-02-23 11:25:43', '2024-02-23 11:25:43');

-- --------------------------------------------------------

--
-- Table structure for table `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20240223091024-create-employees.js');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
