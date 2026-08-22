-- =========================================================
-- Database Setup Script for Tournament & Team Manager
-- Database System: MySQL / MariaDB
-- Database Name: tournament_manager
-- =========================================================

CREATE DATABASE IF NOT EXISTS `tournament_manager`;
USE `tournament_manager`;

-- Disable Foreign Key Checks during setup
SET FOREIGN_KEY_CHECKS = 0;

-- Drop tables if they already exist
DROP TABLE IF EXISTS `matches`;
DROP TABLE IF EXISTS `registrations`;
DROP TABLE IF EXISTS `teams`;
DROP TABLE IF EXISTS `tournaments`;
DROP TABLE IF EXISTS `users`;

-- ---------------------------------------------------------
-- 1. Users Table
-- ---------------------------------------------------------
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(120) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` VARCHAR(20) NOT NULL DEFAULT 'user',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------
-- 2. Tournaments Table
-- ---------------------------------------------------------
CREATE TABLE `tournaments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `sport` VARCHAR(50) NOT NULL,
  `location` VARCHAR(150) NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `max_teams` INT NOT NULL DEFAULT 8,
  `status` VARCHAR(20) NOT NULL DEFAULT 'Upcoming',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------
-- 3. Teams Table
-- ---------------------------------------------------------
CREATE TABLE `teams` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `team_name` VARCHAR(100) NOT NULL,
  `captain` VARCHAR(100) NOT NULL,
  `sport` VARCHAR(50) NOT NULL,
  `user_id` INT NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------
-- 4. Registrations Table
-- ---------------------------------------------------------
CREATE TABLE `registrations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `tournament_id` INT NOT NULL,
  `team_id` INT NOT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'Pending',
  `registered_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`tournament_id`) REFERENCES `tournaments`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------
-- 5. Matches Table
-- ---------------------------------------------------------
CREATE TABLE `matches` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `tournament_id` INT NOT NULL,
  `team1_id` INT NOT NULL,
  `team2_id` INT NOT NULL,
  `match_date` DATE NOT NULL,
  `match_time` VARCHAR(20) NOT NULL,
  `venue` VARCHAR(150) NOT NULL,
  `score1` INT DEFAULT 0,
  `score2` INT DEFAULT 0,
  `winner_id` INT DEFAULT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'Upcoming',
  `stream_url` VARCHAR(255) DEFAULT NULL,
  `round_number` INT NOT NULL DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`tournament_id`) REFERENCES `tournaments`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`team1_id`) REFERENCES `teams`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`team2_id`) REFERENCES `teams`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`winner_id`) REFERENCES `teams`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;

-- ---------------------------------------------------------
-- Sample Seed Data (For Demonstration & Testing)
-- Passwords below are pbkdf2 hashed:
-- 'admin123' -> pbkdf2:sha256...
-- 'user123'  -> pbkdf2:sha256...
-- ---------------------------------------------------------

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`) VALUES
(1, 'Admin Controller', 'admin@tournament.com', 'scrypt:32768:8:1$nC6tq2WJ1a8Y8vY1$3585ba056a0cf2dddbecb8bf09a632128a30bbff010a30b200b3e64f7b6cf9db0aa25d7b5f5bdcd3484f7ef993ea06b29cd16b8b0e782be1e7f09fbd6ae7428c', 'admin'),
(2, 'Akil Captain', 'user@tournament.com', 'scrypt:32768:8:1$K3k0N62L7N12pY4A$b586036ea2454a8684ad4db66099b22a00c7a3bd3bfef96ee977a4192b45cfc1d8ad2caec0b66b26cf941c9b60bcfd9cb8f9d6c449db171f11e99a80e1a1bd7c', 'user'),
(3, 'John Smith', 'john@tournament.com', 'scrypt:32768:8:1$K3k0N62L7N12pY4A$b586036ea2454a8684ad4db66099b22a00c7a3bd3bfef96ee977a4192b45cfc1d8ad2caec0b66b26cf941c9b60bcfd9cb8f9d6c449db171f11e99a80e1a1bd7c', 'user'),
(4, 'Sarah Connor', 'sarah@tournament.com', 'scrypt:32768:8:1$K3k0N62L7N12pY4A$b586036ea2454a8684ad4db66099b22a00c7a3bd3bfef96ee977a4192b45cfc1d8ad2caec0b66b26cf941c9b60bcfd9cb8f9d6c449db171f11e99a80e1a1bd7c', 'user');

INSERT INTO `tournaments` (`id`, `name`, `sport`, `location`, `start_date`, `end_date`, `max_teams`, `status`) VALUES
(1, 'College Football Championship', 'Football', 'Main Sports Complex Arena', '2026-09-01', '2026-09-10', 8, 'Upcoming'),
(2, 'Inter College Cricket Cup', 'Cricket', 'University Oval Field', '2026-08-25', '2026-09-05', 8, 'Ongoing'),
(3, 'E-Sports Championship', 'Valorant / Gaming', 'Student Union Tech Lounge', '2026-08-10', '2026-08-15', 4, 'Completed');

INSERT INTO `teams` (`id`, `team_name`, `captain`, `sport`, `user_id`) VALUES
(1, 'Thunder Strikers', 'Akil Captain', 'Football', 2),
(2, 'Cyber Warriors', 'Akil Captain', 'Valorant / Gaming', 2),
(3, 'Titan Strikers', 'John Smith', 'Football', 3),
(4, 'Phoenix Knights', 'Sarah Connor', 'Cricket', 4);

INSERT INTO `registrations` (`id`, `tournament_id`, `team_id`, `status`) VALUES
(1, 1, 1, 'Approved'),
(2, 1, 3, 'Approved'),
(3, 2, 4, 'Approved'),
(4, 3, 2, 'Approved');

INSERT INTO `matches` (`id`, `tournament_id`, `team1_id`, `team2_id`, `match_date`, `match_time`, `venue`, `score1`, `score2`, `winner_id`, `status`, `stream_url`, `round_number`) VALUES
(1, 1, 1, 3, '2026-09-02', '15:00', 'Stadium Court A', 0, 0, NULL, 'Upcoming', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 1),
(2, 3, 2, 2, '2026-08-12', '18:00', 'Tech Arena Center', 2, 1, 2, 'Completed', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 1);
