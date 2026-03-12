package com.kudukloud.bagtag.api.common

import org.slf4j.LoggerFactory
import org.springframework.boot.context.event.ApplicationReadyEvent
import org.springframework.context.event.EventListener
import org.springframework.stereotype.Component

@Component
class StartupLogger {
  private val logger = LoggerFactory.getLogger(javaClass)

  @EventListener(ApplicationReadyEvent::class)
  fun logApplicationReady() {
    logger.info(STARTUP_BANNER)
  }

  companion object {
    private val STARTUP_BANNER =
        """

        === ------------------------------- ===
        *** BagTag API Started Successfully ***
        === ------------------------------- ===
        """
            .trimIndent()
  }
}
