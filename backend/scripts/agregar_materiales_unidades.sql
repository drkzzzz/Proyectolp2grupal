-- ============================================
-- Script: Agregar tablas Materiales y Unidades de Medida
-- Propó sito: Crear tablas para catálogo de materiales y unidades
-- Fecha: 2025-12-10
-- ============================================

USE tapstyle;

-- ==================================================================
-- TABLA: materialesproducto
-- ==================================================================

CREATE TABLE `materialesproducto` (
  `id_material` int(11) NOT NULL AUTO_INCREMENT,
  `id_empresa` int(11) NOT NULL,
  `nombre_material` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_material`),
  KEY `fk_material_empresa` (`id_empresa`),
  CONSTRAINT `fk_material_empresa` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Datos de ejemplo
INSERT INTO `materialesproducto` (`id_material`, `id_empresa`, `nombre_material`, `descripcion`) VALUES
(1, 122, 'Cuero Genuino', 'Material de cuero natural de alta calidad'),
(2, 122, 'Cuero Sintético', 'Cuero artificial duradero'),
(3, 122, 'Textil', 'Tela transpirable para calzado deportivo'),
(4, 122, 'Goma', 'Material para suelas resistente al desgaste');

-- ==================================================================
-- TABLA: unidadesmedida
-- ==================================================================

CREATE TABLE `unidadesmedida` (
  `id_unidad` int(11) NOT NULL AUTO_INCREMENT,
  `id_empresa` int(11) NOT NULL,
  `nombre_unidad` varchar(50) NOT NULL,
  `abreviatura` varchar(10) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_unidad`),
  KEY `fk_unidad_empresa` (`id_empresa`),
  CONSTRAINT `fk_unidad_empresa` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Datos de ejemplo
INSERT INTO `unidadesmedida` (`id_unidad`, `id_empresa`, `nombre_unidad`, `abreviatura`, `descripcion`) VALUES
(1, 122, 'Unidad', 'UND', 'Unidad individual de producto'),
(2, 122, 'Par', 'PAR', 'Par de zapatos'),
(3, 122, 'Caja', 'CAJ', 'Caja contenedora'),
(4, 122, 'Docena', 'DOC', '12 unidades');

-- ============================================
-- Fin del Script
-- ============================================
