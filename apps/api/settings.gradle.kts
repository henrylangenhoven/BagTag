pluginManagement {
  val kotlinVersion = "2.3.21"
  val springBootVersion = "4.0.4"
  val dependencyManagementVersion = "1.1.7"
  val spotlessVersion = "8.4.0"

  plugins {
    id("com.diffplug.spotless") version spotlessVersion
    kotlin("jvm") version kotlinVersion
    kotlin("plugin.spring") version kotlinVersion
    id("org.springframework.boot") version springBootVersion
    id("io.spring.dependency-management") version dependencyManagementVersion
  }
}

rootProject.name = "bag-tag-api"
