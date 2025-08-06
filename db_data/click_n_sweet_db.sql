-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: clicknsweet.cbg6e2as24hp.us-east-2.rds.amazonaws.com    Database: click_n_sweet
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '';

--
-- Table structure for table `address`
--

DROP TABLE IF EXISTS `address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `address` (
  `Address_ID` int NOT NULL AUTO_INCREMENT,
  `User_ID` int NOT NULL,
  `Address` varchar(255) NOT NULL,
  `City` varchar(100) NOT NULL,
  `Region` varchar(100) DEFAULT NULL,
  `Country` varchar(100) NOT NULL,
  `Type_address` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`Address_ID`),
  KEY `User_ID` (`User_ID`),
  CONSTRAINT `address_ibfk_1` FOREIGN KEY (`User_ID`) REFERENCES `user` (`User_ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `address`
--

LOCK TABLES `address` WRITE;
/*!40000 ALTER TABLE `address` DISABLE KEYS */;
INSERT INTO `address` VALUES (1,1,'Calle Magnolia 123','Xochimilco','Sur','México','Residencial'),(2,2,'Av. Reforma 456','CDMX','Centro','México','Oficina'),(3,3,'Camino Real 789','Toluca','Poniente','México','Entrega'),(4,4,'Boulevard del Lago 321','Puebla','Oriente','México','Facturación'),(5,5,'Circuito Roma 654','Querétaro','Norte','México','Residencial');
/*!40000 ALTER TABLE `address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cards`
--

DROP TABLE IF EXISTS `cards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cards` (
  `Card_ID` int NOT NULL AUTO_INCREMENT,
  `User_ID` int NOT NULL,
  `Number_Card` varchar(255) NOT NULL,
  `Expiration_date` varchar(7) NOT NULL,
  `CVV` varchar(4) NOT NULL,
  PRIMARY KEY (`Card_ID`),
  KEY `User_ID` (`User_ID`),
  CONSTRAINT `cards_ibfk_1` FOREIGN KEY (`User_ID`) REFERENCES `user` (`User_ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cards`
--

LOCK TABLES `cards` WRITE;
/*!40000 ALTER TABLE `cards` DISABLE KEYS */;
INSERT INTO `cards` VALUES (1,1,'411','12/27','123'),(2,2,'422','11/26','456'),(3,3,'4333','10/25','789'),(4,4,'444','09/28','321'),(5,5,'4555','08/29','654');
/*!40000 ALTER TABLE `cards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `Cart_Items_ID` int NOT NULL AUTO_INCREMENT,
  `Cart_ID` int NOT NULL,
  `Product_ID` int NOT NULL,
  `Quantity` int NOT NULL DEFAULT '1',
  `Created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Cart_Items_ID`),
  UNIQUE KEY `Cart_ID` (`Cart_ID`,`Product_ID`),
  KEY `Product_ID` (`Product_ID`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`Cart_ID`) REFERENCES `carts` (`Cart_ID`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`Product_ID`) REFERENCES `products` (`Product_ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
INSERT INTO `cart_items` VALUES (6,1,1,1,'2025-08-01 17:18:34'),(7,2,2,2,'2025-08-01 17:18:34'),(8,3,3,2,'2025-08-01 17:18:34'),(9,4,4,1,'2025-08-01 17:18:34'),(10,5,5,2,'2025-08-01 17:18:34');
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `Cart_ID` int NOT NULL AUTO_INCREMENT,
  `User_ID` int NOT NULL,
  PRIMARY KEY (`Cart_ID`),
  UNIQUE KEY `User_ID` (`User_ID`),
  CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`User_ID`) REFERENCES `user` (`User_ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES (1,1),(2,2),(3,3),(4,4),(5,5);
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `Category_ID` int NOT NULL AUTO_INCREMENT,
  `Category_name` varchar(100) NOT NULL,
  PRIMARY KEY (`Category_ID`),
  UNIQUE KEY `Category_name` (`Category_name`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (9,'Ácidos'),(4,'Caramelo'),(1,'Chocolates'),(7,'Cremosos'),(8,'Especiados'),(2,'Frutales'),(3,'Picantes'),(5,'Refrescantes'),(6,'Salados');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments_reviews`
--

DROP TABLE IF EXISTS `comments_reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments_reviews` (
  `Comment_Review_ID` int NOT NULL AUTO_INCREMENT,
  `Product_ID` int NOT NULL,
  `User_ID` int NOT NULL,
  `Rating` tinyint NOT NULL,
  `Comment_detail` text,
  `Comment_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Comment_Review_ID`),
  KEY `Product_ID` (`Product_ID`),
  KEY `User_ID` (`User_ID`),
  CONSTRAINT `comments_reviews_ibfk_1` FOREIGN KEY (`Product_ID`) REFERENCES `products` (`Product_ID`) ON DELETE CASCADE,
  CONSTRAINT `comments_reviews_ibfk_2` FOREIGN KEY (`User_ID`) REFERENCES `user` (`User_ID`) ON DELETE CASCADE,
  CONSTRAINT `comments_reviews_chk_1` CHECK (((`Rating` >= 1) and (`Rating` <= 5)))
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments_reviews`
--

LOCK TABLES `comments_reviews` WRITE;
/*!40000 ALTER TABLE `comments_reviews` DISABLE KEYS */;
INSERT INTO `comments_reviews` VALUES (1,1,1,5,'Excelente producto, superó mis expectativas.','2025-08-01 17:21:27'),(2,2,3,4,'Buena calidad, aunque el empaque llegó dañado.','2025-08-01 17:21:27'),(3,3,2,3,'Cumple con lo básico, pero esperaba más.','2025-08-01 17:21:27'),(4,4,4,2,'No me gustó tanto, se siente frágil.','2025-08-01 17:21:27'),(5,5,5,1,'Muy mala experiencia, llegó roto.','2025-08-01 17:21:27');
/*!40000 ALTER TABLE `comments_reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `countries`
--

DROP TABLE IF EXISTS `countries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `countries` (
  `Country_ID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) NOT NULL,
  `Latitude` decimal(10,8) DEFAULT NULL,
  `Longitude` decimal(11,8) DEFAULT NULL,
  PRIMARY KEY (`Country_ID`),
  UNIQUE KEY `Name` (`Name`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `countries`
--

LOCK TABLES `countries` WRITE;
/*!40000 ALTER TABLE `countries` DISABLE KEYS */;
INSERT INTO `countries` VALUES (1,'China',39.90420000,116.40740000),(2,'México',19.43260000,-99.13320000),(3,'Turquía',39.93340000,32.86630000),(4,'Japón',35.68950000,139.69170000),(5,'Portugal',38.72230000,-9.13930000),(6,'Uruguay',-34.90110000,-56.16450000),(7,'Argentina',-34.60370000,-58.38160000);
/*!40000 ALTER TABLE `countries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order` (
  `Order_ID` int NOT NULL AUTO_INCREMENT,
  `User_ID` int NOT NULL,
  `Shipping_Address_ID` int NOT NULL,
  `Status` varchar(50) NOT NULL DEFAULT 'pending',
  `Total_Amount` decimal(10,2) NOT NULL,
  `Tracking_Number` varchar(100) DEFAULT NULL,
  `Shipping_Carrier` varchar(100) DEFAULT NULL,
  `Created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Order_ID`),
  KEY `User_ID` (`User_ID`),
  KEY `Shipping_Address_ID` (`Shipping_Address_ID`),
  CONSTRAINT `order_ibfk_1` FOREIGN KEY (`User_ID`) REFERENCES `user` (`User_ID`) ON DELETE RESTRICT,
  CONSTRAINT `order_ibfk_2` FOREIGN KEY (`Shipping_Address_ID`) REFERENCES `address` (`Address_ID`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order`
--

LOCK TABLES `order` WRITE;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
INSERT INTO `order` VALUES (1,1,1,'delivered',39.98,'TRK123456789','FedEx','2025-08-01 17:23:40'),(2,2,2,'delivered',49.99,'TRK987654321','UPS','2025-08-01 17:23:40'),(3,3,3,'delivered',45.00,'TRK111222333','DHL','2025-08-01 17:23:40'),(4,4,4,'pending',19.99,NULL,NULL,'2025-08-01 17:23:40'),(5,5,5,'pending',50.00,NULL,NULL,'2025-08-01 17:23:40');
/*!40000 ALTER TABLE `order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_lines`
--

DROP TABLE IF EXISTS `order_lines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_lines` (
  `Order_lines_ID` int NOT NULL AUTO_INCREMENT,
  `Order_ID` int NOT NULL,
  `Product_ID` int NOT NULL,
  `Quantity` int NOT NULL,
  `Price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`Order_lines_ID`),
  KEY `Order_ID` (`Order_ID`),
  KEY `Product_ID` (`Product_ID`),
  CONSTRAINT `order_lines_ibfk_1` FOREIGN KEY (`Order_ID`) REFERENCES `order` (`Order_ID`) ON DELETE CASCADE,
  CONSTRAINT `order_lines_ibfk_2` FOREIGN KEY (`Product_ID`) REFERENCES `products` (`Product_ID`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_lines`
--

LOCK TABLES `order_lines` WRITE;
/*!40000 ALTER TABLE `order_lines` DISABLE KEYS */;
INSERT INTO `order_lines` VALUES (1,1,1,2,19.99),(2,2,2,1,49.99),(3,3,3,3,15.00),(4,4,4,1,19.99),(5,5,5,5,10.00);
/*!40000 ALTER TABLE `order_lines` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `Product_ID` int NOT NULL AUTO_INCREMENT,
  `Product_name` varchar(150) NOT NULL,
  `SKU` varchar(100) DEFAULT NULL,
  `Description` text,
  `Picture` varchar(255) DEFAULT NULL,
  `Price` decimal(10,2) NOT NULL,
  `Sales_Format_ID` int DEFAULT NULL,
  `Supplier_Cost` decimal(10,2) DEFAULT NULL,
  `Quantity_Stock` int NOT NULL DEFAULT '0',
  `Weight` decimal(10,2) NOT NULL DEFAULT '0.00',
  `Length` decimal(10,2) NOT NULL DEFAULT '0.00',
  `Width` decimal(10,2) NOT NULL DEFAULT '0.00',
  `Height` decimal(10,2) NOT NULL DEFAULT '0.00',
  `Status` tinyint(1) NOT NULL DEFAULT '1',
  `Low_stock_threshold` int NOT NULL DEFAULT '10',
  `Allow_backorders` tinyint(1) NOT NULL DEFAULT '0',
  `Average_rating` decimal(3,2) DEFAULT '0.00',
  `Discount_type` varchar(50) DEFAULT NULL,
  `Discount_value` decimal(10,2) DEFAULT NULL,
  `Category_ID` int DEFAULT NULL,
  `Origin_Country_ID` int DEFAULT NULL,
  `Origin_State_ID` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Product_ID`),
  UNIQUE KEY `SKU` (`SKU`),
  KEY `Category_ID` (`Category_ID`),
  KEY `Origin_Country_ID` (`Origin_Country_ID`),
  KEY `Origin_State_ID` (`Origin_State_ID`),
  KEY `fk_products_sales_format` (`Sales_Format_ID`),
  CONSTRAINT `fk_products_sales_format` FOREIGN KEY (`Sales_Format_ID`) REFERENCES `sales_format` (`Sales_Format_ID`) ON DELETE SET NULL,
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`Category_ID`) REFERENCES `categories` (`Category_ID`) ON DELETE SET NULL,
  CONSTRAINT `products_ibfk_2` FOREIGN KEY (`Origin_Country_ID`) REFERENCES `countries` (`Country_ID`) ON DELETE SET NULL,
  CONSTRAINT `products_ibfk_3` FOREIGN KEY (`Origin_State_ID`) REFERENCES `states` (`State_ID`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Mooncake (Pastel de Luna)','CLNSWT-001','Un pastel tradicional chino consumido durante el Festival del Medio Otoño...','https://luisalzrgcia.github.io/ClickNSweet/assets/products-img/pastel-de-luna-china-1.jpg',180.00,1,99.00,80,0.75,20.00,20.00,5.00,1,10,0,4.00,'percentage',15.00,7,1,NULL,'2025-08-01 17:17:02','2025-08-01 17:17:02'),(2,'Jamoncillo de Leche Quemada','CLNSWT-002','Un dulce típico de Puebla, elaborado a base de leche y azúcar...','https://luisalzrgcia.github.io/ClickNSweet/assets/products-img/jamoncillos-de-dulce-de-leche-1.jpg',35.00,1,19.25,150,0.25,15.00,8.00,3.00,1,15,0,4.00,NULL,0.00,7,2,1,'2025-08-01 17:17:02','2025-08-01 17:17:02'),(3,'Delicia Turca (Lokum) de Pistacho y Granada','CLNSWT-003','Una versión premium y llena de sabor...','https://luisalzrgcia.github.io/ClickNSweet/assets/products-img/delicias-turcas-1.jpeg',220.00,1,121.00,0,0.50,18.00,12.00,4.00,0,10,1,5.00,'percentage',40.00,2,3,NULL,'2025-08-01 17:17:02','2025-08-01 17:17:02'),(4,'Turrón Rosa','CLNSWT-004','Un dulce artesanal mexicano icónico...','https://luisalzrgcia.github.io/ClickNSweet/assets/products-img/turron-rosa-1.jpg',25.00,1,13.75,200,0.15,20.00,10.00,5.00,1,20,0,3.00,NULL,0.00,7,2,2,'2025-08-01 17:17:02','2025-08-01 17:17:02'),(5,'Mochi Japonés (Daifuku)','CLNSWT-005','Un postre japonés icónico hecho de mochigome...','https://luisalzrgcia.github.io/ClickNSweet/assets/products-img/mochis-japones-1.jpg',50.00,1,27.50,120,0.20,12.00,12.00,4.00,1,10,0,4.00,NULL,0.00,7,4,NULL,'2025-08-01 17:17:02','2025-08-01 17:17:02'),(6,'Coricos de Sinaloa','CLNSWT-006','Galletas artesanales en forma de rosquilla...','https://luisalzrgcia.github.io/ClickNSweet/assets/products-img/coricos-sinaloa-1.jpg',65.00,1,35.75,180,0.30,15.00,15.00,6.00,1,15,0,4.00,'percentage',15.00,6,2,3,'2025-08-01 17:17:02','2025-08-01 17:17:02'),(7,'Pastel de Nata','CLNSWT-007','Una icónica tarta pequeña originaria de Portugal...','https://luisalzrgcia.github.io/ClickNSweet/assets/products-img/pastel-de-nata-portugal-1.png',45.00,1,24.75,100,0.18,10.00,10.00,3.00,1,10,0,4.00,'percentage',10.00,7,5,NULL,'2025-08-01 17:17:02','2025-08-01 17:17:02'),(8,'Mestiza de Michoacán','CLNSWT-008','Dulce artesanal típico de Michoacán...','https://luisalzrgcia.github.io/ClickNSweet/assets/products-img/mestiza-michoacan.png',40.00,1,22.00,130,0.22,16.00,7.00,3.00,1,15,0,4.00,NULL,0.00,7,2,4,'2025-08-01 17:17:02','2025-08-01 17:17:02'),(9,'Camote de Puebla','CLNSWT-009','Un dulce emblemático del estado de Puebla...','https://luisalzrgcia.github.io/ClickNSweet/assets/products-img/camote-poblano-1.jpg',25.00,1,13.75,250,0.10,15.00,3.00,3.00,1,20,0,3.00,NULL,0.00,2,2,1,'2025-08-01 17:17:02','2025-08-01 17:17:02'),(10,'Alfajor de Maicena','CLNSWT-010','Un dulce icónico en varios países de Sudamérica...','https://luisalzrgcia.github.io/ClickNSweet/assets/products-img/alfajores-maicena-urugay-1.jpg',35.00,1,19.25,110,0.28,14.00,10.00,5.00,1,10,0,4.00,NULL,0.00,7,6,NULL,'2025-08-01 17:17:02','2025-08-01 17:17:02');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `Role_ID` int NOT NULL AUTO_INCREMENT,
  `Role_type` varchar(50) NOT NULL,
  PRIMARY KEY (`Role_ID`),
  UNIQUE KEY `Role_type` (`Role_type`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (2,'admin'),(1,'customer');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales_format`
--

DROP TABLE IF EXISTS `sales_format`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales_format` (
  `Sales_Format_ID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) NOT NULL,
  PRIMARY KEY (`Sales_Format_ID`),
  UNIQUE KEY `Name` (`Name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_format`
--

LOCK TABLES `sales_format` WRITE;
/*!40000 ALTER TABLE `sales_format` DISABLE KEYS */;
INSERT INTO `sales_format` VALUES (1,'Por paquete'),(2,'Por paquete de 12 pzas'),(3,'Por pieza');
/*!40000 ALTER TABLE `sales_format` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `states`
--

DROP TABLE IF EXISTS `states`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `states` (
  `State_ID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) NOT NULL,
  `Latitude` decimal(10,8) DEFAULT NULL,
  `Longitude` decimal(11,8) DEFAULT NULL,
  `Country_ID` int NOT NULL,
  PRIMARY KEY (`State_ID`),
  KEY `Country_ID` (`Country_ID`),
  CONSTRAINT `states_ibfk_1` FOREIGN KEY (`Country_ID`) REFERENCES `countries` (`Country_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `states`
--

LOCK TABLES `states` WRITE;
/*!40000 ALTER TABLE `states` DISABLE KEYS */;
INSERT INTO `states` VALUES (1,'Puebla',19.04140000,-98.20630000,2),(2,'Centro de México',19.43260000,-99.13320000,2),(3,'Sinaloa',24.80930000,-107.39370000,2),(4,'Michoacán',19.70240000,-101.19230000,2);
/*!40000 ALTER TABLE `states` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `User_ID` int NOT NULL AUTO_INCREMENT,
  `First_name` varchar(50) NOT NULL,
  `Last_name` varchar(50) NOT NULL,
  `Username` varchar(50) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Photo` varchar(255) DEFAULT NULL,
  `Password` varchar(255) NOT NULL,
  `Last_Login` timestamp NULL DEFAULT NULL,
  `Created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `Updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Phone` varchar(20) DEFAULT NULL,
  `Role_ID` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`User_ID`),
  UNIQUE KEY `Username` (`Username`),
  UNIQUE KEY `Email` (`Email`),
  KEY `fk_user_role` (`Role_ID`),
  CONSTRAINT `fk_user_role` FOREIGN KEY (`Role_ID`) REFERENCES `roles` (`Role_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'María','López','marialopez','maria@example.com','maria.jpg','hashed_password1',NULL,'2025-07-31 18:03:32','2025-07-31 18:03:32','5551234567',1),(2,'Juan','Pérez','juanp','juan@example.com','juan.png','hashed_password2',NULL,'2025-07-31 18:03:32','2025-07-31 18:03:32','5552345678',1),(3,'Ana','Torres','anatorres','ana@example.com',NULL,'hashed_password3',NULL,'2025-07-31 18:03:32','2025-07-31 18:03:32',NULL,1),(4,'Luis','Martínez','luismtz','luis@example.com','luis.jpg','hashed_password4',NULL,'2025-07-31 18:03:32','2025-07-31 18:03:32','5553456789',1),(5,'Sofía','García','sofiag','sofia@example.com',NULL,'hashed_password5',NULL,'2025-07-31 18:03:32','2025-07-31 18:03:32','5554567890',1),(6,'Admin','ClickNSweet','admin','admin@clicknsweet.com',NULL,'admin1223',NULL,'2025-07-31 18:03:32','2025-07-31 18:03:32',NULL,2);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-04 16:25:40
