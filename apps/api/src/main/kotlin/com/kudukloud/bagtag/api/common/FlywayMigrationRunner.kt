package com.kudukloud.bagtag.api.common

import javax.sql.DataSource
import org.flywaydb.core.Flyway
import org.flywaydb.core.api.output.MigrateResult
import org.slf4j.LoggerFactory
import org.springframework.boot.ApplicationArguments
import org.springframework.boot.ApplicationRunner
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.stereotype.Component

@Component
@ConditionalOnProperty(
    name = ["spring.flyway.enabled"], havingValue = "true", matchIfMissing = true)
class FlywayMigrationRunner(
    private val dataSource: DataSource,
) : ApplicationRunner {
  private val logger = LoggerFactory.getLogger(javaClass)

  override fun run(args: ApplicationArguments) {
    val flyway =
        Flyway.configure().dataSource(dataSource).locations("classpath:db/migration").load()
    logger.info("Starting Flyway migrations")
    val result = flyway.migrate()
    logMigrationResult(result)
  }

  private fun logMigrationResult(result: MigrateResult) {
    logger.info(
        "Flyway migrations complete: currentVersion={}, migrationsExecuted={}, schema={}, database={}",
        result.targetSchemaVersion,
        result.migrationsExecuted,
        result.schemaName,
        result.database,
    )
  }
}
