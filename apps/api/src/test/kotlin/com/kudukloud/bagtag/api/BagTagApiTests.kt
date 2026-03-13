package com.kudukloud.bagtag.api

import com.kudukloud.bagtag.api.auth.MagicLinkConsumeRequest
import com.kudukloud.bagtag.api.auth.MagicLinkRequest
import com.kudukloud.bagtag.api.auth.MagicLinkRequestedResponse
import com.kudukloud.bagtag.api.auth.MeResponse
import com.kudukloud.bagtag.api.auth.ProfileResponse
import com.kudukloud.bagtag.api.auth.SessionResponse
import com.kudukloud.bagtag.api.auth.UpdateProfileRequest
import com.kudukloud.bagtag.api.common.HealthResponse
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.server.LocalServerPort
import org.springframework.http.HttpStatus
import org.springframework.web.client.RestClient

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class BagTagApiTests {
  @LocalServerPort var port: Int = 0

  @Test
  fun healthEndpointResponds() {
    val response =
        restClient().get().uri("/api/health").retrieve().toEntity(HealthResponse::class.java)

    assertEquals(HttpStatus.OK, response.statusCode)
    assertNotNull(response.body)
    assertEquals("ok", response.body?.status)
    assertEquals("bagtag-api", response.body?.service)
    assertEquals("0.0.1", response.body?.version)
  }

  @Test
  fun magicLinkStubFlowResponds() {
    val requestResponse =
        restClient()
            .post()
            .uri("/api/auth/magic-link/request")
            .body(MagicLinkRequest(email = "owner@example.com"))
            .retrieve()
            .toEntity(MagicLinkRequestedResponse::class.java)

    assertEquals(HttpStatus.OK, requestResponse.statusCode)
    val requestBody = requestResponse.body ?: error("Missing magic-link request response")
    assertEquals("owner@example.com", requestBody.email)
    assertNotNull(requestBody.previewToken)
    assertTrue(requestBody.previewToken!!.startsWith("ml_"))

    val consumeResponse =
        restClient()
            .post()
            .uri("/api/auth/magic-link/consume")
            .body(MagicLinkConsumeRequest(token = requestBody.previewToken))
            .retrieve()
            .toEntity(SessionResponse::class.java)

    assertEquals(HttpStatus.OK, consumeResponse.statusCode)
    val sessionBody = consumeResponse.body ?: error("Missing session response")
    assertEquals("owner@example.com", sessionBody.user.email)
    assertEquals(null, sessionBody.user.displayName)

    val profileResponse =
        restClient()
            .post()
            .uri("/api/auth/profile")
            .header("X-BagTag-Session", sessionBody.sessionToken)
            .body(UpdateProfileRequest(displayName = "Henry"))
            .retrieve()
            .toEntity(ProfileResponse::class.java)

    assertEquals(HttpStatus.OK, profileResponse.statusCode)
    val profileBody = profileResponse.body ?: error("Missing profile response")
    assertEquals("Henry", profileBody.user.displayName)

    val meResponse =
        restClient()
            .get()
            .uri("/api/auth/me")
            .header("X-BagTag-Session", sessionBody.sessionToken)
            .retrieve()
            .toEntity(MeResponse::class.java)

    assertEquals(HttpStatus.OK, meResponse.statusCode)
    val meBody = meResponse.body ?: error("Missing me response")
    assertTrue(meBody.authenticated)
    assertEquals("owner@example.com", meBody.user?.email)
    assertEquals("Henry", meBody.user?.displayName)
  }

  private fun restClient(): RestClient {
    return RestClient.builder().baseUrl("http://localhost:$port").build()
  }
}
