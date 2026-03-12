package com.kudukloud.bagtag.api.auth

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/auth", produces = [MediaType.APPLICATION_JSON_VALUE])
@Tag(name = "Auth")
class AuthController(
    private val authService: AuthService,
) {
  @PostMapping(
      "/magic-link/request",
      consumes = [MediaType.APPLICATION_JSON_VALUE],
  )
  @Operation(
      operationId = "requestMagicLink",
      summary = "Request a magic-link email",
  )
  fun requestMagicLink(
      @Valid @RequestBody request: MagicLinkRequest,
  ): MagicLinkRequestedResponse {
    return authService.requestMagicLink(request.email)
  }

  @PostMapping(
      "/magic-link/consume",
      consumes = [MediaType.APPLICATION_JSON_VALUE],
  )
  @Operation(
      operationId = "consumeMagicLink",
      summary = "Consume a magic-link token and create a session",
  )
  fun consumeMagicLink(
      @Valid @RequestBody request: MagicLinkConsumeRequest,
  ): ResponseEntity<SessionResponse> {
    val session =
        authService.consumeMagicLink(request.token)
            ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()

    return ResponseEntity.ok(session)
  }

  @GetMapping("/me")
  @Operation(
      operationId = "getAuthMe",
      summary = "Fetch the current authenticated user",
  )
  fun me(
      @RequestHeader("X-BagTag-Session", required = false) sessionToken: String?,
  ): MeResponse {
    return authService.me(sessionToken)
  }

  @PostMapping("/logout", consumes = [MediaType.APPLICATION_JSON_VALUE])
  @Operation(
      operationId = "logoutAuthSession",
      summary = "Log out the current session",
  )
  fun logout(
      @RequestHeader("X-BagTag-Session", required = false) sessionToken: String?,
  ): LogoutResponse {
    return authService.logout(sessionToken)
  }
}
