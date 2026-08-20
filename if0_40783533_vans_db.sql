-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Servidor: sql100.infinityfree.com
-- Tiempo de generación: 03-05-2026 a las 02:53:29
-- Versión del servidor: 11.4.10-MariaDB
-- Versión de PHP: 7.2.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `if0_40783533_vans_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `search_history`
--

CREATE TABLE `search_history` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `media_id` int(11) NOT NULL,
  `media_title` varchar(255) NOT NULL,
  `media_poster` varchar(255) DEFAULT NULL,
  `media_type` varchar(50) NOT NULL,
  `searched_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `search_history`
--

INSERT INTO `search_history` (`id`, `user_id`, `media_id`, `media_title`, `media_poster`, `media_type`, `searched_at`) VALUES
(1, 1, 552524, 'Lilo y Stitch', 'https://image.tmdb.org/t/p/original/4oLLOAT55JhAoe73VliaSKFvEEr.jpg', 'movie', '2026-04-03 18:56:31'),
(2, 1, 634649, 'Spider-Man: Sin camino a casa', 'https://image.tmdb.org/t/p/original/miZFgV81xG324rpUknQX8dtXuBl.jpg', 'movie', '2026-04-03 23:34:44'),
(3, 1, 63174, 'Lucifer', 'https://image.tmdb.org/t/p/original/wQh2ytX0f8IfC3b2mKpDGOpGTXS.jpg', 'tv', '2026-04-04 06:26:28'),
(4, 1, 3498, 'Los Hechiceros de Waverly Place', 'https://image.tmdb.org/t/p/original/bJisSc7HGAfWgg1M7916CMfSZTX.jpg', 'tv', '2026-04-11 12:26:58'),
(5, 1, 61222, 'BoJack Horseman', 'https://image.tmdb.org/t/p/original/6JFWzlChcGgLiIUo2COgNlWGFKy.jpg', 'tv', '2026-04-23 11:21:09'),
(7, 1, 726684, 'El Mundo Miraculous: Shanghai, La Leyenda de Ladydragón', 'https://image.tmdb.org/t/p/original/r6zthVPVoq1urTOsLgofPGel89d.jpg', 'movie', '2026-04-24 02:21:05'),
(8, 1, 65334, 'Miraculous: Las aventuras de Ladybug', 'https://image.tmdb.org/t/p/original/z9n5ZOECtbug5h07kq7RxoLRBOZ.jpg', 'tv', '2026-04-24 03:17:57'),
(9, 1, 76479, 'The Boys', 'https://image.tmdb.org/t/p/original/5kgY14oisiHcJ4zq0Xgq1e97PHm.jpg', 'tv', '2026-04-25 20:45:13'),
(10, 1, 60625, 'Rick y Morty', 'https://image.tmdb.org/t/p/original/5Yiep9EwcQgLolg013ETBVqHxuD.jpg', 'tv', '2026-04-26 10:30:25'),
(11, 1, 289219, 'Star Wars: Maul - Señor de las sombras', 'https://image.tmdb.org/t/p/original/9T4ECKFMBWqT7msxdaCGtsa3g5R.jpg', 'tv', '2026-04-26 20:29:29'),
(12, 1, 71728, 'El Joven Sheldon', 'https://image.tmdb.org/t/p/original/Jxl5Z1JBWnd2JWJUgYsm8FIzG4.jpg', 'tv', '2026-04-26 21:03:16'),
(13, 1, 1418, 'La Teoría del Big Bang', 'https://image.tmdb.org/t/p/original/2bDQWCvFxRGhdvThTJvVxueEoLl.jpg', 'tv', '2026-04-26 22:16:17'),
(14, 1, 1147411, 'Mundo Miraculous: Tokio, Stellar Force', 'https://image.tmdb.org/t/p/original/vFaopnGXRXxRf4z2Z3IgA1QtOyV.jpg', 'movie', '2026-04-27 01:25:28'),
(15, 1, 496450, 'Miraculous: Las aventuras de Ladybug - La Película', 'https://image.tmdb.org/t/p/original/bVlB5J2KYkbwBnWJSJEAbvPFaqm.jpg', 'movie', '2026-04-27 02:19:47');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `role`, `created_at`) VALUES
(1, 'darlyn', 'darlyn@gmail.com', '$2y$10$s52tK56gu5yTb/nLEZsfpe2dNh/DDqf/R/Sz8NLBatqVgb0NUkExS', 'user', '2026-04-02 19:35:46');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_favorites`
--

CREATE TABLE `user_favorites` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `tmdb_id` int(11) NOT NULL,
  `media_type` enum('movie','tv') NOT NULL,
  `added_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `user_favorites`
--

INSERT INTO `user_favorites` (`id`, `user_id`, `tmdb_id`, `media_type`, `added_at`) VALUES
(2, 1, 1418, 'tv', '2026-04-03 02:11:08'),
(3, 1, 1231574, 'movie', '2026-04-03 23:35:56'),
(4, 1, 289219, 'tv', '2026-04-26 21:01:04'),
(5, 1, 71728, 'tv', '2026-04-26 21:03:27');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_progress`
--

CREATE TABLE `user_progress` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `tmdb_id` int(11) NOT NULL,
  `media_type` enum('movie','tv') NOT NULL,
  `season_number` int(11) DEFAULT NULL,
  `episode_number` int(11) DEFAULT NULL,
  `last_position_seconds` int(11) DEFAULT 0,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `image_url` varchar(255) DEFAULT NULL,
  `last_server` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `user_progress`
--

INSERT INTO `user_progress` (`id`, `user_id`, `tmdb_id`, `media_type`, `season_number`, `episode_number`, `last_position_seconds`, `updated_at`, `image_url`, `last_server`) VALUES
(1, 1, 94404, 'tv', 1, 7, 0, '2026-04-02 21:16:30', NULL, NULL),
(7, 1, 37854, 'tv', 1, 4, 0, '2026-04-03 19:05:52', NULL, NULL),
(22, 1, 1418, 'tv', 8, 9, 0, '2026-05-03 06:27:42', 'https://image.tmdb.org/t/p/original/ywnhAABDYKUpdxfn9vz1oH4zBee.jpg', 'STREAMWISH'),
(24, 1, 86031, 'tv', 1, 1, 0, '2026-04-03 18:55:12', NULL, NULL),
(36, 1, 63174, 'tv', 5, 10, 0, '2026-04-23 11:48:16', 'https://image.tmdb.org/t/p/original/zuQ0L3AJXhYARINQNH5guw9bPlb.jpg', NULL),
(57, 1, 3498, 'tv', 1, 3, 0, '2026-04-25 12:18:45', 'https://image.tmdb.org/t/p/original/un9Qoemn7MXkizsJjvFG54OHbnD.jpg', NULL),
(74, 1, 61222, 'tv', 1, 10, 0, '2026-04-23 11:21:52', 'https://image.tmdb.org/t/p/original/7ZAsvywpXqI4PuI4D5HRhOOFbx3.jpg', NULL),
(77, 1, 65334, 'tv', 5, 15, 0, '2026-04-30 11:05:22', 'https://image.tmdb.org/t/p/original/9eE6QwEDzVI42Rc0WjTgzTlL78c.jpg', 'Vidfast'),
(80, 1, 76479, 'tv', 2, 8, 0, '2026-04-25 20:45:36', 'https://image.tmdb.org/t/p/original/w44GW7Zv808V1nsr1NY6Y3I8r8B.jpg', NULL),
(105, 1, 60625, 'tv', 4, 2, 0, '2026-04-26 20:26:27', NULL, NULL),
(119, 1, 289219, 'tv', 1, 2, 0, '2026-04-26 20:57:31', 'https://image.tmdb.org/t/p/original/aYVNkCYh8NgkYVvptLVexZbSYxQ.jpg', NULL),
(121, 1, 71728, 'tv', 1, 3, 0, '2026-04-26 22:05:32', 'https://image.tmdb.org/t/p/original/5MI4tX8hjeD1zSpMbv2WbIKsliP.jpg', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_ratings`
--

CREATE TABLE `user_ratings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `tmdb_id` int(11) NOT NULL,
  `media_type` enum('movie','tv') NOT NULL,
  `rating` tinyint(4) DEFAULT NULL
) ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_watched_history`
--

CREATE TABLE `user_watched_history` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `tmdb_id` int(11) NOT NULL,
  `media_type` enum('movie','tv') DEFAULT 'tv',
  `season_number` int(11) DEFAULT NULL,
  `episode_number` int(11) DEFAULT NULL,
  `watched_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `user_watched_history`
--

INSERT INTO `user_watched_history` (`id`, `user_id`, `tmdb_id`, `media_type`, `season_number`, `episode_number`, `watched_at`) VALUES
(1, 1, 37854, 'tv', 1, 2, '2026-04-02 20:48:06'),
(2, 1, 37854, 'tv', 1, 1, '2026-04-02 21:03:45'),
(9, 1, 94404, 'tv', 1, 7, '2026-04-02 21:16:30'),
(11, 1, 37854, 'tv', 1, 3, '2026-04-02 21:19:29'),
(14, 1, 37854, 'tv', 1, 4, '2026-04-02 21:40:55'),
(15, 1, 1418, 'tv', 4, 11, '2026-04-02 22:44:54'),
(16, 1, 1418, 'tv', 4, 12, '2026-04-02 23:03:39'),
(17, 1, 86031, 'tv', 1, 1, '2026-04-03 02:12:51'),
(25, 1, 1418, 'tv', 4, 14, '2026-04-04 05:42:04'),
(26, 1, 1418, 'tv', 4, 15, '2026-04-04 05:43:40'),
(27, 1, 1418, 'tv', 4, 16, '2026-04-04 06:04:02'),
(28, 1, 1418, 'tv', 4, 17, '2026-04-04 06:25:54'),
(29, 1, 63174, 'tv', 5, 2, '2026-04-04 06:27:47'),
(30, 1, 63174, 'tv', 5, 3, '2026-04-04 07:24:34'),
(33, 1, 63174, 'tv', 5, 4, '2026-04-05 09:40:45'),
(34, 1, 63174, 'tv', 5, 5, '2026-04-05 10:11:01'),
(36, 1, 63174, 'tv', 5, 6, '2026-04-09 04:09:41'),
(37, 1, 63174, 'tv', 5, 7, '2026-04-09 05:04:31'),
(45, 1, 63174, 'tv', 5, 8, '2026-04-09 07:25:19'),
(46, 1, 63174, 'tv', 5, 9, '2026-04-09 08:28:50'),
(49, 1, 1418, 'tv', 4, 18, '2026-04-09 12:30:47'),
(50, 1, 3498, 'tv', 1, 1, '2026-04-11 12:27:09'),
(56, 1, 1418, 'tv', 4, 19, '2026-04-15 12:54:41'),
(57, 1, 1418, 'tv', 4, 20, '2026-04-15 13:19:28'),
(59, 1, 1418, 'tv', 4, 21, '2026-04-16 12:13:36'),
(61, 1, 1418, 'tv', 4, 22, '2026-04-17 10:12:08'),
(62, 1, 1418, 'tv', 4, 23, '2026-04-17 10:33:34'),
(65, 1, 1418, 'tv', 4, 24, '2026-04-17 10:54:58'),
(66, 1, 1418, 'tv', 5, 1, '2026-04-17 11:17:10'),
(67, 1, 61222, 'tv', 1, 10, '2026-04-23 11:21:52'),
(69, 1, 63174, 'tv', 5, 10, '2026-04-23 11:48:16'),
(70, 1, 65334, 'tv', 1, 1, '2026-04-24 03:18:11'),
(72, 1, 3498, 'tv', 1, 3, '2026-04-25 12:18:45'),
(73, 1, 76479, 'tv', 2, 6, '2026-04-25 20:45:36'),
(74, 1, 76479, 'tv', 2, 8, '2026-04-25 20:45:36'),
(76, 1, 1418, 'tv', 6, 7, '2026-04-26 05:03:16'),
(78, 1, 1418, 'tv', 6, 8, '2026-04-26 05:29:56'),
(80, 1, 1418, 'tv', 6, 9, '2026-04-26 06:02:37'),
(81, 1, 1418, 'tv', 6, 10, '2026-04-26 06:24:58'),
(83, 1, 1418, 'tv', 6, 11, '2026-04-26 06:28:16'),
(84, 1, 1418, 'tv', 6, 12, '2026-04-26 06:49:42'),
(85, 1, 1418, 'tv', 6, 13, '2026-04-26 07:33:32'),
(86, 1, 1418, 'tv', 6, 14, '2026-04-26 07:55:47'),
(89, 1, 1418, 'tv', 6, 15, '2026-04-26 08:21:08'),
(90, 1, 1418, 'tv', 6, 16, '2026-04-26 08:23:34'),
(92, 1, 1418, 'tv', 6, 17, '2026-04-26 08:24:34'),
(93, 1, 1418, 'tv', 6, 18, '2026-04-26 08:45:47'),
(94, 1, 1418, 'tv', 6, 19, '2026-04-26 09:11:19'),
(95, 1, 1418, 'tv', 6, 20, '2026-04-26 09:31:51'),
(96, 1, 1418, 'tv', 6, 21, '2026-04-26 09:53:05'),
(98, 1, 60625, 'tv', 4, 1, '2026-04-26 10:30:33'),
(99, 1, 60625, 'tv', 4, 2, '2026-04-26 10:53:35'),
(101, 1, 65334, 'tv', 5, 2, '2026-04-26 11:20:51'),
(102, 1, 65334, 'tv', 5, 3, '2026-04-26 11:43:52'),
(103, 1, 65334, 'tv', 5, 10, '2026-04-26 12:07:07'),
(104, 1, 65334, 'tv', 5, 9, '2026-04-26 12:07:09'),
(107, 1, 65334, 'tv', 5, 11, '2026-04-26 12:54:25'),
(109, 1, 65334, 'tv', 5, 12, '2026-04-26 13:18:13'),
(112, 1, 289219, 'tv', 1, 1, '2026-04-26 20:29:35'),
(113, 1, 289219, 'tv', 1, 2, '2026-04-26 20:57:31'),
(114, 1, 71728, 'tv', 1, 1, '2026-04-26 21:03:55'),
(115, 1, 71728, 'tv', 1, 2, '2026-04-26 21:26:23'),
(116, 1, 71728, 'tv', 1, 3, '2026-04-26 21:59:06'),
(117, 1, 71728, 'tv', 1, 4, '2026-04-26 21:59:06'),
(121, 1, 1418, 'tv', 6, 22, '2026-04-26 22:17:19'),
(124, 1, 1418, 'tv', 6, 23, '2026-04-27 04:56:26'),
(127, 1, 65334, 'tv', 5, 13, '2026-04-27 11:10:01'),
(129, 1, 1418, 'tv', 6, 24, '2026-04-28 06:30:25'),
(132, 1, 1418, 'tv', 7, 1, '2026-04-28 07:12:19'),
(134, 1, 1418, 'tv', 7, 3, '2026-04-28 11:23:16'),
(135, 1, 1418, 'tv', 7, 4, '2026-04-28 11:23:35'),
(136, 1, 1418, 'tv', 7, 5, '2026-04-28 11:46:57'),
(137, 1, 1418, 'tv', 7, 6, '2026-04-28 12:08:58'),
(139, 1, 1418, 'tv', 7, 7, '2026-04-29 07:50:53'),
(140, 1, 1418, 'tv', 7, 8, '2026-04-29 09:25:15'),
(142, 1, 1418, 'tv', 7, 9, '2026-04-29 09:49:38'),
(144, 1, 1418, 'tv', 7, 10, '2026-04-29 10:16:21'),
(145, 1, 1418, 'tv', 7, 11, '2026-04-29 10:37:52'),
(146, 1, 1418, 'tv', 7, 12, '2026-04-29 11:00:33'),
(149, 1, 1418, 'tv', 7, 13, '2026-04-30 08:20:42'),
(150, 1, 1418, 'tv', 7, 14, '2026-04-30 08:42:32'),
(151, 1, 1418, 'tv', 7, 15, '2026-04-30 09:02:59'),
(153, 1, 1418, 'tv', 7, 16, '2026-04-30 09:26:43'),
(155, 1, 1418, 'tv', 7, 17, '2026-04-30 10:19:52'),
(157, 1, 1418, 'tv', 7, 18, '2026-04-30 10:42:55'),
(159, 1, 65334, 'tv', 5, 14, '2026-04-30 11:04:49'),
(161, 1, 65334, 'tv', 5, 15, '2026-04-30 11:05:12'),
(164, 1, 1418, 'tv', 7, 19, '2026-05-01 07:26:15'),
(165, 1, 1418, 'tv', 7, 20, '2026-05-01 07:45:27'),
(166, 1, 1418, 'tv', 7, 21, '2026-05-01 08:06:50'),
(168, 1, 1418, 'tv', 7, 22, '2026-05-01 10:07:54'),
(170, 1, 1418, 'tv', 7, 23, '2026-05-02 08:10:32'),
(171, 1, 1418, 'tv', 7, 24, '2026-05-02 08:10:51'),
(172, 1, 1418, 'tv', 8, 1, '2026-05-02 08:33:16'),
(173, 1, 1418, 'tv', 8, 2, '2026-05-02 08:55:31'),
(175, 1, 1418, 'tv', 8, 3, '2026-05-02 09:22:48'),
(176, 1, 1418, 'tv', 8, 4, '2026-05-02 09:46:23'),
(177, 1, 1418, 'tv', 8, 5, '2026-05-02 10:05:09'),
(178, 1, 1418, 'tv', 8, 6, '2026-05-02 10:26:17'),
(180, 1, 1418, 'tv', 8, 7, '2026-05-03 05:48:41'),
(181, 1, 1418, 'tv', 8, 8, '2026-05-03 05:53:46'),
(182, 1, 1418, 'tv', 8, 9, '2026-05-03 06:27:42');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `search_history`
--
ALTER TABLE `search_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `searched_at` (`searched_at`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `user_favorites`
--
ALTER TABLE `user_favorites`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_fav` (`user_id`,`tmdb_id`,`media_type`);

--
-- Indices de la tabla `user_progress`
--
ALTER TABLE `user_progress`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_progress` (`user_id`,`tmdb_id`,`media_type`);

--
-- Indices de la tabla `user_watched_history`
--
ALTER TABLE `user_watched_history`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_watch` (`user_id`,`tmdb_id`,`media_type`,`season_number`,`episode_number`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `search_history`
--
ALTER TABLE `search_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `user_favorites`
--
ALTER TABLE `user_favorites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `user_progress`
--
ALTER TABLE `user_progress`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=190;

--
-- AUTO_INCREMENT de la tabla `user_ratings`
--
ALTER TABLE `user_ratings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `user_watched_history`
--
ALTER TABLE `user_watched_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=183;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `user_favorites`
--
ALTER TABLE `user_favorites`
  ADD CONSTRAINT `user_favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `user_progress`
--
ALTER TABLE `user_progress`
  ADD CONSTRAINT `user_progress_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `user_watched_history`
--
ALTER TABLE `user_watched_history`
  ADD CONSTRAINT `user_watched_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
