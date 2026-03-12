import org.jetbrains.kotlin.gradle.dsl.JvmTarget
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
  id("com.diffplug.spotless") version "8.3.0"
  kotlin("jvm") version "2.2.20"
  kotlin("plugin.spring") version "2.2.20"
  id("org.springframework.boot") version "4.0.3"
  id("io.spring.dependency-management") version "1.1.7"
}

group = "com.kudukloud"

version = "0.0.1"

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
  implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
  implementation(kotlin("stdlib"))
  implementation(kotlin("reflect"))
  implementation("org.springdoc:springdoc-openapi-starter-webmvc-api:3.0.2")
  implementation("org.springframework.boot:spring-boot-starter-validation")
  implementation("org.springframework.boot:spring-boot-starter")
  implementation("org.springframework.boot:spring-boot-starter-web")
  implementation("org.springframework.boot:spring-boot-starter-actuator")
  testImplementation("org.springframework.boot:spring-boot-starter-test")
  testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

tasks.withType<Test> { useJUnitPlatform() }

tasks.withType<JavaCompile>().configureEach { options.release = 24 }

val skipSpotlessApply =
    providers.environmentVariable("CI").map(String::toBooleanStrictOrNull).orElse(false).get() ||
        providers.gradleProperty("skipSpotlessApply").isPresent ||
        providers.environmentVariable("BAGTAG_SKIP_SPOTLESS_APPLY").isPresent

tasks.named("check") { dependsOn("spotlessCheck") }

if (!skipSpotlessApply) {
  tasks.named("build") { dependsOn("spotlessApply") }
}

val compileKotlin: KotlinCompile by tasks

compileKotlin.compilerOptions {
  freeCompilerArgs.set(listOf("-Xannotation-default-target=param-property"))
}
