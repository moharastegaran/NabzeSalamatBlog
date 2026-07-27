-- MySQL dump 10.13  Distrib 8.4.9, for Linux (x86_64)
--
-- Host: localhost    Database: nabzesalamat_db
-- ------------------------------------------------------
-- Server version	8.4.9

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `nabzesalamat_db`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `nabzesalamat_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;

USE `nabzesalamat_db`;

--
-- Table structure for table `ad_banners`
--

DROP TABLE IF EXISTS `ad_banners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ad_banners` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `external_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `locations` json NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `active_from` datetime DEFAULT NULL,
  `active_until` datetime DEFAULT NULL,
  `sort_order` smallint unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ad_banners`
--

LOCK TABLES `ad_banners` WRITE;
/*!40000 ALTER TABLE `ad_banners` DISABLE KEYS */;
INSERT INTO `ad_banners` VALUES (1,'آموزش زبان لینگانو','ad-banners/VunlhW5CvoAaObDTfHFax6D1GQUi1gmsdyAZzKbs.jpg',NULL,'[\"landing\"]',1,NULL,NULL,0,'2026-06-22 13:48:02','2026-06-22 13:48:02'),(2,'بردن آیفون با جام','ad-banners/eKz1gnPjNcsN40hd2i2C2x29A6hT8XrSrVojD4au.gif',NULL,'[\"landing\"]',1,NULL,NULL,0,'2026-06-22 13:48:26','2026-06-22 13:48:26');
/*!40000 ALTER TABLE `ad_banners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `announcement_user`
--

DROP TABLE IF EXISTS `announcement_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `announcement_user` (
  `announcement_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`announcement_id`,`user_id`),
  KEY `announcement_user_user_id_foreign` (`user_id`),
  CONSTRAINT `announcement_user_announcement_id_foreign` FOREIGN KEY (`announcement_id`) REFERENCES `announcements` (`id`) ON DELETE CASCADE,
  CONSTRAINT `announcement_user_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `announcement_user`
--

LOCK TABLES `announcement_user` WRITE;
/*!40000 ALTER TABLE `announcement_user` DISABLE KEYS */;
/*!40000 ALTER TABLE `announcement_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `announcements`
--

DROP TABLE IF EXISTS `announcements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `announcements` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `sent_by` bigint unsigned NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_urgent` tinyint(1) NOT NULL DEFAULT '0',
  `recalled_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `announcements_sent_by_foreign` (`sent_by`),
  CONSTRAINT `announcements_sent_by_foreign` FOREIGN KEY (`sent_by`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `announcements`
--

LOCK TABLES `announcements` WRITE;
/*!40000 ALTER TABLE `announcements` DISABLE KEYS */;
/*!40000 ALTER TABLE `announcements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assets`
--

DROP TABLE IF EXISTS `assets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assets` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `disk` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'public',
  `mime_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `size` bigint unsigned NOT NULL,
  `type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alt` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assets`
--

LOCK TABLES `assets` WRITE;
/*!40000 ALTER TABLE `assets` DISABLE KEYS */;
INSERT INTO `assets` VALUES (1,'پیرصالحی_1_crop','پیرصالحی_1_crop.jpg','assets/images/guaI3Ts2lcyAyLh8G2pWnt6hXviilzDWrsaUHc7e.jpg','public','image/jpeg',71354,'image',NULL,'2026-06-22 09:02:03','2026-06-22 09:02:03'),(2,'image','image.jpg','assets/images/IXi9LzJ1S80TrxdKlXwKGZ2CawjqrTkBh0zgtpxg.jpg','public','image/jpeg',157514,'image',NULL,'2026-06-22 14:45:00','2026-06-22 14:45:00'),(3,'MG_7117','MG_7117.jpg','assets/images/jmyenqrTrosJSrt1ZJrzZSlBC6PKQRDjWlU3xTTV.jpg','public','image/jpeg',111299,'image',NULL,'2026-06-22 14:45:40','2026-06-22 14:45:40'),(4,'6002540','6002540.jpg','assets/images/GLhZtJbgJew26WwepqjERUm11tLjwbZKhiYwD11g.jpg','public','image/jpeg',53759,'image',NULL,'2026-06-22 14:49:21','2026-06-22 14:49:21'),(5,'Artboard 2','Artboard 2.jpg','assets/images/8jKAZNcstAzfHuhWWa0wYwV9TYgwDOCqBbIZoW6K.jpg','public','image/jpeg',65841,'image',NULL,'2026-06-22 15:55:00','2026-06-22 15:55:00'),(6,'Artboard 21','Artboard 21.jpg','assets/images/KMGF8RrBK8XhQkmbmK7YMRkLD5I4jYIrUtnxy4mz.jpg','public','image/jpeg',64383,'image',NULL,'2026-06-22 15:58:53','2026-06-22 15:58:53'),(7,'نبض خبر','نبض خبر.jpg','assets/images/vhQDc14BB4PIgrrU4DCEQWVUzryUM82OLcHJFUez.jpg','public','image/jpeg',455272,'image',NULL,'2026-07-13 22:05:58','2026-07-13 22:05:58'),(8,'نبض دانش','نبض دانش.jpg','assets/images/KxeGmE7PqYt7UAMd5LpLIpCFkDWAaylGb7YnfZMz.jpg','public','image/jpeg',519599,'image',NULL,'2026-07-13 22:07:01','2026-07-13 22:07:01'),(9,'رویدادها','رویدادها.jpg','assets/images/pEHJtkjoCldkmvD5bb1eiE7ixY4sCye3dwyAlmVq.jpg','public','image/jpeg',532549,'image',NULL,'2026-07-13 22:07:07','2026-07-13 22:07:07'),(10,'نبض زندگی','نبض زندگی.jpg','assets/images/l61CDQf8UXlUiRi1e1T4RTLwfvk2Zns7dEag6Hzt.jpg','public','image/jpeg',375537,'image',NULL,'2026-07-13 22:07:12','2026-07-13 22:07:12'),(11,'نبض قانون','نبض قانون.jpg','assets/images/U90ieMTi01saSS4qYGr8UX1ixOl2Jg0zmc3FEHwQ.jpg','public','image/jpeg',217078,'image',NULL,'2026-07-13 22:07:21','2026-07-13 22:07:21'),(12,'نبض صدا','نبض صدا.jpg','assets/images/3l0bbRvrTcOCdymPpVQKktbgDPF3ENyQfKqPva7v.jpg','public','image/jpeg',339683,'image',NULL,'2026-07-13 22:07:26','2026-07-13 22:07:26'),(13,'نبض تحلیل','نبض تحلیل.jpg','assets/images/Mc5HYX9IcRUNC8ShZWl7IwwfPuUQ7dr43jv0hTMG.jpg','public','image/jpeg',288134,'image',NULL,'2026-07-13 22:07:31','2026-07-13 22:07:31'),(14,'نبض tv','نبض tv.jpg','assets/images/kIXwUW9Hy3dhZuQRHACKiHbSeK1BPSGJWrFEhHSD.jpg','public','image/jpeg',396973,'image',NULL,'2026-07-13 22:07:39','2026-07-13 22:07:39'),(15,'images','images.jpg','assets/images/oitJPaND200IKbD6uVAoNlWK1wB45UnXJ8RdMgn2.jpg','public','image/jpeg',37703,'image',NULL,'2026-07-13 23:47:47','2026-07-13 23:47:47');
/*!40000 ALTER TABLE `assets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blog_categories`
--

DROP TABLE IF EXISTS `blog_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blog_categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `parent_id` bigint unsigned DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `icon` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `thumbnail` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `blog_categories_slug_unique` (`slug`),
  KEY `blog_categories_parent_id_foreign` (`parent_id`),
  CONSTRAINT `blog_categories_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `blog_categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blog_categories`
--

LOCK TABLES `blog_categories` WRITE;
/*!40000 ALTER TABLE `blog_categories` DISABLE KEYS */;
INSERT INTO `blog_categories` VALUES (1,NULL,'نبض خبر','nabze-khabar','این بخش به پوشش سریع و به‌روز رویدادها و اخبار روز اختصاص دارد. مخاطب در اینجا تازه‌ترین تحولات را در کوتاه‌ترین زمان ممکن دنبال می‌کند.','blog-categories/icons/nabze-khabar.svg','assets/images/vhQDc14BB4PIgrrU4DCEQWVUzryUM82OLcHJFUez.jpg','2026-06-22 08:55:13','2026-07-13 22:06:01'),(2,NULL,'نبض دانش','nabze-danesh','این بخش به پوشش سریع و به‌روز رویدادها و اخبار روز اختصاص دارد. مخاطب در اینجا تازه‌ترین تحولات را در کوتاه‌ترین زمان ممکن دنبال می‌کند.','blog-categories/icons/nabze-danesh.svg','assets/images/KxeGmE7PqYt7UAMd5LpLIpCFkDWAaylGb7YnfZMz.jpg','2026-06-22 08:55:13','2026-07-13 22:07:51'),(3,NULL,'نبض قانون','nabze-ghanoon','محتوای این دسته به مسائل حقوقی، قوانین، آیین‌نامه‌ها و تغییرات قانونی مرتبط می‌پردازد. هدف، ساده‌سازی مفاهیم حقوقی برای فهم بهتر مخاطب عمومی است.','blog-categories/icons/nabze-ghanoon.svg','assets/images/U90ieMTi01saSS4qYGr8UX1ixOl2Jg0zmc3FEHwQ.jpg','2026-06-22 08:55:13','2026-07-13 22:08:00'),(4,NULL,'نبض زندگی','nabze-zendegi','این بخش موضوعات روزمره، سبک زندگی، سلامت و توصیه‌های کاربردی برای زندگی بهتر را پوشش می‌دهد. محتوایی نزدیک به دغدغه‌های شخصی و روزمره مخاطبان ارائه می‌شود.',NULL,'assets/images/l61CDQf8UXlUiRi1e1T4RTLwfvk2Zns7dEag6Hzt.jpg','2026-06-22 08:55:13','2026-07-13 22:08:29'),(5,NULL,'نبض تحلیل','nabze-tahlil','در این دسته، رویدادها و موضوعات مهم با نگاهی عمیق‌تر و تحلیلی بررسی می‌شوند. هدف، فراتر رفتن از گزارش خبری ساده و ارائه دیدگاه و زمینه‌های پشت ماجراست.','blog-categories/icons/nabze-tahlil.svg','assets/images/Mc5HYX9IcRUNC8ShZWl7IwwfPuUQ7dr43jv0hTMG.jpg','2026-06-22 08:55:13','2026-07-13 22:08:21'),(6,NULL,'نبض صدا','nabze-seda','این بخش به محتوای صوتی مانند پادکست‌، مصاحبه‌های شنیداری یا گزارش‌های صوتی اختصاص دارد. مخاطب می‌تواند محتوا را به‌جای خواندن، گوش دهد.','blog-categories/icons/nabze-seda.svg','assets/images/3l0bbRvrTcOCdymPpVQKktbgDPF3ENyQfKqPva7v.jpg','2026-06-22 08:55:13','2026-07-13 22:08:37'),(7,NULL,'نبض TV','nabze-tv','این دسته شامل محتوای ویدئویی، گزارش‌های تصویری و برنامه‌های ویدئویی وبلاگ است. مناسب کاربرانی است که ترجیح می‌دهند محتوا را به‌صورت بصری دنبال کنند.','blog-categories/icons/nabze-tv.svg','assets/images/kIXwUW9Hy3dhZuQRHACKiHbSeK1BPSGJWrFEhHSD.jpg','2026-06-22 08:55:13','2026-07-13 22:08:47'),(8,NULL,'رویدادها','event','این بخش به معرفی و اطلاع‌رسانی رویدادها، همایش‌ها و برنامه‌های آینده یا گذشته اختصاص دارد. مخاطب می‌تواند از زمان، مکان و جزئیات برگزاری رویدادهای مرتبط مطلع شود.',NULL,'assets/images/pEHJtkjoCldkmvD5bb1eiE7ixY4sCye3dwyAlmVq.jpg','2026-06-22 08:55:13','2026-07-13 22:08:11'),(9,1,'اخبار فوری','breaking-news',NULL,NULL,NULL,'2026-06-22 08:55:13','2026-06-22 08:55:13'),(10,1,'گفت و گو','conversations1',NULL,NULL,NULL,'2026-06-22 08:55:13','2026-07-13 22:11:34'),(11,1,'صنعت دارو','med-field',NULL,NULL,NULL,'2026-06-22 08:55:13','2026-06-22 08:55:13'),(12,1,'تجهیزات پزشکی','med-tools',NULL,NULL,NULL,'2026-06-22 08:55:13','2026-06-22 08:55:13'),(13,1,'سازمان غذا و دارو','med-gov',NULL,NULL,NULL,'2026-06-22 08:55:13','2026-06-22 08:55:13'),(14,1,'وزارت بهداشت، درمان و آموزش پزشکی','hygiene-gov',NULL,NULL,NULL,'2026-06-22 08:55:13','2026-06-22 08:55:13'),(15,1,'سازمان نظام پزشکی','cure-gov',NULL,NULL,NULL,'2026-06-22 08:55:13','2026-06-22 08:55:13'),(16,1,'سازمان‌های بیمه‌گر','insurance-gov',NULL,NULL,NULL,'2026-06-22 08:55:13','2026-06-22 08:55:13'),(17,1,'اقتصاد و بازار','ecommerce',NULL,NULL,NULL,'2026-06-22 08:55:13','2026-06-22 08:55:13'),(18,1,'گزارش ویژه','special-report',NULL,NULL,NULL,'2026-06-22 08:55:13','2026-06-22 08:55:13'),(19,3,'تحلیل حقوقی','legal-analysis',NULL,NULL,NULL,'2026-06-22 08:55:13','2026-06-22 08:55:13'),(20,3,'لغات حقوقی','legal-terms',NULL,NULL,NULL,'2026-06-22 08:55:13','2026-06-22 08:55:13'),(21,3,'قوانین و مقررات','laws-and-rules',NULL,NULL,NULL,'2026-06-22 08:55:13','2026-06-22 08:55:13'),(22,3,'بخشنامه‌ها و قوانین','constitutions',NULL,NULL,NULL,'2026-06-22 08:55:13','2026-06-22 08:55:13'),(23,3,'مالیات داروخانه‌ها','pharmacy-fee',NULL,NULL,NULL,'2026-06-22 08:55:13','2026-06-22 08:55:13'),(24,3,'لغات مالی','financial-terms',NULL,NULL,NULL,'2026-06-22 08:55:13','2026-06-22 08:55:13'),(25,3,'اداری و پرونده‌ها','documentary',NULL,NULL,NULL,'2026-06-22 08:55:13','2026-06-22 08:55:13'),(26,2,'آموزش','educational',NULL,NULL,NULL,'2026-06-22 08:55:13','2026-06-22 08:55:13'),(27,2,'مقالات','articles',NULL,NULL,NULL,'2026-06-22 08:55:13','2026-06-22 08:55:13'),(28,2,'یادداشت','notes',NULL,NULL,NULL,'2026-06-22 08:55:13','2026-06-22 08:55:13'),(29,2,'هوش مصنوعی','artificial-intelligence',NULL,NULL,NULL,'2026-06-22 08:55:13','2026-06-22 08:55:13'),(30,2,'فناوری سلامت','health-tech',NULL,NULL,NULL,'2026-06-22 08:55:13','2026-06-22 08:55:13'),(31,2,'نوآوری','innovation',NULL,NULL,NULL,'2026-06-22 08:55:13','2026-06-22 08:55:13'),(32,2,'تحلیل','analysis',NULL,NULL,NULL,'2026-06-22 08:55:13','2026-06-22 08:55:13'),(33,2,'مرور پژوهشی','research-review',NULL,NULL,NULL,'2026-06-22 08:55:13','2026-06-22 08:55:13'),(34,2,'ترجمه','translation',NULL,NULL,NULL,'2026-06-22 08:55:13','2026-06-22 08:55:13'),(35,4,'سبک زندگی سالم','life-style',NULL,NULL,NULL,'2026-06-22 08:55:13','2026-06-22 08:55:13'),(36,4,'سلامت روان','mental-health',NULL,NULL,NULL,'2026-06-22 08:55:13','2026-06-22 08:55:13'),(37,4,'دانستی‌های دارویی و پزشکی','medical-knowledge',NULL,NULL,NULL,'2026-06-22 08:55:13','2026-06-22 08:55:13'),(38,6,'پادکست','podcasts',NULL,NULL,NULL,'2026-06-22 08:55:13','2026-06-22 08:55:13'),(39,6,'گفت و گو','conversations2',NULL,NULL,NULL,'2026-06-22 08:55:13','2026-07-13 22:11:52'),(40,6,'میز گرد','table',NULL,NULL,NULL,'2026-06-22 08:55:13','2026-06-22 08:55:13'),(41,6,'فایل صوتی','audiofile',NULL,NULL,NULL,'2026-06-22 08:55:13','2026-06-22 08:55:13'),(42,8,'سمینار','seminar',NULL,NULL,NULL,'2026-06-22 08:55:13','2026-06-22 08:55:13'),(43,8,'کنفرانس','conference',NULL,NULL,NULL,'2026-06-22 08:55:13','2026-06-22 08:55:13'),(44,8,'سمپوزیوم','samposium',NULL,NULL,NULL,'2026-06-22 08:55:13','2026-06-22 08:55:13'),(45,8,'نشست خبری','press-conference',NULL,NULL,NULL,'2026-06-22 08:55:13','2026-06-22 08:55:13');
/*!40000 ALTER TABLE `blog_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blog_comments`
--

DROP TABLE IF EXISTS `blog_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blog_comments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `blog_post_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `body` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_approved` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `blog_comments_blog_post_id_foreign` (`blog_post_id`),
  CONSTRAINT `blog_comments_blog_post_id_foreign` FOREIGN KEY (`blog_post_id`) REFERENCES `blog_posts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blog_comments`
--

LOCK TABLES `blog_comments` WRITE;
/*!40000 ALTER TABLE `blog_comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `blog_comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blog_post_categories`
--

DROP TABLE IF EXISTS `blog_post_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blog_post_categories` (
  `blog_post_id` bigint unsigned NOT NULL,
  `blog_category_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`blog_post_id`,`blog_category_id`),
  KEY `blog_post_categories_blog_category_id_foreign` (`blog_category_id`),
  CONSTRAINT `blog_post_categories_blog_category_id_foreign` FOREIGN KEY (`blog_category_id`) REFERENCES `blog_categories` (`id`) ON DELETE CASCADE,
  CONSTRAINT `blog_post_categories_blog_post_id_foreign` FOREIGN KEY (`blog_post_id`) REFERENCES `blog_posts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blog_post_categories`
--

LOCK TABLES `blog_post_categories` WRITE;
/*!40000 ALTER TABLE `blog_post_categories` DISABLE KEYS */;
INSERT INTO `blog_post_categories` VALUES (1,1),(2,1),(4,1),(5,1),(30,1),(7,2),(8,2),(9,2),(10,2),(11,2),(12,2),(13,3),(14,3),(15,3),(16,3),(17,3),(19,4),(20,4),(21,4),(22,5),(23,5),(24,5),(3,6),(6,6),(25,6),(26,6),(27,6),(18,7),(28,7),(29,8),(31,8),(32,8),(1,11),(2,13),(30,13),(4,16),(5,17),(13,19),(14,21),(15,22),(16,23),(17,25),(7,26),(8,29),(9,30),(10,31),(11,32),(12,33),(21,35),(19,36),(20,37),(25,38),(26,39),(3,40),(6,40),(27,40),(29,42),(32,42),(31,44);
/*!40000 ALTER TABLE `blog_post_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blog_post_tag`
--

DROP TABLE IF EXISTS `blog_post_tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blog_post_tag` (
  `blog_post_id` bigint unsigned NOT NULL,
  `blog_tag_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`blog_post_id`,`blog_tag_id`),
  KEY `blog_post_tag_blog_tag_id_foreign` (`blog_tag_id`),
  CONSTRAINT `blog_post_tag_blog_post_id_foreign` FOREIGN KEY (`blog_post_id`) REFERENCES `blog_posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `blog_post_tag_blog_tag_id_foreign` FOREIGN KEY (`blog_tag_id`) REFERENCES `blog_tags` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blog_post_tag`
--

LOCK TABLES `blog_post_tag` WRITE;
/*!40000 ALTER TABLE `blog_post_tag` DISABLE KEYS */;
INSERT INTO `blog_post_tag` VALUES (1,1),(2,1),(7,1),(12,1),(20,1),(24,1),(25,1),(28,1),(29,1),(11,3),(12,4),(5,5),(6,5),(13,5),(6,6),(3,7),(14,7),(16,7),(20,7),(7,9),(28,9),(7,10),(28,10),(29,10),(2,11),(15,11),(17,11),(3,12),(3,13),(4,13),(27,13),(2,14),(4,14),(16,14),(14,15),(15,15),(17,15),(13,16),(17,16),(13,17),(14,17),(15,17),(16,17),(18,18),(19,18),(21,18),(30,18),(18,19),(18,20),(21,20),(19,21),(19,22),(21,22),(20,23),(30,24),(8,25),(9,25),(9,26),(8,27),(9,27),(10,27),(10,28),(1,29),(8,29),(10,29),(24,29),(1,30),(4,30),(22,30),(23,30),(26,30),(5,31),(23,31),(5,32),(23,32),(11,33),(22,33),(25,34),(26,34),(27,34),(6,35),(30,35),(11,36),(22,36),(24,36),(12,37),(29,38),(30,39);
/*!40000 ALTER TABLE `blog_post_tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blog_post_views`
--

DROP TABLE IF EXISTS `blog_post_views`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blog_post_views` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `post_id` bigint unsigned NOT NULL,
  `view_count` int unsigned NOT NULL DEFAULT '1',
  `token` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `referrer_domain` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `utm_source` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `utm_medium` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `device_type` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reading_seconds` smallint unsigned DEFAULT NULL,
  `viewed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `blog_post_views_token_unique` (`token`),
  KEY `blog_post_views_post_id_viewed_at_index` (`post_id`,`viewed_at`),
  KEY `blog_post_views_viewed_at_index` (`viewed_at`),
  KEY `blog_post_views_referrer_domain_index` (`referrer_domain`),
  KEY `blog_post_views_token_index` (`token`),
  CONSTRAINT `blog_post_views_post_id_foreign` FOREIGN KEY (`post_id`) REFERENCES `blog_posts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blog_post_views`
--

LOCK TABLES `blog_post_views` WRITE;
/*!40000 ALTER TABLE `blog_post_views` DISABLE KEYS */;
INSERT INTO `blog_post_views` VALUES (1,30,1,'93098d0d-15a7-400d-b1b9-99e572b995d4',NULL,NULL,NULL,'desktop',NULL,'2026-06-22 09:05:00'),(2,1,1,'28121305-70d9-4e26-b831-fcd2a59822be',NULL,NULL,NULL,'desktop',NULL,'2026-06-22 09:25:01'),(3,30,1,'1111660d-1ca3-4c56-83d5-94d92af8faa7',NULL,NULL,NULL,'mobile',NULL,'2026-06-22 09:45:01'),(4,29,1,'d8f9e55b-766e-4c00-8cb7-4f7c268aab03','localhost',NULL,NULL,'desktop',NULL,'2026-06-22 10:40:00'),(5,6,1,'4b137ae9-14bb-4aad-9cf4-9a320e2539c9','localhost',NULL,NULL,'desktop',NULL,'2026-06-22 11:20:00'),(6,29,1,'870aa914-e35e-46f9-a5e6-edcb7ff7ea48','localhost',NULL,NULL,'desktop',NULL,'2026-06-22 12:00:00'),(7,29,1,'c2485208-411e-491a-b41a-6544ac69c100','localhost',NULL,NULL,'desktop',NULL,'2026-06-22 14:45:00'),(8,29,1,'3bcc76ec-ad22-43e0-acee-6021a05153ec','localhost',NULL,NULL,'desktop',NULL,'2026-06-22 15:20:01'),(9,32,1,'b9744dd5-4cbf-4f61-a853-3b34f391bcb2','localhost',NULL,NULL,'desktop',NULL,'2026-06-22 16:25:01'),(10,29,1,'4b9a3eff-93f1-4ea4-815f-3b0f8d5ca057','localhost',NULL,NULL,'desktop',NULL,'2026-06-22 16:35:00'),(11,5,1,'e1676cb4-60f9-47dc-bc2a-58f7d4be1d4b','localhost',NULL,NULL,'desktop',NULL,'2026-06-22 16:35:00'),(12,32,1,'57c19307-7ad9-4a46-8bce-8be4238319c4','localhost',NULL,NULL,'desktop',NULL,'2026-06-22 17:00:00'),(13,32,1,'a432c781-ce63-4ed2-8575-d07e529cb9eb','localhost',NULL,NULL,'desktop',NULL,'2026-06-22 17:35:01'),(14,30,1,'8b6d3e0c-bbd2-49d6-9d1a-819f78f5cba3',NULL,NULL,NULL,'desktop',NULL,'2026-06-22 17:50:02'),(15,32,1,'4fd6777b-50ba-4651-9604-6e46af7314ec','localhost',NULL,NULL,'desktop',NULL,'2026-06-22 17:55:01'),(16,31,1,'0d25d255-0dc3-4b17-a387-20f5d4c64d4b','localhost',NULL,NULL,'desktop',NULL,'2026-06-22 17:55:01'),(17,29,1,'5927c3d4-509a-45e3-b580-63b109104ad6','localhost',NULL,NULL,'desktop',NULL,'2026-06-22 17:55:01'),(18,32,1,'2c238c7b-5b53-4bba-997b-fdf6e2044da6','localhost',NULL,NULL,'desktop',NULL,'2026-07-12 12:45:00');
/*!40000 ALTER TABLE `blog_post_views` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blog_posts`
--

DROP TABLE IF EXISTS `blog_posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blog_posts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `author_id` bigint unsigned NOT NULL,
  `blog_category_id` bigint unsigned DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtitle` text COLLATE utf8mb4_unicode_ci,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `excerpt` text COLLATE utf8mb4_unicode_ci,
  `body` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `featured_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `video_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('draft','scheduled','published') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `publish_at` timestamp NULL DEFAULT NULL,
  `published_at` timestamp NULL DEFAULT NULL,
  `views` bigint unsigned NOT NULL DEFAULT '0',
  `short_link` varchar(6) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `blog_posts_slug_unique` (`slug`),
  UNIQUE KEY `blog_posts_short_link_unique` (`short_link`),
  KEY `blog_posts_author_id_foreign` (`author_id`),
  KEY `blog_posts_blog_category_id_foreign` (`blog_category_id`),
  CONSTRAINT `blog_posts_author_id_foreign` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `blog_posts_blog_category_id_foreign` FOREIGN KEY (`blog_category_id`) REFERENCES `blog_categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blog_posts`
--

LOCK TABLES `blog_posts` WRITE;
/*!40000 ALTER TABLE `blog_posts` DISABLE KEYS */;
INSERT INTO `blog_posts` VALUES (1,1,1,'رشد صنعت داروسازی ایران در سال جدید',NULL,'roshde-sanate-darosazi-iran','صنعت داروسازی ایران در ماه‌های اخیر شاهد رشد قابل‌توجهی در تولید داخلی بوده و شرکت‌های دانش‌بنیان نقش پررنگ‌تری در این مسیر ایفا می‌کنند. افزایش سرمایه‌گذاری در خطوط تولید، توسعه فرمولاسیون‌های جدید و کاهش وابستگی به واردات از جمله محرک‌های اصلی این رشد به شمار می‌روند. کارشناسان معتقدند با حمایت‌های بیشتر دولتی و تسهیل فرآیندهای ثبت دارو، می‌توان شاهد جهش بزرگ‌تری در این صنعت بود. در عین حال چالش‌هایی نظیر تامین مواد اولیه و نوسانات ارزی همچنان پیش روی فعالان این حوزه قرار دارد و نیازمند سیاست‌گذاری دقیق‌تری است تا روند رشد فعلی پایدار بماند و به نفع بیماران و اقتصاد کشور تمام شود.','صنعت داروسازی ایران در سال‌های اخیر مسیر متفاوتی را نسبت به گذشته طی کرده است. شرکت‌های تولیدکننده با سرمایه‌گذاری در زیرساخت‌های جدید توانسته‌اند بخش بزرگی از نیاز داخلی را پوشش دهند و در برخی موارد حتی به سمت صادرات حرکت کنند.\n\nیکی از عوامل کلیدی این رشد، توجه ویژه به استانداردهای GMP و ارتقای کیفیت تولید بوده است. این موضوع باعث شده محصولات داخلی از نظر کیفی فاصله کمتری با نمونه‌های خارجی داشته باشند و اعتماد عمومی به دارو‌های تولید داخل افزایش یابد.\n\nبا این حال، تامین ارز برای خرید مواد اولیه و تجهیزات همچنان یکی از مهم‌ترین چالش‌های پیش روی فعالان این صنعت است. بسیاری از کارشناسان معتقدند بدون حل این مشکل، رشد فعلی نمی‌تواند با همین شتاب ادامه پیدا کند.\n\nدر مجموع، آینده صنعت داروسازی ایران به میزان زیادی به سیاست‌های حمایتی دولت، تسهیل مقررات و همکاری نزدیک‌تر بخش خصوصی و دولتی بستگی دارد. تحقق این شرایط می‌تواند مسیر رشد را برای سال‌های آینده هموارتر کند.','blog-posts/roshde-sanate-darosazi-iran.jpg',NULL,'published',NULL,'2026-03-27 08:55:13',1,'uEvIV2','2026-06-22 08:55:13','2026-06-22 09:25:01'),(2,1,1,'اعلام آخرین مصوبات سازمان غذا و دارو درباره قیمت‌گذاری دارو',NULL,'mosavabate-jadide-ifda-gheymat-daro','سازمان غذا و دارو در نشست اخیر خود، مجموعه‌ای از مصوبات جدید را در خصوص نحوه قیمت‌گذاری اقلام دارویی اعلام کرد. بر اساس این مصوبات، فرآیند بازنگری قیمت برخی داروهای وارداتی و تولید داخل با هدف کنترل تورم بخش سلامت تغییر خواهد کرد. مسئولان این سازمان تاکید کرده‌اند که هدف اصلی، حفظ تعادل میان منافع تولیدکننده، توزیع‌کننده و در نهایت بیمار است. این تصمیمات پس از رایزنی با انجمن‌های صنفی داروسازان و نمایندگان صنعت اتخاذ شده و انتظار می‌رود ظرف چند هفته آینده به‌صورت رسمی در داروخانه‌ها اجرایی شود. بسیاری از فعالان صنعت این تغییرات را گامی مثبت اما نیازمند پایش مستمر می‌دانند.','سازمان غذا و دارو به‌عنوان نهاد ناظر بر بازار دارو، به‌طور مرتب سیاست‌های قیمت‌گذاری را بازبینی می‌کند تا تعادل میان عرضه و تقاضا حفظ شود. مصوبات اخیر این سازمان نیز در همین راستا تدوین شده است.\n\nبر اساس اعلام رسمی، تغییرات قیمتی عمدتاً شامل دسته‌ای از داروهای وارداتی است که در سال‌های اخیر با نوسانات ارزی قابل‌توجهی مواجه بوده‌اند. این تصمیم با هدف کاهش فشار مالی بر بیماران اتخاذ شده است.\n\nنمایندگان انجمن داروسازان در نشست‌های مشورتی حضور داشتند و برخی ملاحظات صنفی نیز در تصمیم‌گیری نهایی لحاظ شده است. با این حال برخی فعالان معتقدند جزئیات اجرایی هنوز نیازمند شفاف‌سازی بیشتری است.\n\nاجرای این مصوبات از هفته‌های آینده آغاز خواهد شد و سازمان غذا و دارو اعلام کرده که روند نظارت بر اجرای صحیح آن را به‌صورت مستمر دنبال خواهد کرد.','blog-posts/mosavabate-jadide-ifda-gheymat-daro.jpg',NULL,'published',NULL,'2026-04-01 08:55:13',0,'nRTnC7','2026-06-22 08:55:13','2026-06-22 08:55:13'),(3,1,1,'حضور پررنگ‌تر در عرصه بین‌المللی، چشم‌انداز جدید دانشگاه علوم پزشکی تهران برای مرجعیت علمی است.',NULL,'barname-vezarat-behdasht-tozie-daro','وزارت بهداشت، درمان و آموزش پزشکی برنامه‌ای جدید برای بهبود دسترسی به داروهای ضروری در مناطق کمتر برخوردار کشور تدوین کرده است. بر اساس این طرح، شبکه توزیع دارو در روستاها و شهرهای دورافتاده تقویت شده و امکان تحویل سریع‌تر داروهای حیاتی فراهم می‌شود. مسئولان وزارتخانه اعلام کرده‌اند که این برنامه با همکاری دانشگاه‌های علوم پزشکی استانی و خیریه‌های سلامت اجرا خواهد شد.','دسترسی نابرابر به دارو همواره یکی از چالش‌های نظام سلامت در مناطق محروم بوده است. وزارت بهداشت با درک این موضوع، طرح جدیدی را برای رفع این کاستی طراحی کرده است.\r\n\r\nبر اساس این برنامه، انبارهای منطقه‌ای دارو در نزدیکی روستاهای کم‌برخوردار ایجاد می‌شود تا زمان تحویل دارو به حداقل برسد. این اقدام به‌ویژه برای بیماران مزمن که نیاز به دارو‌های مستمر دارند اهمیت زیادی دارد.\r\n\r\nهمکاری دانشگاه‌های علوم پزشکی استانی و سازمان‌های مردم‌نهاد در اجرای این طرح نقش کلیدی ایفا می‌کند. این نهادها مسئول شناسایی مناطق نیازمند و پایش کیفیت توزیع خواهند بود.\r\n\r\nمسئولان امیدوارند با اجرای کامل این برنامه، شکاف دسترسی به دارو میان مناطق شهری و روستایی به‌طور محسوسی کاهش یابد و سلامت عمومی در این مناطق ارتقا پیدا کند.','assets/images/oitJPaND200IKbD6uVAoNlWK1wB45UnXJ8RdMgn2.jpg',NULL,'published',NULL,'2026-03-18 08:55:13',0,'kOWiO5','2026-06-22 08:55:13','2026-07-13 23:47:52'),(4,1,1,'تغییرات تعرفه‌های بیمه سلامت در سال جاری',NULL,'taghirat-tarefe-bime-salamat','سازمان‌های بیمه‌گر کشور تغییرات تازه‌ای را در تعرفه پوشش داروهای تجویزی اعلام کرده‌اند که از ابتدای فصل جاری اجرایی می‌شود. این تغییرات شامل افزایش سهم بیمه برای برخی داروهای پرمصرف و بازنگری در فهرست داروهای تحت پوشش است. مسئولان بیمه‌ای تاکید دارند هدف از این بازنگری، کاهش هزینه‌های مستقیم بیماران مزمن و گسترش دسترسی به درمان‌های ضروری است. در مقابل برخی کارشناسان نسبت به افزایش بار مالی صندوق‌های بیمه‌ای هشدار داده‌اند و خواستار شفاف‌سازی بیشتر در نحوه تامین منابع مالی این تغییرات شده‌اند. انتظار می‌رود جزئیات کامل این طرح طی هفته‌های آینده از سوی سازمان‌های ذی‌ربط منتشر شود.','تعرفه‌های بیمه سلامت یکی از موضوعاتی است که هر سال با حساسیت بالایی از سوی بیماران و فعالان صنعت دارو دنبال می‌شود. امسال نیز تغییراتی در این حوزه اعلام شده است.\n\nبر اساس اعلام سازمان‌های بیمه‌گر، سهم پوشش برای داروهای بیماری‌های خاص و صعب‌العلاج افزایش یافته تا فشار مالی بر این دسته از بیماران کاهش یابد. این تصمیم با استقبال نسبی فعالان حوزه سلامت روبه‌رو شده است.\n\nدر مقابل، برخی کارشناسان اقتصاد سلامت نسبت به پایداری مالی صندوق‌های بیمه در بلندمدت ابراز نگرانی کرده‌اند و خواستار بازنگری در منابع تامین مالی این طرح‌ها شده‌اند.\n\nبا این حال، مسئولان امیدوارند اجرای این تغییرات بتواند تعادلی میان حمایت از بیماران و پایداری مالی نظام بیمه‌ای کشور ایجاد کند.','blog-posts/taghirat-tarefe-bime-salamat.jpg',NULL,'published',NULL,'2026-05-08 08:55:13',0,'KEXoM8','2026-06-22 08:55:13','2026-06-22 08:55:13'),(5,1,1,'نوسانات ارزی و تاثیر آن بر قیمت داروهای وارداتی',NULL,'navasanat-arzi-asar-bar-daro-varedati','نوسانات اخیر بازار ارز تاثیر مستقیمی بر قیمت تمام‌شده داروهای وارداتی گذاشته و فعالان صنعت دارو را با چالش‌های جدی روبه‌رو کرده است. بسیاری از شرکت‌های واردکننده اعلام کرده‌اند که افزایش نرخ ارز هزینه تامین مواد اولیه و محصولات نهایی را به‌شدت بالا برده است. این موضوع نگرانی‌هایی را درباره احتمال کمبود برخی اقلام دارویی در بازار ایجاد کرده است. کارشناسان اقتصادی معتقدند بدون تخصیص ارز ترجیحی پایدار، صنعت دارو همچنان با ریسک‌های جدی مواجه خواهد بود. در همین حال، دولت اعلام کرده در حال بررسی راهکارهایی برای کاهش فشار ناشی از این نوسانات بر بیماران است.','بازار ارز در ماه‌های اخیر نوسانات قابل‌توجهی را تجربه کرده و این موضوع به‌سرعت خود را در قیمت داروهای وارداتی نشان داده است.\n\nشرکت‌های واردکننده دارو می‌گویند بخش بزرگی از هزینه‌های آن‌ها به ارز خارجی وابسته است و هرگونه افزایش نرخ ارز مستقیماً بر قیمت تمام‌شده محصولات اثر می‌گذارد.\n\nاین وضعیت باعث نگرانی فعالان صنعت از احتمال کمبود برخی اقلام دارویی خاص شده است، به‌ویژه داروهایی که جایگزین داخلی ندارند.\n\nدولت و سازمان غذا و دارو اعلام کرده‌اند در حال بررسی راهکارهایی نظیر تخصیص ارز ترجیحی پایدار برای کاهش این فشار هستند، هرچند جزئیات نهایی این طرح هنوز اعلام نشده است.','blog-posts/navasanat-arzi-asar-bar-daro-varedati.jpg',NULL,'published',NULL,'2026-06-15 08:55:13',1,'NxTPG5','2026-06-22 08:55:13','2026-06-22 16:35:00'),(6,1,1,'جذب دانشجویان بین‌المللی، راهبرد دانشگاه علوم پزشکی تهران برای ارتقای جایگاه علمی منطقه‌ای است.',NULL,'gozareshe-vije-zanjire-tamine-daro','زنجیره تامین دارو در ایران در سال‌های اخیر با چالش‌های متعددی از جمله محدودیت‌های ارزی، تحریم‌ها و مشکلات حمل‌ونقل مواجه بوده است. این گزارش ویژه به بررسی نقاط ضعف و قوت این زنجیره از تولید مواد اولیه تا توزیع نهایی در داروخانه‌ها می‌پردازد. بر اساس یافته‌های این گزارش، بخش قابل‌توجهی از مشکلات ناشی از وابستگی به واردات مواد اولیه است که می‌تواند با سرمایه‌گذاری در تولید داخلی کاهش یابد.','زنجیره تامین دارو شامل چندین حلقه به‌هم‌پیوسته از تولید مواد اولیه تا رسیدن دارو به دست بیمار است و هرگونه اختلال در یکی از این حلقه‌ها می‌تواند کل سیستم را تحت تاثیر قرار دهد.\r\n\r\nبر اساس بررسی‌های انجام‌شده، وابستگی بالا به واردات مواد اولیه دارویی یکی از اصلی‌ترین نقاط ضعف این زنجیره در ایران محسوب می‌شود که آن را در برابر تحریم‌ها و نوسانات ارزی آسیب‌پذیر می‌کند.\r\n\r\nاز سوی دیگر، نبود سیستم یکپارچه دیجیتال برای رصد موجودی و توزیع دارو باعث شده برخی مناطق با کمبود موقت مواجه شوند، در حالی که در مناطق دیگر مازاد موجودی وجود دارد.\r\n\r\nکارشناسان پیشنهاد می‌کنند با سرمایه‌گذاری در تولید داخلی مواد اولیه و توسعه پلتفرم‌های دیجیتال رصد دارو، می‌توان مقاومت زنجیره تامین را در برابر بحران‌های آینده افزایش داد.','blog-posts/gozareshe-vije-zanjire-tamine-daro.jpg',NULL,'published',NULL,'2026-03-08 08:55:13',1,'MoUet9','2026-06-22 08:55:13','2026-07-13 23:41:16'),(7,1,2,'آموزش مفاهیم پایه GMP برای کارشناسان کنترل کیفیت',NULL,'amoozesh-mafahim-paye-gmp','استانداردهای GMP یا روش‌های صحیح تولید، ستون فقرات تضمین کیفیت در صنعت داروسازی محسوب می‌شوند و آشنایی با اصول آن برای هر کارشناس کنترل کیفیت ضروری است. این مطلب آموزشی به زبان ساده مفاهیم پایه GMP از جمله مستندسازی، کنترل فرآیند، آموزش پرسنل و مدیریت ریسک را معرفی می‌کند. هدف این است که خوانندگان با چارچوب کلی این استاندارد بین‌المللی آشنا شوند و بتوانند آن را در محیط کاری خود پیاده‌سازی کنند. رعایت اصول GMP نه‌تنها کیفیت محصول نهایی را تضمین می‌کند بلکه اعتماد نهادهای نظارتی داخلی و بین‌المللی را نیز جلب می‌کند. این مطلب برای دانشجویان و تازه‌کاران حوزه کیفیت نیز مناسب است.','GMP مخفف عبارت Good Manufacturing Practice است و مجموعه‌ای از دستورالعمل‌ها برای اطمینان از تولید محصولات دارویی با کیفیت یکسان و ایمن محسوب می‌شود.\n\nیکی از ارکان اصلی GMP، مستندسازی دقیق تمام مراحل تولید است. هر فرآیند باید قابل ردیابی باشد تا در صورت بروز مشکل، علت آن به‌سرعت شناسایی شود.\n\nآموزش مستمر پرسنل نیز بخش مهمی از این استاندارد است؛ زیرا خطای انسانی یکی از شایع‌ترین علل انحراف از کیفیت مطلوب در خطوط تولید دارو به شمار می‌رود.\n\nدر نهایت، مدیریت ریسک و انجام ممیزی‌های دوره‌ای داخلی به شرکت‌ها کمک می‌کند تا پیش از وقوع مشکلات جدی، نقاط ضعف احتمالی را شناسایی و اصلاح کنند.','blog-posts/amoozesh-mafahim-paye-gmp.jpg',NULL,'published',NULL,'2026-03-23 08:55:14',0,'kDaTG7','2026-06-22 08:55:14','2026-06-22 08:55:14'),(8,1,2,'نقش هوش مصنوعی در تشخیص زودهنگام بیماری‌ها',NULL,'naghshe-hoosh-masnoei-tashkhise-zoodhengam','هوش مصنوعی به سرعت در حال تبدیل شدن به ابزاری کلیدی در تشخیص زودهنگام بیماری‌ها در سراسر جهان است. الگوریتم‌های یادگیری ماشین با تحلیل حجم عظیمی از داده‌های پزشکی، الگوهایی را شناسایی می‌کنند که حتی برای چشم متخصص نیز ممکن است در نگاه اول قابل‌مشاهده نباشند. این فناوری به‌ویژه در تشخیص سرطان، بیماری‌های قلبی و اختلالات نورولوژیک نتایج امیدوارکننده‌ای نشان داده است. در ایران نیز برخی استارتاپ‌های سلامت در حال توسعه ابزارهای مبتنی بر هوش مصنوعی برای کمک به پزشکان هستند. با این حال، چالش‌هایی نظیر کیفیت داده و نیاز به تایید نهادهای نظارتی همچنان پیش روی گسترش این فناوری قرار دارد.','تشخیص زودهنگام بیماری‌ها یکی از مهم‌ترین عوامل افزایش شانس درمان موفق است و هوش مصنوعی در این زمینه پتانسیل بالایی از خود نشان داده است.\n\nالگوریتم‌های یادگیری عمیق با آموزش بر روی هزاران تصویر پزشکی، می‌توانند نشانه‌های اولیه بیماری‌هایی مانند سرطان پوست یا تومورهای ریوی را با دقت بالا شناسایی کنند.\n\nدر کنار مزایای فراوان، استفاده از هوش مصنوعی در پزشکی نیازمند داده‌های باکیفیت و متنوع است، زیرا داده‌های ناقص می‌تواند منجر به تشخیص‌های نادرست شود.\n\nدر ایران نیز چند تیم استارتاپی در حال توسعه ابزارهای تشخیصی مبتنی بر هوش مصنوعی هستند، هرچند مسیر تجاری‌سازی این فناوری همچنان نیازمند همکاری نزدیک با نهادهای نظارتی است.','blog-posts/naghshe-hoosh-masnoei-tashkhise-zoodhengam.jpg',NULL,'published',NULL,'2026-05-09 08:55:14',0,'PYMRh3','2026-06-22 08:55:14','2026-06-22 08:55:14'),(9,1,2,'فناوری‌های نوین سلامت دیجیتال و آینده درمان',NULL,'fanavarihaye-novin-salamat-dijital','سلامت دیجیتال یکی از سریع‌ترین حوزه‌های در حال رشد در صنعت پزشکی است که زندگی بیماران و نحوه ارائه خدمات درمانی را دگرگون کرده است. از اپلیکیشن‌های پایش سلامت گرفته تا پلتفرم‌های ویزیت آنلاین، این فناوری‌ها دسترسی به خدمات سلامت را برای بسیاری از افراد، به‌ویژه ساکنان مناطق دورافتاده، تسهیل کرده‌اند. در این مطلب نگاهی داریم به مهم‌ترین روندهای سلامت دیجیتال در جهان و میزان پیشرفت این حوزه در ایران. کارشناسان معتقدند آینده درمان به سمت ترکیب داده‌های پزشکی، هوش مصنوعی و خدمات از راه دور حرکت می‌کند که می‌تواند کیفیت و کارایی نظام سلامت را به‌طور چشمگیری ارتقا دهد.','سلامت دیجیتال طیف وسیعی از فناوری‌ها از جمله اپلیکیشن‌های موبایل، دستگاه‌های پوشیدنی و پلتفرم‌های آنلاین پزشکی را در بر می‌گیرد که هدف مشترک همگی، بهبود دسترسی و کیفیت خدمات سلامت است.\n\nیکی از مهم‌ترین کاربردهای این فناوری‌ها، پایش مستمر بیماران مزمن است که می‌تواند از بستری شدن‌های غیرضروری جلوگیری کند و هزینه‌های درمان را کاهش دهد.\n\nدر ایران نیز پلتفرم‌های ویزیت آنلاین و اپلیکیشن‌های نوبت‌دهی در سال‌های اخیر رشد قابل‌توجهی داشته‌اند، هرچند زیرساخت‌های فنی و قانونی این حوزه هنوز در حال تکامل است.\n\nبا پیشرفت فناوری‌هایی مانند اینترنت اشیا و هوش مصنوعی، انتظار می‌رود سلامت دیجیتال در سال‌های آینده نقش پررنگ‌تری در نظام درمانی کشور ایفا کند.','blog-posts/fanavarihaye-novin-salamat-dijital.jpg',NULL,'published',NULL,'2026-04-05 08:55:14',0,'YHNqJ5','2026-06-22 08:55:14','2026-06-22 08:55:14'),(10,1,2,'استارتاپ‌های حوزه سلامت؛ نوآوری در خدمت بیماران',NULL,'startuphaye-salamat-noavari','اکوسیستم استارتاپی حوزه سلامت در ایران در سال‌های اخیر رشد چشمگیری داشته و طیف متنوعی از خدمات نوآورانه از جمله داروخانه‌های آنلاین، اپلیکیشن‌های مشاوره پزشکی و پلتفرم‌های مدیریت بیماری‌های مزمن را ارائه می‌دهد. این کسب‌وکارهای نوپا با شناسایی نقاط ضعف نظام سلامت سنتی، راهکارهایی سریع‌تر و در دسترس‌تر برای بیماران فراهم کرده‌اند. سرمایه‌گذاران نیز توجه بیشتری به این حوزه نشان داده‌اند که نشانه‌ای از پتانسیل بالای بازار سلامت دیجیتال است. با این حال، استارتاپ‌های این حوزه با چالش‌هایی نظیر مقررات پیچیده و نیاز به اعتمادسازی با بیماران و نهادهای پزشکی روبه‌رو هستند که موفقیت بلندمدت آن‌ها را تحت تاثیر قرار می‌دهد.','در سال‌های اخیر شاهد ظهور استارتاپ‌های متعددی در حوزه سلامت بوده‌ایم که هرکدام تلاش می‌کنند بخشی از فرآیند درمان را ساده‌تر و کارآمدتر کنند.\n\nداروخانه‌های آنلاین یکی از موفق‌ترین نمونه‌های این کسب‌وکارها هستند که با ارائه خدمات تحویل سریع دارو، دسترسی بیماران به اقلام مورد نیاز را تسهیل کرده‌اند.\n\nاپلیکیشن‌های مشاوره پزشکی نیز با اتصال بیماران به پزشکان متخصص از طریق تماس تصویری یا چت، گامی موثر در کاهش بار مراجعات حضوری برداشته‌اند.\n\nبا این حال، رشد این استارتاپ‌ها مستلزم رعایت دقیق مقررات نظارتی و جلب اعتماد بیماران است، موضوعی که می‌تواند مسیر رشد آن‌ها را در بلندمدت تعیین کند.','blog-posts/startuphaye-salamat-noavari.jpg',NULL,'published',NULL,'2026-02-22 08:55:14',0,'QpSir9','2026-06-22 08:55:14','2026-06-22 08:55:14'),(11,1,2,'تحلیل روند مصرف داروهای ژنریک در بازار ایران',NULL,'tahlile-rovande-masraf-daro-janiraik','داروهای ژنریک سهم قابل‌توجهی از بازار دارویی ایران را به خود اختصاص داده‌اند و این روند در سال‌های اخیر شتاب بیشتری گرفته است. این تحلیل به بررسی دلایل افزایش تقاضا برای داروهای ژنریک، از جمله قیمت پایین‌تر نسبت به نمونه‌های اورجینال و افزایش ظرفیت تولید داخلی می‌پردازد. کارشناسان معتقدند با وجود مزایای اقتصادی این داروها، اطمینان از کیفیت و اثربخشی آن‌ها همچنان نیازمند نظارت دقیق سازمان غذا و دارو است. مقایسه‌ای میان وضعیت بازار ژنریک ایران و سایر کشورهای منطقه نیز در این مطلب ارائه شده تا تصویر روشن‌تری از جایگاه ایران در این حوزه به دست آید.','داروهای ژنریک نسخه‌های مشابه از نظر ترکیب و اثربخشی با داروهای اورجینال هستند که معمولاً با قیمت پایین‌تری عرضه می‌شوند و همین موضوع آن‌ها را برای بسیاری از بیماران جذاب کرده است.\n\nدر سال‌های اخیر، با افزایش ظرفیت تولید داخلی، سهم داروهای ژنریک در سبد مصرف خانوار ایرانی رشد محسوسی داشته است.\n\nبا این حال، برخی نگرانی‌ها درباره یکسان بودن کیفیت و اثربخشی تمام برندهای ژنریک با نمونه اصلی همچنان وجود دارد که نیازمند نظارت دقیق‌تر نهادهای مسئول است.\n\nمقایسه با کشورهای منطقه نشان می‌دهد ایران در زمینه تولید داروهای ژنریک جایگاه نسبتاً مناسبی دارد، اما برای رقابت جدی‌تر در بازارهای صادراتی نیاز به ارتقای بیشتر استانداردهای کیفی دارد.','blog-posts/tahlile-rovande-masraf-daro-janiraik.jpg',NULL,'published',NULL,'2026-05-29 08:55:15',0,'TCnGO1','2026-06-22 08:55:15','2026-06-22 08:55:15'),(12,1,2,'مروری بر پژوهش‌های اخیر در حوزه واکسن‌سازی',NULL,'morori-bar-pajooheshhaye-vaksansazi','فناوری واکسن‌سازی در سال‌های اخیر با سرعت چشمگیری پیشرفت کرده و پلتفرم‌های جدیدی نظیر واکسن‌های mRNA توجه زیادی را به خود جلب کرده‌اند. این مرور پژوهشی به بررسی مهم‌ترین یافته‌های علمی منتشرشده در این حوزه و کاربردهای بالقوه آن فراتر از بیماری‌های عفونی، از جمله در درمان برخی سرطان‌ها می‌پردازد. محققان ایرانی نیز در سال‌های اخیر دستاوردهای قابل‌توجهی در زمینه تولید واکسن‌های داخلی داشته‌اند. این مطلب همچنین به چالش‌های پیش روی توسعه واکسن‌های جدید از جمله هزینه‌های بالای تحقیق و توسعه و فرآیندهای طولانی تایید نظارتی اشاره می‌کند.','پلتفرم mRNA یکی از مهم‌ترین دستاوردهای علمی دهه اخیر در حوزه واکسن‌سازی است که سرعت توسعه واکسن‌های جدید را به‌طور چشمگیری افزایش داده است.\n\nپژوهش‌های اخیر نشان می‌دهد این فناوری پتانسیل استفاده فراتر از بیماری‌های عفونی، از جمله در درمان برخی انواع سرطان و بیماری‌های نادر را نیز دارد.\n\nمحققان ایرانی نیز در سال‌های اخیر با تولید چند واکسن داخلی، گامی مهم در مسیر خودکفایی این حوزه برداشته‌اند، هرچند مسیر تجاری‌سازی همچنان با چالش‌هایی همراه است.\n\nهزینه بالای تحقیق و توسعه و فرآیندهای طولانی تایید نظارتی از جمله موانعی هستند که توسعه واکسن‌های جدید را در سراسر جهان، از جمله ایران، کند می‌کنند.','blog-posts/morori-bar-pajooheshhaye-vaksansazi.jpg',NULL,'published',NULL,'2026-06-13 08:55:16',0,'UUhcq6','2026-06-22 08:55:16','2026-06-22 08:55:16'),(13,1,3,'تحلیل حقوقی قوانین جدید مرتبط با واردات دارو',NULL,'tahlile-hoghooghi-ghavanin-varedat-daro','تغییرات اخیر در قوانین واردات دارو، فضای حقوقی جدیدی را برای شرکت‌های فعال در این حوزه ایجاد کرده است. این تحلیل حقوقی به بررسی مهم‌ترین تغییرات قانونی، از جمله شرایط جدید مجوزدهی و الزامات گمرکی می‌پردازد. کارشناسان حقوقی معتقدند آشنایی دقیق با این قوانین می‌تواند از بروز مشکلات اداری و تاخیر در ترخیص محموله‌های دارویی جلوگیری کند. در این مطلب همچنین به تفاوت‌های میان رویه‌های قدیم و جدید اشاره شده تا شرکت‌های واردکننده بتوانند فرآیندهای داخلی خود را با مقررات روز هماهنگ کنند. رعایت دقیق این الزامات برای جلوگیری از جریمه و توقیف کالا ضروری است.','قوانین واردات دارو در ایران به‌طور مرتب به‌روزرسانی می‌شوند تا با نیازهای روز بازار و الزامات نظارتی همگام باشند. آخرین تغییرات نیز در همین راستا اعمال شده است.\n\nیکی از مهم‌ترین تغییرات، سخت‌گیری بیشتر در فرآیند صدور مجوز ورود برای داروهایی است که مشابه داخلی دارند، با هدف حمایت از تولید ملی.\n\nالزامات گمرکی جدید نیز شامل مستندسازی دقیق‌تر منشاء کالا و گواهی‌های کیفی است که عدم رعایت آن می‌تواند منجر به توقف محموله در گمرک شود.\n\nبه شرکت‌های واردکننده توصیه می‌شود پیش از ارسال سفارش، از به‌روز بودن مدارک و انطباق آن‌ها با آخرین بخشنامه‌های سازمان غذا و دارو اطمینان حاصل کنند تا از تاخیرهای غیرضروری جلوگیری شود.','blog-posts/tahlile-hoghooghi-ghavanin-varedat-daro.jpg',NULL,'published',NULL,'2026-05-22 08:55:16',0,'OGntw4','2026-06-22 08:55:16','2026-06-22 08:55:16'),(14,1,3,'آشنایی با قوانین و مقررات داروخانه‌داری در ایران',NULL,'ashnayi-ghavanin-moghararat-darookhanedari','اداره یک داروخانه در ایران مستلزم رعایت مجموعه‌ای از قوانین و مقررات صنفی و نظارتی است که هر داروساز و مسئول فنی باید با آن‌ها آشنا باشد. این مطلب راهنمایی جامع از الزامات قانونی مهم، از جمله شرایط دریافت پروانه، نگهداری داروهای کنترل‌شده و نحوه قیمت‌گذاری ارائه می‌دهد. عدم رعایت این مقررات می‌تواند منجر به جریمه‌های سنگین یا حتی لغو پروانه فعالیت شود. این راهنما به‌ویژه برای داروسازان تازه‌کار و دانشجویانی که قصد راه‌اندازی داروخانه دارند، کاربردی خواهد بود و به ساده‌سازی فرآیندهای اداری مرتبط با این حرفه کمک می‌کند.','فعالیت در حوزه داروخانه‌داری در ایران تحت نظارت دقیق سازمان غذا و دارو و انجمن داروسازان قرار دارد و رعایت مقررات این نهادها برای ادامه فعالیت ضروری است.\n\nیکی از مهم‌ترین الزامات، دریافت و تمدید به‌موقع پروانه مسئول فنی است که بدون آن امکان فعالیت قانونی داروخانه وجود ندارد.\n\nنگهداری صحیح داروهای کنترل‌شده و مخدر نیز از حساس‌ترین بخش‌های این مقررات است که نیازمند مستندسازی دقیق ورود و خروج هر قلم دارویی است.\n\nآشنایی کامل با این الزامات نه‌تنها از بروز مشکلات قانونی جلوگیری می‌کند، بلکه به ارتقای استاندارد خدمات‌رسانی به بیماران نیز کمک می‌کند.','blog-posts/ashnayi-ghavanin-moghararat-darookhanedari.jpg',NULL,'published',NULL,'2026-04-08 08:55:16',0,'zDmGP7','2026-06-22 08:55:16','2026-06-22 08:55:16'),(15,1,3,'بررسی آخرین بخشنامه‌های سازمان غذا و دارو',NULL,'barresi-akharin-bakhshnamehaye-ifda','سازمان غذا و دارو به‌صورت دوره‌ای بخشنامه‌های جدیدی برای تنظیم فرآیندهای صنعت دارو و تجهیزات پزشکی صادر می‌کند که آگاهی از آن‌ها برای فعالان این حوزه ضروری است. در این مطلب به بررسی مهم‌ترین بخشنامه‌های اخیر، از جمله تغییرات در فرآیند ثبت دارو و الزامات برچسب‌گذاری محصولات پرداخته شده است. این بخشنامه‌ها معمولاً با هدف افزایش شفافیت و ایمنی بیمار صادر می‌شوند و عدم رعایت آن‌ها می‌تواند پیامدهای قانونی برای شرکت‌ها داشته باشد. این مطلب به‌صورت خلاصه و کاربردی نکات کلیدی هر بخشنامه را برای استفاده سریع‌تر فعالان صنعت ارائه می‌دهد.','بخشنامه‌های سازمان غذا و دارو ابزار اصلی این نهاد برای اجرای سیاست‌های روزآمد در صنعت دارو و تجهیزات پزشکی محسوب می‌شوند.\n\nیکی از بخشنامه‌های اخیر، تغییراتی در فرآیند ثبت اولیه داروهای جدید اعمال کرده که هدف آن تسریع در دسترسی بیماران به داروهای نوآورانه است.\n\nبخشنامه دیگری نیز الزامات جدیدی برای برچسب‌گذاری و درج اطلاعات ایمنی بر روی بسته‌بندی محصولات دارویی تعیین کرده است.\n\nشرکت‌های فعال در این حوزه باید به‌طور مستمر بخشنامه‌های جدید را رصد کنند تا از انطباق کامل فرآیندهای داخلی خود با آخرین مقررات اطمینان حاصل کنند.','blog-posts/barresi-akharin-bakhshnamehaye-ifda.jpg',NULL,'published',NULL,'2026-04-20 08:55:17',0,'olViP4','2026-06-22 08:55:17','2026-06-22 08:55:17'),(16,1,3,'همه‌چیز درباره مالیات بر درآمد داروخانه‌ها',NULL,'hamechiz-darbare-maliat-daramad-darookhane','مالیات یکی از موضوعات مهمی است که هر داروخانه‌دار باید با جزئیات قانونی آن آشنا باشد. این مطلب به بررسی نحوه محاسبه مالیات بر درآمد داروخانه‌ها، معافیت‌های احتمالی و تغییرات اخیر در نرخ‌های مالیاتی این صنف می‌پردازد. آشنایی با این قوانین می‌تواند از بروز مشکلات مالیاتی و جریمه‌های ناشی از عدم رعایت مهلت‌های قانونی جلوگیری کند. همچنین نکاتی درباره نحوه ثبت دفاتر مالی و ارائه اظهارنامه به سازمان امور مالیاتی در این مطلب آمده است که می‌تواند برای داروسازان و حسابداران این صنف مفید باشد.','مالیات بر درآمد داروخانه‌ها مانند سایر مشاغل، بر اساس درآمد خالص پس از کسر هزینه‌های مجاز محاسبه می‌شود، اما این صنف ویژگی‌های خاص خود را در محاسبات مالیاتی دارد.\n\nیکی از نکات مهم، ثبت دقیق فاکتورهای خرید و فروش است که مبنای اصلی محاسبه درآمد مشمول مالیات قرار می‌گیرد و هرگونه نقص در مستندات می‌تواند منجر به مشکلات بعدی شود.\n\nدر سال‌های اخیر برخی معافیت‌های مالیاتی محدود برای داروخانه‌های مناطق کمتر برخوردار در نظر گرفته شده که آگاهی از شرایط بهره‌مندی از آن‌ها اهمیت دارد.\n\nرعایت مهلت‌های قانونی ارائه اظهارنامه مالیاتی نیز برای جلوگیری از جرائم دیرکرد ضروری است و توصیه می‌شود داروخانه‌ها از مشاوران مالی مجرب در این زمینه بهره بگیرند.','blog-posts/hamechiz-darbare-maliat-daramad-darookhane.jpg',NULL,'published',NULL,'2026-03-17 08:55:17',0,'FOxmy8','2026-06-22 08:55:17','2026-06-22 08:55:17'),(17,1,3,'راهنمای تشکیل پرونده اداری برای ثبت دارو',NULL,'rahnamaye-tashkile-parvande-edari-sabte-daro','فرآیند ثبت یک محصول دارویی در سازمان غذا و دارو نیازمند تشکیل پرونده اداری کاملی است که شامل مدارک متعدد فنی، کیفی و حقوقی می‌شود. این راهنما مراحل گام‌به‌گام تشکیل پرونده ثبت دارو، از مستندات کیفیت تا فرم‌های اداری مورد نیاز را معرفی می‌کند. آگاهی دقیق از این فرآیند می‌تواند از بازگشت پرونده به دلیل نقص مدارک جلوگیری کرده و زمان لازم برای دریافت مجوز نهایی را کاهش دهد. این مطلب به‌ویژه برای کارشناسان واحد ثبت و امور رگولاتوری شرکت‌های دارویی کاربردی است.','تشکیل پرونده اداری برای ثبت دارو یکی از مراحل حساس و زمان‌بر در مسیر ورود یک محصول جدید به بازار است که نیازمند دقت و آشنایی کامل با الزامات سازمان غذا و دارو است.\n\nمدارک اولیه معمولاً شامل پروفایل کیفی محصول، نتایج آزمایش‌های پایداری و گواهی‌های GMP کارخانه تولیدکننده است که باید با دقت تهیه و ارائه شوند.\n\nهرگونه نقص یا مغایرت در مدارک می‌تواند منجر به بازگشت پرونده و طولانی‌تر شدن فرآیند ثبت شود، بنابراین بررسی دقیق پیش از ارسال نهایی اهمیت زیادی دارد.\n\nپس از تایید اولیه، پرونده وارد مرحله بررسی کارشناسی می‌شود و در صورت عدم وجود ایراد، مجوز ثبت نهایی صادر خواهد شد.','blog-posts/rahnamaye-tashkile-parvande-edari-sabte-daro.jpg',NULL,'published',NULL,'2026-04-05 08:55:17',0,'cmpmc2','2026-06-22 08:55:17','2026-06-22 08:55:17'),(18,1,4,'هفت عادت ساده برای سبک زندگی سالم‌تر',NULL,'haft-adate-sade-sabke-zendegi-salem','داشتن سبک زندگی سالم لزوماً نیازمند تغییرات بزرگ نیست؛ بلکه با چند عادت ساده روزانه می‌توان کیفیت زندگی را به‌طور محسوسی بهبود بخشید. این مطلب به معرفی هفت عادت کاربردی، از تغذیه متعادل گرفته تا فعالیت بدنی منظم و مدیریت زمان استراحت می‌پردازد. هر یک از این عادت‌ها بر اساس شواهد علمی انتخاب شده‌اند و می‌توانند به‌تدریج و بدون فشار زیاد','بسیاری از افراد تصور می‌کنند رسیدن به سبک زندگی سالم نیازمند تغییرات بنیادین و دشوار است، در حالی که عادت‌های کوچک روزانه می‌توانند تاثیر بزرگی بر سلامت داشته باشند.\r\n\r\nنوشیدن آب کافی، مصرف میوه و سبزیجات تازه و کاهش غذاهای فرآوری‌شده از جمله ساده‌ترین اما موثرترین تغییراتی هستند که می‌توان در رژیم غذایی روزانه ایجاد کرد.\r\n\r\nفعالیت بدنی منظم، حتی به شکل پیاده‌روی روزانه، نقش مهمی در حفظ سلامت قلب و کاهش استرس دارد و نیازی به ورزش‌های سنگین و زمان‌بر نیست.\r\n\r\nدر کنار تغذیه و ورزش، رعایت ساعت خواب منظم و کاهش زمان استفاده از صفحه‌نمایش پیش از خواب نیز به بهبود کیفیت استراحت و در نتیجه سلامت کلی بدن کمک می‌کند.','blog-posts/haft-adate-sade-sabke-zendegi-salem.jpg',NULL,'published',NULL,'2026-06-22 14:29:14',0,'wpMUD8','2026-06-22 08:55:17','2026-06-22 14:29:14'),(19,1,4,'مدیریت استرس در محیط کار؛ راهکارهای عملی',NULL,'modiriate-estres-mohite-kar','استرس شغلی یکی از شایع‌ترین مشکلات سلامت روان در جامعه امروز است که می‌تواند بر عملکرد فردی و کیفیت زندگی تاثیر منفی بگذارد. این مطلب به بررسی علل اصلی استرس در محیط کار و ارائه راهکارهای عملی برای مدیریت آن می‌پردازد. تکنیک‌هایی مانند تنفس آگاهانه، اولویت‌بندی وظایف و ایجاد مرز مشخص میان کار و زندگی شخصی از جمله روش‌هایی هستند که می‌توانند به کاهش فشار روانی کمک کنند. متخصصان سلامت روان تاکید دارند که شناسایی زودهنگام نشانه‌های استرس مزمن و درخواست کمک تخصصی در صورت نیاز، نقش مهمی در پیشگیری از مشکلات جدی‌تر دارد.','استرس شغلی پدیده‌ای رایج در دنیای کاری امروز است که در صورت مدیریت نشدن می‌تواند به فرسودگی شغلی و مشکلات جدی سلامت روان منجر شود.\n\nیکی از علل اصلی استرس کاری، حجم بالای وظایف و کمبود زمان است که می‌تواند با اولویت‌بندی صحیح و تقسیم وظایف به بخش‌های کوچک‌تر تا حدی کنترل شود.\n\nتکنیک‌های تنفس آگاهانه و مدیتیشن کوتاه‌مدت در طول روز کاری نیز می‌توانند به کاهش سریع سطح اضطراب و افزایش تمرکز کمک کنند.\n\nدر نهایت، ایجاد مرز مشخص میان زمان کار و زندگی شخصی و عدم بررسی پیام‌های کاری در ساعات استراحت، نقش مهمی در پیشگیری از استرس مزمن دارد.','blog-posts/modiriate-estres-mohite-kar.jpg',NULL,'published',NULL,'2026-06-06 08:55:17',0,'dvWka4','2026-06-22 08:55:17','2026-06-22 08:55:17'),(20,1,4,'دانستنی‌های ضروری درباره مصرف صحیح داروها',NULL,'danestaniha-masrafe-sahihe-daro','مصرف نادرست دارو یکی از مشکلات شایع در میان بیماران است که می‌تواند اثربخشی درمان را کاهش داده یا حتی عوارض جانبی جدی به همراه داشته باشد. این مطلب به نکات کلیدی درباره نحوه صحیح مصرف دارو، از جمله رعایت زمان‌بندی، تداخلات دارویی و شرایط نگهداری می‌پردازد. آگاهی از این نکات ساده می‌تواند به بیماران کمک کند تا از داروهای تجویزی خود بهترین نتیجه را بگیرند و خطر بروز عوارض ناخواسته را کاهش دهند. این مطلب همچنین توصیه می‌کند بیماران پیش از هرگونه تغییر در نحوه مصرف دارو حتماً با پزشک یا داروساز خود مشورت کنند.','بسیاری از بیماران بدون آگاهی کافی از نحوه صحیح مصرف دارو، اثربخشی درمان خود را به‌طور ناخواسته کاهش می‌دهند یا در معرض عوارض جانبی غیرضروری قرار می‌گیرند.\n\nرعایت دقیق زمان‌بندی مصرف دارو، به‌ویژه برای داروهایی که باید با معده خالی یا پر مصرف شوند، تاثیر مستقیمی بر میزان جذب و اثربخشی آن‌ها دارد.\n\nتداخلات دارویی نیز یکی از موضوعات مهمی است که بیماران باید نسبت به آن آگاه باشند، به‌ویژه افرادی که چند دارو را به‌طور همزمان مصرف می‌کنند.\n\nنگهداری صحیح دارو در دمای مناسب و دور از نور مستقیم آفتاب نیز از کاهش اثربخشی دارو پیش از مصرف جلوگیری می‌کند و نباید نادیده گرفته شود.','blog-posts/danestaniha-masrafe-sahihe-daro.jpg',NULL,'published',NULL,'2026-03-03 08:55:17',0,'fRMTU1','2026-06-22 08:55:17','2026-06-22 08:55:17'),(21,1,4,'اهمیت خواب کافی برای سلامت جسم و روان',NULL,'ahamiate-khabe-kafi-baraye-salamat','خواب کافی و باکیفیت یکی از پایه‌های اصلی سلامت جسمی و روانی است که اغلب در زندگی پرمشغله امروزی نادیده گرفته می‌شود. این مطلب به بررسی تاثیرات کمبود خواب بر عملکرد مغز، سیستم ایمنی و سلامت روان می‌پردازد و راهکارهایی برای بهبود کیفیت خواب ارائه می‌دهد. کارشناسان توصیه می‌کنند رعایت ساعت خواب منظم، کاهش مصرف کافئین در ساعات پایانی روز و ایجاد محیطی آرام برای خواب از جمله مهم‌ترین اقداماتی هستند که می‌توانند کیفیت استراحت شبانه را بهبود بخشند. بی‌توجهی به این موضوع می‌تواند در بلندمدت زمینه‌ساز بروز بیماری‌های مزمن شود.','خواب فرآیندی است که طی آن بدن و مغز فرصت بازسازی و ترمیم پیدا می‌کنند، اما در سبک زندگی امروزی این نیاز اساسی اغلب نادیده گرفته می‌شود.\n\nکمبود مزمن خواب می‌تواند بر عملکرد شناختی، تمرکز و حافظه تاثیر منفی بگذارد و خطر ابتلا به بیماری‌های قلبی و متابولیک را افزایش دهد.\n\nاز نظر روانی نیز، خواب ناکافی با افزایش سطح استرس و اضطراب ارتباط مستقیم دارد و می‌تواند توانایی فرد در مدیریت چالش‌های روزمره را کاهش دهد.\n\nرعایت زمان ثابت برای خواب و بیداری، اجتناب از کافئین در ساعات عصر و کاهش استفاده از وسایل الکترونیکی پیش از خواب از جمله ساده‌ترین راهکارها برای بهبود کیفیت خواب هستند.','blog-posts/ahamiate-khabe-kafi-baraye-salamat.jpg',NULL,'published',NULL,'2026-05-23 08:55:17',0,'ldxxL7','2026-06-22 08:55:17','2026-06-22 08:55:17'),(22,1,5,'تحلیل بازار دارو در نیمه نخست سال',NULL,'tahlile-bazare-daro-nimeye-nakhost-sal','بازار دارو در نیمه نخست سال جاری تحولات قابل‌توجهی را تجربه کرده که از نوسانات ارزی تا تغییرات سیاست‌های قیمت‌گذاری را در بر می‌گیرد. این تحلیل به بررسی روندهای کلیدی این بازار، از جمله سهم تولید داخلی، میزان واردات و رفتار مصرف‌کننده می‌پردازد. داده‌های جمع‌آوری‌شده نشان می‌دهد برخی بخش‌های بازار، به‌ویژه داروهای ژنریک، رشد بیشتری نسبت به سال گذشته داشته‌اند. در مقابل، بخش داروهای تخصصی وارداتی همچنان با چالش‌های تامین مواجه است. این گزارش تحلیلی می‌تواند برای سرمایه‌گذاران و فعالان صنعت دارو در تصمیم‌گیری‌های آینده مفید واقع شود.','بازار دارو در نیمه نخست سال جاری با ترکیبی از فرصت‌ها و چالش‌ها همراه بوده که نیازمند بررسی دقیق روندهای آن است.\n\nسهم تولید داخلی در این بازه زمانی رشد محسوسی داشته، به‌ویژه در بخش داروهای ژنریک که با حمایت سیاست‌های داخلی‌سازی همراه شده است.\n\nدر مقابل، داروهای تخصصی وارداتی همچنان با مشکلات تامین ارز و تاخیر در ترخیص گمرکی مواجه هستند که می‌تواند بر دسترسی بیماران به این دسته از داروها تاثیر بگذارد.\n\nبا نگاهی به نیمه دوم سال، کارشناسان پیش‌بینی می‌کنند روند رشد تولید داخلی ادامه یابد، هرچند میزان این رشد به سیاست‌های ارزی دولت بستگی زیادی خواهد داشت.','blog-posts/tahlile-bazare-daro-nimeye-nakhost-sal.jpg',NULL,'published',NULL,'2026-03-26 08:55:18',0,'ovwqh5','2026-06-22 08:55:18','2026-06-22 08:55:18'),(23,1,5,'نگاهی تحلیلی به تاثیر تورم بر صنعت سلامت',NULL,'negahe-tahlili-tasire-tavarom-bar-salamat','تورم در سال‌های اخیر یکی از عوامل اصلی تاثیرگذار بر هزینه‌های نظام سلامت در ایران بوده و این روند بر تمام بخش‌های زنجیره، از تولید دارو تا خدمات درمانی، اثر گذاشته است. این تحلیل به بررسی مکانیسم‌های تاثیر تورم بر قیمت تمام‌شده داروها و خدمات پزشکی می‌پردازد و نشان می‌دهد چگونه افزایش هزینه‌های انرژی، حمل‌ونقل و دستمزد بر این بخش اثر گذاشته است. کارشناسان اقتصاد سلامت معتقدند بدون سیاست‌های حمایتی هدفمند، فشار تورمی می‌تواند دسترسی بیماران کم‌درآمد به خدمات ضروری سلامت را محدود کند.','تورم به‌عنوان یک پدیده کلان اقتصادی، اثرات گسترده‌ای بر بخش‌های مختلف از جمله صنعت سلامت دارد که در سال‌های اخیر به‌وضوح قابل‌مشاهده بوده است.\n\nافزایش هزینه‌های تولید، از جمله مواد اولیه، انرژی و دستمزد نیروی کار، مستقیماً بر قیمت تمام‌شده داروها و تجهیزات پزشکی تاثیر می‌گذارد.\n\nاین فشار هزینه‌ای در نهایت به مصرف‌کننده نهایی منتقل می‌شود و می‌تواند دسترسی اقشار کم‌درآمد به داروهای ضروری را با چالش مواجه کند.\n\nکارشناسان اقتصاد سلامت تاکید دارند که سیاست‌های حمایتی هدفمند، مانند یارانه دارویی برای گروه‌های آسیب‌پذیر، می‌تواند بخشی از این فشار را در دوران تورمی کاهش دهد.','blog-posts/negahe-tahlili-tasire-tavarom-bar-salamat.jpg',NULL,'published',NULL,'2026-03-24 08:55:18',0,'rrboJ9','2026-06-22 08:55:18','2026-06-22 08:55:18'),(24,1,5,'تحلیل آینده صنعت دارو در ایران؛ فرصت‌ها و چالش‌ها',NULL,'tahlile-ayande-sanate-daro-forsathaa-chalesh','صنعت دارو در ایران در نقطه‌ای حساس از مسیر توسعه خود قرار دارد و آینده آن به عوامل متعددی از جمله سیاست‌های ارزی، سرمایه‌گذاری در فناوری و روابط بین‌المللی بستگی دارد. این تحلیل به بررسی فرصت‌های پیش رو، نظیر پتانسیل صادرات به کشورهای منطقه و توسعه فناوری‌های زیستی، در کنار چالش‌هایی مانند تحریم‌ها و وابستگی به مواد اولیه خارجی می‌پردازد. کارشناسان معتقدند با برنامه‌ریزی بلندمدت و حمایت از نوآوری، صنعت دارو می‌تواند به یکی از قطب‌های اقتصادی غیرنفتی کشور تبدیل شود.','صنعت دارو در ایران ظرفیت‌های قابل‌توجهی برای رشد دارد، اما تحقق این پتانسیل نیازمند رفع چالش‌های ساختاری موجود است.\n\nیکی از مهم‌ترین فرصت‌های پیش رو، امکان صادرات داروهای ژنریک باکیفیت به کشورهای همسایه و منطقه است که می‌تواند منبع جدیدی از درآمد ارزی برای کشور ایجاد کند.\n\nدر کنار این فرصت‌ها، وابستگی بالا به واردات مواد اولیه و تجهیزات تخصصی همچنان یکی از مهم‌ترین موانع رشد پایدار این صنعت محسوب می‌شود.\n\nسرمایه‌گذاری در فناوری‌های زیستی و حمایت از استارتاپ‌های نوآور می‌تواند مسیر را برای تبدیل صنعت دارو به یکی از موتورهای اصلی اقتصاد غیرنفتی کشور هموار کند.','blog-posts/tahlile-ayande-sanate-daro-forsathaa-chalesh.jpg',NULL,'published',NULL,'2026-05-08 08:55:18',0,'UBpul4','2026-06-22 08:55:18','2026-06-22 08:55:18'),(25,1,6,'پادکست نبض صدا؛ گفت‌وگو با یک داروساز',NULL,'podcast-nabze-seda-darosaz','در این قسمت از پادکست نبض صدا، میزبان به گفت‌وگو با یکی از داروسازان باسابقه صنعت می‌نشیند تا تجربیات او را از سال‌های فعالیت در این حوزه بشنود. این گفت‌وگو به موضوعاتی مانند تغییرات صنعت دارو در دو دهه اخیر، چالش‌های روزانه یک داروساز و توصیه‌هایی برای نسل جدید فعالان این حرفه می‌پردازد.','پادکست نبض صدا در این قسمت میزبان یکی از داروسازان شناخته‌شده صنعت است که بیش از بیست سال تجربه فعالیت در داروخانه‌های شهری و روستایی دارد.\r\n\r\nدر بخش نخست گفت‌وگو، میهمان برنامه از تغییرات بزرگی که صنعت دارو در دو دهه اخیر تجربه کرده، از جمله دیجیتالی‌شدن نسخه‌ها، صحبت می‌کند.\r\n\r\nبخش دوم گفت‌وگو به چالش‌های روزمره یک داروساز، از مدیریت موجودی تا ارتباط با بیماران، اختصاص دارد و نکات عملی ارزشمندی را در بر می‌گیرد.\r\n\r\nدر پایان، میهمان برنامه توصیه‌هایی صمیمانه برای دانشجویان و فارغ‌التحصیلان جدید رشته داروسازی ارائه می‌دهد که می‌تواند راهنمای خوبی برای شروع مسیر حرفه‌ای آن‌ها باشد.','assets/images/8jKAZNcstAzfHuhWWa0wYwV9TYgwDOCqBbIZoW6K.jpg',NULL,'published',NULL,'2026-05-24 08:55:18',0,'NRger7','2026-06-22 08:55:18','2026-06-22 15:55:03'),(26,1,6,'گفت‌وگوی اختصاصی با مدیر یک شرکت دارویی',NULL,'goftegoo-ekhtesasi-modir-sherkat-daroei','در این گفت‌وگوی اختصاصی، با مدیرعامل یکی از شرکت‌های فعال در حوزه تولید دارو درباره چشم‌انداز صنعت، چالش‌های پیش رو و برنامه‌های توسعه‌ای این شرکت صحبت کرده‌ایم. این مصاحبه نگاهی نزدیک به فرآیند تصمیم‌گیری در سطح مدیریتی صنعت دارو ارائه می‌دهد و دیدگاه‌های ارزشمندی درباره سرمایه‌گذاری، نوآوری و روابط با نهادهای نظارتی در اختیار شنونده قرار می‌دهد.','این گفت‌وگو با مدیرعامل یکی از شرکت‌های تولیدکننده دارو انجام شده که در سال‌های اخیر رشد قابل‌توجهی در بازار داخلی و منطقه‌ای داشته است.\r\n\r\nمیهمان برنامه در بخش نخست از استراتژی‌های شرکت برای مقابله با نوسانات ارزی و تامین پایدار مواد اولیه صحبت می‌کند.\r\n\r\nدر ادامه، موضوع سرمایه‌گذاری در فناوری‌های نوین تولید و اهمیت رعایت استانداردهای بین‌المللی برای ورود به بازارهای صادراتی مورد بحث قرار می‌گیرد.\r\n\r\nمصاحبه با نگاهی به آینده، چشم‌انداز توسعه شرکت در سال‌های پیش رو و برنامه‌های همکاری با نهادهای دانشگاهی و تحقیقاتی به پایان می‌رسد.','assets/images/KMGF8RrBK8XhQkmbmK7YMRkLD5I4jYIrUtnxy4mz.jpg',NULL,'published',NULL,'2026-04-17 08:55:18',0,'lTnru1','2026-06-22 08:55:18','2026-06-22 15:58:58'),(27,1,6,'میزگرد بررسی چالش‌های بیمه دارویی',NULL,'mizgerd-bime-daroei','در این میزگرد، جمعی از کارشناسان حوزه بیمه سلامت و نمایندگان صنعت دارو گرد هم آمده‌اند تا چالش‌های موجود در پوشش بیمه‌ای داروها را مورد بحث و بررسی قرار دهند. موضوعاتی مانند کافی نبودن سهم بیمه برای برخی داروهای پرهزینه، تاخیر در بازپرداخت هزینه‌ها به داروخانه‌ها و راهکارهای پیشنهادی برای بهبود این وضعیت در این گفت‌وگو مطرح می‌شود.','میزگرد حاضر با حضور کارشناسان بیمه سلامت، نمایندگان داروخانه‌ها و یک پژوهشگر اقتصاد سلامت برگزار شده و به یکی از مهم‌ترین دغدغه‌های بیماران مزمن می‌پردازد.\r\n\r\nدر بخش نخست بحث، شرکت‌کنندگان به ناکافی بودن سهم بیمه برای داروهای پرهزینه و بیماری‌های خاص اشاره می‌کنند و این موضوع را عاملی برای فشار مالی بر بیماران می‌دانند.\r\n\r\nموضوع تاخیر در تسویه حساب سازمان‌های بیمه‌گر با داروخانه‌ها نیز از دیگر محورهای مهم این گفت‌وگو است که به گفته شرکت‌کنندگان، گردش مالی داروخانه‌ها را با مشکل مواجه کرده است.\r\n\r\nدر پایان میزگرد، پیشنهادهایی برای اصلاح ساختار بیمه دارویی، با الهام از تجربه برخی کشورهای منطقه، مطرح می‌شود که می‌تواند مبنایی برای سیاست‌گذاری‌های آینده باشد.','blog-posts/mizgerd-bime-daroei.jpg',NULL,'published',NULL,'2026-02-23 08:55:18',0,'eKZTq3','2026-06-22 08:55:18','2026-06-22 13:53:29'),(28,1,7,'ویدئوی اختصاصی: نگاهی به خط تولید یک کارخانه دارویی',NULL,'video-ekhtesasi-khate-tolide-karkhane-daroei','در این گزارش ویدئویی اختصاصی، دوربین نبض TV به یکی از کارخانه‌های مدرن تولید دارو در ایران سفر کرده تا مراحل مختلف تولید یک محصول دارویی را از نزدیک نشان دهد. از ورود مواد اولیه تا بسته‌بندی نهایی، بینندگان می‌توانند با استانداردهای کیفی و فرآیندهای دقیق کنترل کیفیت در یک خط تولید مدرن آشنا شوند. این ویدئو همچنین گفت‌وگویی کوتاه با مدیر کنترل کیفیت کارخانه را شامل می‌شود','این گزارش ویدئویی با هدف نمایش شفاف فرآیند تولید دارو در یکی از کارخانه‌های پیشرو کشور تهیه شده است تا مخاطبان از نزدیک با این فرآیند آشنا شوند.\r\n\r\nدر بخش نخست ویدئو، مراحل ورود و کنترل کیفیت مواد اولیه نمایش داده می‌شود که نخستین گام در تضمین کیفیت محصول نهایی محسوب می‌شود.\r\n\r\nدر ادامه، خط تولید اصلی و فرآیندهای اتوماتیک فرموله‌سازی و بسته‌بندی به تصویر کشیده می‌شود که نشان‌دهنده سطح بالای فناوری به‌کار رفته در این کارخانه است.\r\n\r\nگفت‌وگوی پایانی با مدیر کنترل کیفیت کارخانه نیز به اهمیت رعایت دقیق استانداردهای GMP در هر مرحله از تولید می‌پردازد و نکات ارزشمندی را با بینندگان به اشتراک می‌گذارد.','blog-posts/video-ekhtesasi-khate-tolide-karkhane-daroei.jpg',NULL,'published',NULL,'2026-06-08 08:55:19',0,'OIrKF1','2026-06-22 08:55:19','2026-06-22 13:53:52'),(29,1,8,'گزارش سمینار تخصصی صنعت دارو',NULL,'gozareshe-seminar-takhasosi-sanate-daro','سمینار تخصصی صنعت دارو با حضور جمعی از کارشناسان، تولیدکنندگان و مسئولان حوزه سلامت برگزار شد و موضوعاتی نظیر چالش‌های تامین مواد اولیه، فرصت‌های صادراتی و سیاست‌های قیمت‌گذاری مورد بحث قرار گرفت. سخنرانان این رویداد بر لزوم همکاری نزدیک‌تر میان بخش خصوصی و نهادهای دولتی برای رفع موانع پیش روی صنعت تاکید کردند.','سمینار تخصصی صنعت دارو امسال با استقبال گسترده‌ای از سوی فعالان این حوزه برگزار شد و موضوعات متنوعی در آن مورد بحث قرار گرفت.\r\n\r\nیکی از محورهای اصلی سخنرانی‌ها، بررسی راهکارهای کاهش وابستگی به واردات مواد اولیه و توسعه تولید داخلی این مواد بود که با استقبال زیادی از سوی حاضران روبه‌رو شد.\r\n\r\nموضوع دیگری که در این سمینار به آن پرداخته شد، فرصت‌های صادراتی صنعت دارو به کشورهای منطقه بود که برخی سخنرانان آن را یکی از مسیرهای اصلی رشد آینده این صنعت دانستند.\r\n\r\nنمایشگاه جانبی این رویداد نیز فرصتی برای معرفی دستاوردهای چند شرکت دانش‌بنیان فراهم کرد و بازخورد مثبتی از سوی بازدیدکنندگان دریافت کرد.','assets/images/jmyenqrTrosJSrt1ZJrzZSlBC6PKQRDjWlU3xTTV.jpg',NULL,'published',NULL,'2026-06-16 08:55:19',6,'HRIDb8','2026-06-22 08:55:19','2026-06-22 17:55:01'),(30,1,8,'اصلاح الگوی مصرف دارو برای مقابله با هدررفت و مقاومت میکروبی ضروری است','رئیس سازمان غذا و دارو خبر داد در گفتگو با وبدا','bargozari-conference-beynolmelali-salamat-dijital','کنفرانس بین‌المللی سلامت دیجیتال با حضور پژوهشگران و فعالان داخلی و خارجی این حوزه برگزار شد و آخرین دستاوردهای جهانی در زمینه هوش مصنوعی پزشکی، تله‌مدیسین و سلامت همراه را به نمایش گذاشت. سخنرانان مهمان از چند کشور درباره تجربه‌های موفق پیاده‌سازی فناوری‌های دیجیتال در نظام سلامت کشورهای خود صحبت کردند.','<p class=\"ql-align-justify\">دکتر مهدی پیرصالحی، رئیس سازمان غذا و دارو، در گفتگو با خبرنگار وبدا با اشاره به اولویت‌های این سازمان برای تأمین پایدار داروهای حیاتی به‌ویژه برای بیماران پیوندی، اظهار کرد: مدیریت مصرف دارو و کاهش هدررفت دارویی از مهم‌ترین برنامه‌های جاری سازمان است.</p><p class=\"ql-align-justify\">وی با یادآوری سابقه ۲۷ ساله کمیته «تجویز و مصرف منطقی دارو» افزود: با وجود دستاوردهای ارزشمند این کمیته، تغییر الگوهای مصرف پس از دوران کرونا و افزایش تجویزهای غیرمنطقی، ضرورت بازنگری در سیاست‌ها را دوچندان کرده است. در همین راستا، یکی از پنج کمیته تخصصی وزارت بهداشت با مشارکت سازمان‌های بیمه‌گر و انجمن‌های علمی، به طور ویژه بر اصلاح فرآیندهای تجویز و نظارت بر آن متمرکز شده است.</p><p class=\"ql-align-justify\">نظارت بر داروهای خارج از اندیکاسیون</p><p class=\"ql-align-justify\">رئیس سازمان غذا و دارو تصریح کرد: متأسفانه در مواردی مشاهده می‌شود داروهایی که با اهداف علمی و برای بیماری‌های مشخص در فهرست دارویی قرار گرفته‌اند، خارج از اندیکاسیون‌های مصوب و بدون ضرورت علمی تجویز می‌شوند که این روند نیازمند کنترل و نظارت دقیق‌تر است.</p><p class=\"ql-align-justify\">هشدار نسبت به مصرف بی‌رویه آنتی‌بیوتیک‌ها</p><p class=\"ql-align-justify\">دکتر پیرصالحی با تأکید بر مصرف بالای آنتی‌بیوتیک‌ها و سرم‌های تزریقی در کشور، گفت: بسیاری از بیماری‌های شایع نظیر سرماخوردگی نیازی به این اقلام ندارند. مصرف غیرضروری آنتی‌بیوتیک‌ها علاوه بر تحمیل هزینه‌های اضافه به نظام سلامت، منجر به افزایش خطر «مقاومت میکروبی» می‌شود که یکی از بزرگترین تهدیدهای سلامت در آینده نزدیک است.</p><p class=\"ql-align-justify\">۱۸ درصد بازار دارویی در منازل خاک می‌خورد</p><p class=\"ql-align-justify\">وی با اشاره به نتایج مطالعات دانشگاهی مبنی بر اینکه حدود ۱۸ درصد از کل بازار دارویی کشور به صورت داروهای باقی‌مانده و مصرف‌نشده در منازل نگهداری می‌شود، خاطرنشان کرد: از آنجا که دارو پس از خروج از چرخه توزیع رسمی به دلیل عدم اطمینان از شرایط نگهداری، قابل بازگشت به سیستم نیست، تنها راهکار منطقی، تجویز و تحویل دارو متناسب با نیاز واقعی بیمار است.</p><p class=\"ql-align-justify\">رئیس سازمان غذا و دارو در پایان ابراز امیدواری کرد: با همکاری پزشکان در تجویز صحیح، نظارت سازمان‌های بیمه‌گر و افزایش سطح آگاهی جامعه، بتوان ضمن تأمین پایدار داروهای حیاتی، از هدررفت گسترده منابع مالی و دارویی کشور جلوگیری کرد.</p>','assets/images/guaI3Ts2lcyAyLh8G2pWnt6hXviilzDWrsaUHc7e.jpg',NULL,'published',NULL,'2026-04-28 08:55:19',3,'swIcn2','2026-06-22 08:55:19','2026-06-22 17:50:02'),(31,1,NULL,'حضور دانشگاه علوم پزشکی آزاد اسلامی تهران در بیست و دومین دوره سمینار دانشجویان داروسازی',NULL,'hdor-danshkdh-darosazy-danshgah-aalom-pzshky-azad-aslamy-thran-dr-byst-o-domyn-dorh-smynar-danshgoyan-darosazy-srasr-kshor','در بیست و دومین دوره سمینار دانشجویان داروسازی سراسر کشور که به میزبانی دانشکده داروسازی زنجان برگزار شد دانشکده داروسازی دانشگاه علوم پزشکی آزاد اسلامی تهران موفق به کسب مقام اول شد.','<p class=\"ql-align-right ql-direction-rtl\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(51, 51, 51);\">به گزارش روابط عمومی دانشکده داروسازی و علوم دارویی دانشگاه علوم پزشکی آزاد اسلامی تهران، این دانشکده در بیست و دومین دوره سمینار دانشجویان داروسازی سراسر کشور که به میزبانی دانشکده داروسازی زنجان از 27 تا 30 فروردین ماه برگزار شد، موفق به کسب مقام اول شد.</span></p><p class=\"ql-align-right ql-direction-rtl\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(51, 51, 51);\">به گفته دکتر زهرا جعفری آذر، رئیس دانشکده داروسازی و علوم دارویی، در این دوره که همانند ادوار گذشته، تمامی دانشکده های داروسازی سراسر کشور حضور داشتند، دانشجویان دانشکده داروسازی دانشگاه علوم پزشکی آزاد اسلامی تهران، با کسب ۱۳ رتبه برتر در بخش های علمی و صنفی، مقام اول را در بین دانشکده های داروسازی سراسر کشور کسب کردند.</span></p><p class=\"ql-align-right ql-direction-rtl\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(51, 51, 51);\">بر اساس این گزارش، دانشجویان: مهتا حسینی، رتبه اول ارائه شفاهی فارماکوگنوز، دکتر دلارام سلطانی، رتبه اول ارائه شفاهی صنفی، دکتر نرگس حصنی، رتبه اول پوستر داروسازی بالینی، مهتا اسمعیلی، رتبه اول پوستر بیوفارمسی، فاطمه پورحاتمی، رتبه اول پوستر مدیریت اقتصاد دارو و رتبه سوم پوستر صنفی، سینا خداکرمی، رتبه اول نقشه مفهومی موضوع صنفی، خانم شیدا خسروی، رتبه اول نقشه مفهومی داروسازی بالینی، ریحانه معصومی، رتبه اول نقشه مفهومی فارماسیوتیکیس، وهاب دانشجو، رتبه اول جشنواره فرهنگی، رضا کبیری، رتبه اول جشنواره فرهنگی، آذین عزتی، رتبه دوم پوستر فارماسیوتیکس و مرضیه غلامی، رتبه دوم پوستر کنترل دارو و فرآورده های آرایشی و بهداشتی را از آن خود کردند.</span></p><p class=\"ql-align-right ql-direction-rtl\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(51, 51, 51);\">روابط عمومی دانشگاه علوم پزشکی آزاد اسلامی تهران ضمن تبریک این موفقیت بزرگ به هیات رئیسه، برای این عزیزان آرزوی سلامتی و موفقیت روزافزون دارد.</span></p>','assets/images/IXi9LzJ1S80TrxdKlXwKGZ2CawjqrTkBh0zgtpxg.jpg',NULL,'published',NULL,'2026-06-22 14:46:00',1,'snCGz7','2026-06-22 14:45:04','2026-07-13 22:54:26'),(32,1,NULL,'سمینار برگزاری کنفرانس یکروزه برندینگ در صنعت دارو','به گزارش روابط عمومی دانشکده علوم تغذیه و رژیم شناسی دانشگاه علوم پزشکی تهران','smynar-brgzary-knfrans-ykrozh-brndyng-dr-snaat-daro','سمینار یکروزه برندینگ در صنعت داروسازی با حضور و سخنرانی دکتر بابک بهبودی، دکتر فرید عابدین درکوش و دکتر امیرحسین معینی زند صبح یکشنبه برگزار  شد.','<p class=\"ql-direction-rtl ql-align-right\">سمینار یکروزه برندینگ در صنعت داروسازی با حضور و سخنرانی دکتر بابک بهبودی، دکتر فرید عابدین درکوش و دکتر امیرحسین معینی زند صبح یکشنبه برگزار و تاکید شد: در حالی که این روزها صنعت داروسازی کشور در پسابرجام، به آمادگي روزافزون برای پيوستن ايران به سازمان تجارت جهاني و رقابت با شرکت های چندمليتي نیاز دارد. بنابراین ایجاد و گسترش برند دارو آثار اقتصادی متعددی به ارمغان خواهد آورد. ‎</p><p class=\"ql-direction-rtl ql-align-right\">دکتر بابک بهبودی، کارشناس برندینگ ضمن بیان این موضوع که در حال حاضر در ایران برند وجود ندارد، افزود: اعتقاد دارم که در ایران برند نداریم. کشور ایران از نظر حوزه دارویی چه جایگاهی دارد؟ سالی چند نوآوری انجام می‌شود؟ چقدر تولید دارویی ژنریک خود را داریم؟ امروز که درباره برندسازی دارو صحبت می‌کنیم، یک‌سری اساس‌های مهم را در کشور نداریم در حالی که در دنیا شرکت‌های دارویی هستند که تنها برای یک داروی ام‌اس خود ۲۳ میلیارد دلار فروش دارند.</p><p class=\"ql-direction-rtl ql-align-right\">بهبودی معتقد است که کمتر شرکت داروسازی در ایران پیدا می‌شود که تحقیقات بنیادین انجام دهد. این کارشناس برندینگ با تاکید بر اینکه در نهایت برندسازی شرکت‌های داروسازی می‌خواهند که داروهایشان به دست بیمار برسد، توضیح داد: «باید توجه داشت که این بیمار کیست؟ امروزه دنیا ۴ نسل در دنیا وجود دارد. صنعت داروسازی کشور اکنون دارد برای نسلی دارو می‌سازد که از کودکی تبلت به دست دارد و می‌داند که چگونه باید خود را درمان کند. پزشکی در حال پیشرفت است و تا سال ۲۰۵۰ بسیاری از شرکت‌های دارویی که به شکل امروز کار می‌کنند، دیگر وجود نخواهند داشت. بازار هم فراموش می‌کند اما نمی‌بخشد و با ورشکست کردن شرکت‌ها انتقام خود را می‌گیرد.»</p><p class=\"ql-direction-rtl ql-align-right\">او با اشاره به اینکه بیماری‌های گوارشی و تنفسی در کشور افزایش یافته، توضیح داد: « در حال حاضر ما پایتخت بیماری‌های گوارشی و تنفسی در دنیا هستیم. پس بازار آتی صنعت داروسازی کشور باید داروهای گوارشی و تنفسی باشد.</p><p class=\"ql-direction-rtl ql-align-right\">همچنین بهبودی معتقد است که تحقیق و توسعه در صنعت داروسازی دنیا تغییر کرده واز فرمول بیرون آمده است. او توضیح می‌دهد: « پایداری، سود و رشد سه هدف اصلی هر شرکت و کسب‌و‌کاری است. انسان‌ها زمانی که نیازهایشان برآورده شود، دیگر به سراغ شما نمی‌آیند. بیمار بعد از بهبودی نیازی به مصرف دارو ندارند، در نتیجه برای تحقق این سه هدف، وفاداری بیمار نمی‌تواند پاسخ مناسبی باشد. در دنیا شرکت‌های داروسازی می‌توانند کوچک باشند و بالاترین رشد و توسعه را در صنعت داروسازی هم داشته باشند. پس برای ماندگاری نیاز به برندسازی است که امکان‌پذیر است ولی آسان نیست. وقتی یک شرکت داروسازی برند قوی داشته باشد، به عنوان یک برند شروع بسیار قوی خواهد داشت. همه شرکت‌ها می‌خواهند با آن رقابت کنند، فکر می‌کنند که چند ثانیه از آن عقب هستند. در حالی که اگر برندی وجود نداشته باشد و رقبا همدیگر را نمی‌شناسند، همه می‌توانند موفق باشند.</p><p class=\"ql-direction-rtl ql-align-right\">همچنین دکتر امیرحسین معینی زندی، متخصص مارکتینگ استراتژی و برندینگ شرکت‌های دارویی در سمینار یک‌روزه برندینگ در صنعت داروسازی گفت: برندینگ یک هدف نیست بلکه یک استراتژی است. یک شرکت دارویی را در نظر بگیرید که هدفش فروش ۱۰۰ میلیارد تومان از ۱۲۰ محصول خود در یک سال است. برای رسیدن به این هدف باید یک‌سری استراتژی انجام و هزینه‌هایی صرف شود.»</p><p class=\"ql-direction-rtl ql-align-right\">وی تاکید کرد: یکی از مهم‌ترین ویژگی‌های برندسازی، اقتصادی بودن آن است و بسیاری از شرکت‌های داروسازی بزرگ کشور، می‌توانند با استفاده از برندسازی دوباره به اوج خود بازگردند.</p><p class=\"ql-direction-rtl ql-align-right\">معینی زندی توضیح داد: امروزه هزینه‌های مارکتینگ یک برند ژنریک بیش از۲۰۰ میلیون بسته به زمان است. به عنوان مثال ممکن است یک شرکت دارویی برای تولید یک تیزر حدود ۱۷ میلیارد هزینه کند در حالی که امکان دارد کل درآمد آن این مقدار باشد.این هزینه‌های زیاد و سنگین است اما باید برند سازمان را تقویت کنند و از لحاظ هزینه‌ای این ارجحیت وجود دارد که این برندسازی انجام شود.</p><p class=\"ql-direction-rtl ql-align-right\">این متخصص مارکتینگ استراتژی و برندینگ شرکت‌های دارویی گفت: در حال حاضر تبلیغ از طریق رسانه ملی و رادیو بسیار گران است. اما می‌توان از رسانه‌های ارزانتر و موثری مانند تلگرام و اینستاگرام برای کورپوریت برندینگ استفاده کرد. خوب نیست تعداد فالوئرهای اینستاگرام شرکت‌های دارویی مطرح ایران اینقدر پایین است.» او افزود: «برخی دلقک‌های اینستاگرام ۲ تا ۳ میلیون فالوئر دارند اما تاسف‌بار است که شرکت‌های ایرانی از چنین ظرفیتی استفاده نمی‌کنند.»</p><p class=\"ql-direction-rtl ql-align-right\">این متخصص مارکتینگ استراتژی و برندینگ شرکت‌های دارویی معتقد است که زمانی که یک شرکت دارویی برندسازی سازمانی را انجام دهد، محصولات بعدی خود را راحت‌تر در جامعه پذیرفته می‌شود. معینی زندی توضیح داد: «زمانی من داروخانه داشتم. دارویی یک برند را با اکراه خریداری می‌کردیم و تاریخ آنها می‌گذشت. اما با گذر زمان این برند خواسته یا ناخواسته پذیرفته شده و با برندی که تازه به بازار آمده متفاوت است.</p><p class=\"ql-direction-rtl ql-align-right\">دکتر درکوش دیگر سخنران این نشست تخصصی و استاد دانشگاه در این نشست تخصصی تاکید کرد: برند ثبت شده باعث خواهد شد تا هزینه‌های صرف شده مجدد بازگردد.</p><p class=\"ql-align-right ql-direction-rtl\">به گفته او هزینه‌های برندینگ بالاست اما در عین حال یک سرمایه‌گذاری بلند مدت است و در سال‌های بعد به نتیجه می‌رسد.</p>','assets/images/GLhZtJbgJew26WwepqjERUm11tLjwbZKhiYwD11g.jpg',NULL,'published',NULL,'2026-06-22 14:49:55',5,'pCvTe2','2026-06-22 14:49:25','2026-07-12 13:11:17');
/*!40000 ALTER TABLE `blog_posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blog_tags`
--

DROP TABLE IF EXISTS `blog_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blog_tags` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `blog_tags_slug_unique` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blog_tags`
--

LOCK TABLES `blog_tags` WRITE;
/*!40000 ALTER TABLE `blog_tags` DISABLE KEYS */;
INSERT INTO `blog_tags` VALUES (1,'دارو','daru','2026-06-22 08:55:12','2026-06-22 08:55:12'),(2,'داروی گیاهی','daru-giyahi','2026-06-22 08:55:12','2026-06-22 08:55:12'),(3,'داروی ژنریک','daru-janiraik','2026-06-22 08:55:12','2026-06-22 08:55:12'),(4,'واکسن','vaksan','2026-06-22 08:55:12','2026-06-22 08:55:12'),(5,'واردات دارو','varedat-daru','2026-06-22 08:55:12','2026-06-22 08:55:12'),(6,'صادرات دارو','saderat-daru','2026-06-22 08:55:12','2026-06-22 08:55:12'),(7,'داروخانه','darookhane','2026-06-22 08:55:12','2026-06-22 08:55:12'),(8,'نسخه الکترونیک','noskhe-electronic','2026-06-22 08:55:12','2026-06-22 08:55:12'),(9,'تجهیزات پزشکی','tajhizat-pezeshki','2026-06-22 08:55:12','2026-06-22 08:55:12'),(10,'GMP','gmp','2026-06-22 08:55:12','2026-06-22 08:55:12'),(11,'سازمان غذا و دارو','ifda','2026-06-22 08:55:12','2026-06-22 08:55:12'),(12,'وزارت بهداشت','vezarat-behdasht','2026-06-22 08:55:12','2026-06-22 08:55:12'),(13,'بیمه سلامت','bime-salamat','2026-06-22 08:55:12','2026-06-22 08:55:12'),(14,'مالیات دارویی','maliat-daroo','2026-06-22 08:55:12','2026-06-22 08:55:12'),(15,'بخشنامه','bakhshname','2026-06-22 08:55:12','2026-06-22 08:55:12'),(16,'پرونده حقوقی','parvande-hoghoughi','2026-06-22 08:55:12','2026-06-22 08:55:12'),(17,'قانون‌گذاری','qanoon-gozari','2026-06-22 08:55:12','2026-06-22 08:55:12'),(18,'خواب','khab','2026-06-22 08:55:12','2026-06-22 08:55:12'),(19,'تغذیه','taghzie','2026-06-22 08:55:12','2026-06-22 08:55:12'),(20,'ورزش','varzesh','2026-06-22 08:55:12','2026-06-22 08:55:12'),(21,'استرس','estres','2026-06-22 08:55:12','2026-06-22 08:55:12'),(22,'سلامت روان','salamat-ravan','2026-06-22 08:55:13','2026-06-22 08:55:13'),(23,'بیماری مزمن','bimari-mozmen','2026-06-22 08:55:13','2026-06-22 08:55:13'),(24,'کرونا','korona','2026-06-22 08:55:13','2026-06-22 08:55:13'),(25,'هوش مصنوعی','hoosh-masnoei','2026-06-22 08:55:13','2026-06-22 08:55:13'),(26,'تله‌مدیسین','telemedicine','2026-06-22 08:55:13','2026-06-22 08:55:13'),(27,'سلامت دیجیتال','digital-health','2026-06-22 08:55:13','2026-06-22 08:55:13'),(28,'استارتاپ','startup','2026-06-22 08:55:13','2026-06-22 08:55:13'),(29,'نوآوری','noavari','2026-06-22 08:55:13','2026-06-22 08:55:13'),(30,'اقتصاد','eghtesad','2026-06-22 08:55:13','2026-06-22 08:55:13'),(31,'ارز','arz','2026-06-22 08:55:13','2026-06-22 08:55:13'),(32,'تورم','tavarom','2026-06-22 08:55:13','2026-06-22 08:55:13'),(33,'بازار سرمایه','bazar-sarmaye','2026-06-22 08:55:13','2026-06-22 08:55:13'),(34,'مصاحبه','mosahebe','2026-06-22 08:55:13','2026-06-22 08:55:13'),(35,'گزارش ویژه','gozaresh-vijeh','2026-06-22 08:55:13','2026-06-22 08:55:13'),(36,'تحلیل بازار','tahlil-bazar','2026-06-22 08:55:13','2026-06-22 08:55:13'),(37,'مقاله','maghale','2026-06-22 08:55:13','2026-06-22 08:55:13'),(38,'نمایشگاه','namayeshgah','2026-06-22 08:55:13','2026-06-22 08:55:13'),(39,'وبینار','vebinar','2026-06-22 08:55:13','2026-06-22 08:55:13');
/*!40000 ALTER TABLE `blog_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `breaking_news`
--

DROP TABLE IF EXISTS `breaking_news`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `breaking_news` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `active_from` datetime DEFAULT NULL,
  `active_until` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `breaking_news`
--

LOCK TABLES `breaking_news` WRITE;
/*!40000 ALTER TABLE `breaking_news` DISABLE KEYS */;
INSERT INTO `breaking_news` VALUES (1,'جذب سرمایه داخلی و خارجی تکنولوژی‌های روز را وارد کسب‌وکارها می‌کند',NULL,1,'2026-06-22 14:40:00',NULL,'2026-06-22 14:39:37','2026-06-22 14:39:37'),(2,'فراخوان پذیرش و جذب کارگزاران میز خدمت مجمع تشکل‌های دانش‌بنیان',NULL,1,'2026-06-22 14:41:00',NULL,'2026-06-22 14:40:06','2026-06-22 14:40:06');
/*!40000 ALTER TABLE `breaking_news` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category_field_definitions`
--

DROP TABLE IF EXISTS `category_field_definitions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category_field_definitions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `blog_category_id` bigint unsigned NOT NULL,
  `field_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `field_type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `label` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_required` tinyint(1) NOT NULL DEFAULT '0',
  `options` json DEFAULT NULL,
  `sort_order` smallint unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cat_field_def_unique` (`blog_category_id`,`field_key`),
  CONSTRAINT `category_field_definitions_blog_category_id_foreign` FOREIGN KEY (`blog_category_id`) REFERENCES `blog_categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category_field_definitions`
--

LOCK TABLES `category_field_definitions` WRITE;
/*!40000 ALTER TABLE `category_field_definitions` DISABLE KEYS */;
INSERT INTO `category_field_definitions` VALUES (1,6,'audio','file','audio',1,NULL,0,'2026-06-22 13:49:17','2026-06-22 13:49:17'),(2,7,'video','file','video',1,NULL,0,'2026-06-22 13:49:37','2026-06-22 13:49:37'),(3,8,'from_date','date','از',1,NULL,0,'2026-06-22 14:41:49','2026-06-22 14:41:49'),(4,8,'to_date','date','تا',0,NULL,0,'2026-06-22 14:42:02','2026-06-22 14:42:02'),(5,8,'location','text','مکان',0,NULL,0,'2026-06-22 14:42:12','2026-06-22 14:42:12');
/*!40000 ALTER TABLE `category_field_definitions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cities`
--

DROP TABLE IF EXISTS `cities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cities` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `province_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cities_province_id_foreign` (`province_id`),
  CONSTRAINT `cities_province_id_foreign` FOREIGN KEY (`province_id`) REFERENCES `provinces` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cities`
--

LOCK TABLES `cities` WRITE;
/*!40000 ALTER TABLE `cities` DISABLE KEYS */;
/*!40000 ALTER TABLE `cities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_messages`
--

DROP TABLE IF EXISTS `contact_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_messages` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `phone_number` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subject` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `attachment_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_messages`
--

LOCK TABLES `contact_messages` WRITE;
/*!40000 ALTER TABLE `contact_messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `contact_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gallery`
--

DROP TABLE IF EXISTS `gallery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gallery` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `event` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city_id` bigint unsigned NOT NULL,
  `img` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `year` smallint unsigned NOT NULL,
  `month` tinyint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `gallery_city_id_foreign` (`city_id`),
  CONSTRAINT `gallery_city_id_foreign` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gallery`
--

LOCK TABLES `gallery` WRITE;
/*!40000 ALTER TABLE `gallery` DISABLE KEYS */;
/*!40000 ALTER TABLE `gallery` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2026_05_09_080114_create_permission_tables',1),(5,'2026_05_09_100001_create_provinces_and_cities_table',1),(6,'2026_05_16_000001_create_notes_table',1),(7,'2026_05_17_080149_add_profile_fields_to_users_table',1),(8,'2026_05_18_123436_add_sales_sno_to_users_table',1),(9,'2026_05_18_124000_add_postal_code_to_users_table',1),(10,'2026_05_18_124830_make_users_email_nullable_non_unique',1),(11,'2026_05_18_175945_update_landline_phone_and_add_description_to_users_table',1),(12,'2026_05_22_103920_create_notifications_table',1),(13,'2026_05_23_000001_create_announcements_table',1),(14,'2026_05_23_000002_add_due_date_to_notes_table',1),(15,'2026_05_23_000002_create_announcement_user_table',1),(16,'2026_05_23_000003_add_reminder_sent_at_to_notes_table',1),(17,'2026_05_30_100001_create_blog_tables',1),(18,'2026_06_05_000001_create_tickets_table',1),(19,'2026_06_05_000002_create_ticket_messages_table',1),(20,'2026_06_05_000003_create_ticket_attachments_table',1),(21,'2026_06_05_195634_add_to_user_id_to_tickets_table',1),(22,'2026_06_07_000003_create_gallery_table',1),(23,'2026_06_09_000000_add_district_code_and_birth_date_to_users_table',1),(24,'2026_06_09_000001_add_is_withdrawal_to_users_table',1),(25,'2026_06_09_000002_drop_district_code_from_users_table',1),(26,'2026_06_10_000001_drop_priority_from_tickets_table',1),(27,'2026_06_12_100000_create_assets_table',1),(28,'2026_06_12_110000_drop_unused_columns_from_users_table',1),(29,'2026_06_12_120000_add_parent_id_to_blog_categories_table',1),(30,'2026_06_12_130000_add_icon_thumbnail_to_blog_categories_table',1),(31,'2026_06_12_140000_create_blog_post_categories_table',1),(32,'2026_06_12_200000_rename_roles_name_to_slug_add_display_name',1),(33,'2026_06_16_200000_create_breaking_news_table',1),(34,'2026_06_17_070011_make_active_from_nullable_in_breaking_news_table',1),(35,'2026_06_18_100000_add_video_url_to_blog_posts_table',1),(36,'2026_06_18_100000_create_post_media_table',1),(37,'2026_06_18_100001_create_category_media_requirements_table',1),(38,'2026_06_19_000001_replace_category_media_requirements_with_field_definitions',1),(39,'2026_06_19_000002_create_post_field_values_table',1),(40,'2026_06_19_000003_create_ad_banners_table',1),(41,'2026_06_19_110000_create_contact_messages_table',1),(42,'2026_06_20_000001_create_blog_post_views_table',1),(43,'2026_06_20_000002_extend_blog_post_views_table',1),(44,'2026_06_20_000002_make_blog_comments_email_nullable',1),(45,'2026_06_20_000003_add_scheduled_publishing_to_blog_posts',1),(46,'2026_06_22_000001_add_short_link_to_blog_posts',1),(47,'2026_06_22_155635_drop_lead_from_blog_posts',2);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `model_has_permissions`
--

DROP TABLE IF EXISTS `model_has_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `model_has_permissions` (
  `permission_id` bigint unsigned NOT NULL,
  `model_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`),
  CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `model_has_permissions`
--

LOCK TABLES `model_has_permissions` WRITE;
/*!40000 ALTER TABLE `model_has_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `model_has_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `model_has_roles`
--

DROP TABLE IF EXISTS `model_has_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `model_has_roles` (
  `role_id` bigint unsigned NOT NULL,
  `model_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`),
  CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `model_has_roles`
--

LOCK TABLES `model_has_roles` WRITE;
/*!40000 ALTER TABLE `model_has_roles` DISABLE KEYS */;
INSERT INTO `model_has_roles` VALUES (1,'App\\Models\\User',1),(2,'App\\Models\\User',2),(3,'App\\Models\\User',3);
/*!40000 ALTER TABLE `model_has_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notes`
--

DROP TABLE IF EXISTS `notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `body` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `due_date` date DEFAULT NULL,
  `reminder_sent_at` timestamp NULL DEFAULT NULL,
  `is_done` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notes_user_id_foreign` (`user_id`),
  CONSTRAINT `notes_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notes`
--

LOCK TABLES `notes` WRITE;
/*!40000 ALTER TABLE `notes` DISABLE KEYS */;
/*!40000 ALTER TABLE `notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notifiable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notifiable_id` bigint unsigned NOT NULL,
  `data` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notifications_notifiable_type_notifiable_id_index` (`notifiable_type`,`notifiable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (1,'users.create','web','2026-06-22 08:55:11','2026-06-22 08:55:11'),(2,'users.edit','web','2026-06-22 08:55:11','2026-06-22 08:55:11'),(3,'users.delete','web','2026-06-22 08:55:11','2026-06-22 08:55:11'),(4,'tickets.assign','web','2026-06-22 08:55:11','2026-06-22 08:55:11'),(5,'tickets.close','web','2026-06-22 08:55:11','2026-06-22 08:55:11'),(6,'tickets.respond','web','2026-06-22 08:55:11','2026-06-22 08:55:11'),(7,'blog.create','web','2026-06-22 08:55:11','2026-06-22 08:55:11'),(8,'blog.edit','web','2026-06-22 08:55:11','2026-06-22 08:55:11'),(9,'blog.delete','web','2026-06-22 08:55:11','2026-06-22 08:55:11'),(10,'blog_categories.create','web','2026-06-22 08:55:11','2026-06-22 08:55:11'),(11,'blog_categories.edit','web','2026-06-22 08:55:11','2026-06-22 08:55:11'),(12,'blog_categories.delete','web','2026-06-22 08:55:11','2026-06-22 08:55:11'),(13,'tags.create','web','2026-06-22 08:55:11','2026-06-22 08:55:11'),(14,'tags.delete','web','2026-06-22 08:55:11','2026-06-22 08:55:11'),(15,'comments.approve','web','2026-06-22 08:55:11','2026-06-22 08:55:11'),(16,'comments.discard','web','2026-06-22 08:55:11','2026-06-22 08:55:11'),(17,'announcements.manage','web','2026-06-22 08:55:11','2026-06-22 08:55:11'),(18,'attachments.add','web','2026-06-22 08:55:11','2026-06-22 08:55:11'),(19,'attachments.edit','web','2026-06-22 08:55:11','2026-06-22 08:55:11'),(20,'attachments.delete','web','2026-06-22 08:55:11','2026-06-22 08:55:11'),(21,'roles.manage','web','2026-06-22 08:55:11','2026-06-22 08:55:11'),(22,'maintenance.manage','web','2026-06-22 08:55:11','2026-06-22 08:55:11'),(23,'reporting.get','web','2026-06-22 08:55:11','2026-06-22 08:55:11');
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_field_values`
--

DROP TABLE IF EXISTS `post_field_values`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_field_values` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `blog_post_id` bigint unsigned NOT NULL,
  `category_field_definition_id` bigint unsigned NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `post_field_value_unique` (`blog_post_id`,`category_field_definition_id`),
  KEY `post_field_values_category_field_definition_id_foreign` (`category_field_definition_id`),
  CONSTRAINT `post_field_values_blog_post_id_foreign` FOREIGN KEY (`blog_post_id`) REFERENCES `blog_posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `post_field_values_category_field_definition_id_foreign` FOREIGN KEY (`category_field_definition_id`) REFERENCES `category_field_definitions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_field_values`
--

LOCK TABLES `post_field_values` WRITE;
/*!40000 ALTER TABLE `post_field_values` DISABLE KEYS */;
INSERT INTO `post_field_values` VALUES (1,29,3,'2026-05-29','2026-06-22 14:42:58','2026-06-22 14:42:58'),(2,29,4,NULL,'2026-06-22 14:42:58','2026-06-22 14:42:58'),(3,29,5,'تهران- هتل المپیک','2026-06-22 14:42:58','2026-06-22 14:42:58'),(4,31,3,'2026-06-23','2026-06-22 14:45:26','2026-06-22 14:45:26'),(5,31,4,NULL,'2026-06-22 14:45:26','2026-06-22 14:45:26'),(6,31,5,'دانشکده داروسازی دانشگاه علوم پزشکی آزاد تهران','2026-06-22 14:45:26','2026-07-13 22:54:26'),(7,32,3,'2026-06-25','2026-06-22 14:49:55','2026-06-22 14:49:55'),(8,32,4,NULL,'2026-06-22 14:49:55','2026-06-22 14:49:55'),(9,32,5,'مرکز همایش‌های برج میلاد تهران','2026-06-22 14:49:55','2026-06-22 14:49:55');
/*!40000 ALTER TABLE `post_field_values` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_media`
--

DROP TABLE IF EXISTS `post_media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_media` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `model_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint unsigned NOT NULL,
  `collection_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `disk` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'public',
  `mime_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `size` bigint unsigned NOT NULL,
  `custom_properties` json DEFAULT NULL,
  `order_column` smallint unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `post_media_model_type_model_id_index` (`model_type`,`model_id`),
  KEY `post_media_model_collection` (`model_type`,`model_id`,`collection_name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_media`
--

LOCK TABLES `post_media` WRITE;
/*!40000 ALTER TABLE `post_media` DISABLE KEYS */;
INSERT INTO `post_media` VALUES (1,'App\\Models\\BlogPost',25,'audio','01 - ConKi - Let It Go','01 - ConKi - Let It Go.mp3','post-media/audio/25/ZImDpnkB7ay1brUVr4mb7u2JtziQpNDfjGja6AkB.mp3','public','audio/mpeg',6934602,NULL,0,'2026-06-22 13:52:35','2026-06-22 13:52:35'),(2,'App\\Models\\BlogPost',26,'audio','@thenimbuss دریای بی‌آرام _ ویگن ','@thenimbuss دریای بی‌آرام _ ویگن .mp3','post-media/audio/26/i7VAlkCprWX5Vdr5tmqA80RRQa6TK9Ct2fr2LLjp.mp3','public','audio/mpeg',4944618,NULL,0,'2026-06-22 13:53:07','2026-06-22 13:53:07'),(3,'App\\Models\\BlogPost',27,'audio','6961307720_final_1781629543','6961307720_final_1781629543.mp3','post-media/audio/27/ynqSKxpKx49KIHWm9wehuQqFHMjOMdjXyCWRMVpG.mp3','public','audio/mpeg',2559765,NULL,0,'2026-06-22 13:53:28','2026-06-22 13:53:28'),(4,'App\\Models\\BlogPost',28,'video','720p','720p.mp4','post-media/video/28/YAMVW9RllwkNbXV6tdxwZ7KPIxRjr01W9MxII0A2.mp4','public','video/mp4',3511546,NULL,0,'2026-06-22 13:53:42','2026-06-22 13:53:42'),(5,'App\\Models\\BlogPost',18,'video','tutorial2','tutorial2.mp4','post-media/video/18/disMjJyrxFGa4xKqZm6RqS370yEPddFtrYICZjXq.mp4','public','video/mp4',10515339,NULL,0,'2026-06-22 14:20:59','2026-06-22 14:20:59');
/*!40000 ALTER TABLE `post_media` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `provinces`
--

DROP TABLE IF EXISTS `provinces`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `provinces` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `provinces`
--

LOCK TABLES `provinces` WRITE;
/*!40000 ALTER TABLE `provinces` DISABLE KEYS */;
/*!40000 ALTER TABLE `provinces` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_has_permissions`
--

DROP TABLE IF EXISTS `role_has_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_has_permissions` (
  `permission_id` bigint unsigned NOT NULL,
  `role_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`permission_id`,`role_id`),
  KEY `role_has_permissions_role_id_foreign` (`role_id`),
  CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_has_permissions`
--

LOCK TABLES `role_has_permissions` WRITE;
/*!40000 ALTER TABLE `role_has_permissions` DISABLE KEYS */;
INSERT INTO `role_has_permissions` VALUES (1,1),(2,1),(3,1),(4,1),(5,1),(6,1),(7,1),(8,1),(9,1),(10,1),(11,1),(12,1),(13,1),(14,1),(15,1),(16,1),(17,1),(18,1),(19,1),(20,1),(21,1),(22,1),(23,1),(7,2),(8,2),(9,2),(10,2),(11,2),(12,2),(13,2),(14,2),(15,2),(16,2),(7,3),(8,3),(9,3);
/*!40000 ALTER TABLE `role_has_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_guard_name_unique` (`slug`,`guard_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'مدیر کل','admin','web','2026-06-22 08:55:12','2026-06-22 08:55:12'),(2,'همکار محتوا','contributor','web','2026-06-22 08:55:12','2026-06-22 08:55:12'),(3,'نویسنده','writer','web','2026-06-22 08:55:12','2026-06-22 08:55:12');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('aMQTMsmodwfQFyJSFR94Z0cZNwW25vmtc4nLvwGy',NULL,'172.19.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiR3VUVlpIRnFPY2lMSVBhZVdXalliYllRQzluODVLSWRtRWdwS29pdCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODg4OCI7czo1OiJyb3V0ZSI7czoxMzoiZnJvbnQubGFuZGluZyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1784696042);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticket_attachments`
--

DROP TABLE IF EXISTS `ticket_attachments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ticket_attachments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `ticket_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `original_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mime_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `size` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ticket_attachments_ticket_id_foreign` (`ticket_id`),
  KEY `ticket_attachments_user_id_foreign` (`user_id`),
  CONSTRAINT `ticket_attachments_ticket_id_foreign` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ticket_attachments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket_attachments`
--

LOCK TABLES `ticket_attachments` WRITE;
/*!40000 ALTER TABLE `ticket_attachments` DISABLE KEYS */;
/*!40000 ALTER TABLE `ticket_attachments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticket_messages`
--

DROP TABLE IF EXISTS `ticket_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ticket_messages` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `ticket_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `body` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_staff` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ticket_messages_ticket_id_foreign` (`ticket_id`),
  KEY `ticket_messages_user_id_foreign` (`user_id`),
  CONSTRAINT `ticket_messages_ticket_id_foreign` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ticket_messages_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket_messages`
--

LOCK TABLES `ticket_messages` WRITE;
/*!40000 ALTER TABLE `ticket_messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `ticket_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tickets`
--

DROP TABLE IF EXISTS `tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tickets` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `to_user_id` bigint unsigned DEFAULT NULL,
  `assigned_to` bigint unsigned DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `department` enum('technical','financial','support') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'support',
  `status` enum('open','in_progress','closed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'open',
  `closed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tickets_user_id_foreign` (`user_id`),
  KEY `tickets_assigned_to_foreign` (`assigned_to`),
  KEY `tickets_to_user_id_foreign` (`to_user_id`),
  CONSTRAINT `tickets_assigned_to_foreign` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `tickets_to_user_id_foreign` FOREIGN KEY (`to_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `tickets_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tickets`
--

LOCK TABLES `tickets` WRITE;
/*!40000 ALTER TABLE `tickets` DISABLE KEYS */;
/*!40000 ALTER TABLE `tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mobile` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `melli_code` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_suspended` tinyint(1) NOT NULL DEFAULT '0',
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `city_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_melli_code_unique` (`melli_code`),
  KEY `users_city_id_foreign` (`city_id`),
  CONSTRAINT `users_city_id_foreign` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'محمدرضا رستگاران','admin@salesportal.test','09057507969','1742714439',NULL,'$2y$12$MezXl0rpKWW.5kxKY3ULledfo5VtS/mlnxZ9lTl82pdXSywCAVu1S',0,NULL,'2026-06-22 08:55:12','2026-06-22 08:55:12',NULL),(2,'کاربر مشارکت کننده','contributor@salesportal.test','09128765432',NULL,NULL,'$2y$12$dq7PTo./oi3BCYd3WL66K.pq.fy1JY293slCeYddQ/8qwtM62mjX2',0,NULL,'2026-06-22 09:23:47','2026-06-22 09:23:47',NULL),(3,'کاربر نویسنده','writer@salesportal.test','09214856002',NULL,NULL,'$2y$12$NQqAcQTxvWrO.XRCeiOVpOZ9gwO7owOf3sH044fmdYBTTcKZCbhFO',0,NULL,'2026-06-22 09:23:47','2026-06-22 09:23:47',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'nabzesalamat_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-22  5:31:48
