package com.kudukloud.bagtag.api.common

import java.time.Instant
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/health", produces = [MediaType.APPLICATION_JSON_VALUE])
class HealthController {
  @GetMapping
  fun health(): HealthResponse {
    return HealthResponse(status = "ok", service = "bagtag-api", timestamp = Instant.now())
  }
}

data class HealthResponse(
    val status: String,
    val service: String,
    val timestamp: Instant,
)
