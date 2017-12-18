-- phpMyAdmin SQL Dump
-- version 4.7.1
-- https://www.phpmyadmin.net/
--
-- Servidor: sql10.freemysqlhosting.net
-- Tiempo de generación: 18-12-2017 a las 22:24:39
-- Versión del servidor: 5.5.53-0ubuntu0.14.04.1
-- Versión de PHP: 7.0.22-0ubuntu0.16.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `sql10211351`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `k_nodes`
--

CREATE TABLE `k_nodes` (
  `node_id` int(11) NOT NULL,
  `node_nodeKey` text COLLATE utf8_bin NOT NULL,
  `node_sku` text COLLATE utf8_bin NOT NULL,
  `node_manufacturer` text COLLATE utf8_bin NOT NULL,
  `node_version` varchar(255) COLLATE utf8_bin NOT NULL,
  `node_registered_by` int(11) NOT NULL,
  `node_date` datetime NOT NULL,
  `node_status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Volcado de datos para la tabla `k_nodes`
--

INSERT INTO `k_nodes` (`node_id`, `node_nodeKey`, `node_sku`, `node_manufacturer`, `node_version`, `node_registered_by`, `node_date`, `node_status`) VALUES
(1, 'kibitech_2017', 'per01', 'kibitech', '0.1.0', 1, '2017-12-18 16:52:00', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `k_users`
--

CREATE TABLE `k_users` (
  `user_id` int(50) NOT NULL,
  `user_name` varchar(255) COLLATE utf8_bin NOT NULL,
  `user_pass` varchar(255) COLLATE utf8_bin NOT NULL,
  `user_email` text COLLATE utf8_bin NOT NULL,
  `user_date` datetime NOT NULL,
  `user_type` int(11) NOT NULL,
  `user_status` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Volcado de datos para la tabla `k_users`
--

INSERT INTO `k_users` (`user_id`, `user_name`, `user_pass`, `user_email`, `user_date`, `user_type`, `user_status`) VALUES
(1, 'admin', '21232f297a57a5a743894a0e4a801fc3', 'admin@kospr.com', '2017-12-17 02:06:00', 1, 1),
(2, 'judlup', '8a4b0d06e6ee1661b21cb5ed2ea8ab39', 'judlup@domoteco.com', '2017-11-18 20:19:17', 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `k_user_type`
--

CREATE TABLE `k_user_type` (
  `type_id` int(11) NOT NULL,
  `type_name` varchar(255) COLLATE utf8_bin NOT NULL,
  `type_status` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Volcado de datos para la tabla `k_user_type`
--

INSERT INTO `k_user_type` (`type_id`, `type_name`, `type_status`) VALUES
(1, 'Admin', 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `k_nodes`
--
ALTER TABLE `k_nodes`
  ADD PRIMARY KEY (`node_id`),
  ADD KEY `node_registered_by` (`node_registered_by`);

--
-- Indices de la tabla `k_users`
--
ALTER TABLE `k_users`
  ADD PRIMARY KEY (`user_id`),
  ADD KEY `user_type` (`user_type`);

--
-- Indices de la tabla `k_user_type`
--
ALTER TABLE `k_user_type`
  ADD PRIMARY KEY (`type_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `k_nodes`
--
ALTER TABLE `k_nodes`
  MODIFY `node_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT de la tabla `k_users`
--
ALTER TABLE `k_users`
  MODIFY `user_id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT de la tabla `k_user_type`
--
ALTER TABLE `k_user_type`
  MODIFY `type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `k_nodes`
--
ALTER TABLE `k_nodes`
  ADD CONSTRAINT `k_nodes_ibfk_1` FOREIGN KEY (`node_registered_by`) REFERENCES `k_users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `k_users`
--
ALTER TABLE `k_users`
  ADD CONSTRAINT `k_users_ibfk_1` FOREIGN KEY (`user_type`) REFERENCES `k_user_type` (`type_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
