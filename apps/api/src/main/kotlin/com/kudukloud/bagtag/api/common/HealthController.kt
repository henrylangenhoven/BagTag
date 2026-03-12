package com.kudukloud.bagtag.api.common

import java.time.Instant
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/health", produces = [MediaType.APPLICATION_JSON_VALUE])
class HealthController(
    @param:Value("\${bagtag.version}") private val version: String,
) {
  @GetMapping
  fun health(): HealthResponse {
    return HealthResponse(
        status = "ok",
        service = "bagtag-api",
        version = version,
        timestamp = Instant.now(),
    )
  }
}

data class HealthResponse(
    val status: String,
    val service: String,
    val version: String,
    val timestamp: Instant,
)
