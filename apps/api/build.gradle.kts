import org.jetbrains.kotlin.gradle.dsl.JvmTarget

plugins {
  id("com.diffplug.spotless") version "7.2.1"
  kotlin("jvm") version "2.2.20"
  kotlin("plugin.spring") version "2.2.20"
  id("org.springframework.boot") version "4.0.3"
  id("io.spring.dependency-management") version "1.1.7"
}

group = "com.kudukloud"

version = "0.0.1-SNAPSHOT"

description = "BagTag Api"

kotlin {
  jvmToolchain(25)
  compilerOptions { jvmTarget.set(JvmTarget.JVM_24) }
}

java { toolchain { languageVersion = JavaLanguageVersion.of(25) } }

repositories { mavenCentral() }

spotless {
  kotlin {
    target("src/**/*.kt")
    ktfmt()
  }

  kotlinGradle {
    target("*.gradle.kts")
    ktfmt()
  }

  format("misc") {
    target("*.md", ".gitignore", ".gitattributes", "src/**/*.yaml", "src/**/*.yml")
    trimTrailingWhitespace()
    endWithNewline()
  }
}

dependencies {
  implementation(kotlin("reflect"))
  implementation("org.springframework.boot:spring-boot-starter")
  testImplementation("org.springframework.boot:spring-boot-starter-test")
  testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

tasks.withType<Test> { useJUnitPlatform() }

tasks.withType<JavaCompile>().configureEach { options.release = 24 }

tasks.named("build") { dependsOn("spotlessApply") }
