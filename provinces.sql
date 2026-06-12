-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 12, 2026 at 07:44 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gsun_salesportal_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `provinces`
--

CREATE TABLE `provinces` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `provinces`
--

INSERT INTO `provinces` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'آذربایجان شرقی', NULL, NULL),
(2, 'آذربایجان غربی', NULL, NULL),
(3, 'اردبیل', NULL, NULL),
(4, 'اصفهان', NULL, NULL),
(5, 'البرز', NULL, NULL),
(6, 'ایلام', NULL, NULL),
(7, 'بوشهر', NULL, NULL),
(8, 'تهران', NULL, NULL),
(9, 'چهارمحال و بختیاری', NULL, NULL),
(10, 'خراسان جنوبی', NULL, NULL),
(11, 'خراسان رضوی', NULL, NULL),
(12, 'خراسان شمالی', NULL, NULL),
(13, 'خوزستان', NULL, NULL),
(14, 'زنجان', NULL, NULL),
(15, 'سمنان', NULL, NULL),
(16, 'سیستان و بلوچستان', NULL, NULL),
(17, 'فارس', NULL, NULL),
(18, 'قزوین', NULL, NULL),
(19, 'قم', NULL, NULL),
(20, 'كردستان', NULL, NULL),
(21, 'كرمان', NULL, NULL),
(22, 'كرمانشاه', NULL, NULL),
(23, 'کهگیلویه و بویراحمد', NULL, NULL),
(24, 'گلستان', NULL, NULL),
(25, 'گیلان', NULL, NULL),
(26, 'لرستان', NULL, NULL),
(27, 'مازندران', NULL, NULL),
(28, 'مركزی', NULL, NULL),
(29, 'هرمزگان', NULL, NULL),
(30, 'همدان', NULL, NULL),
(31, 'یزد', NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `provinces`
--
ALTER TABLE `provinces`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `provinces`
--
ALTER TABLE `provinces`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
