package com.kudukloud.bagtag.api.auth

import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val authService: AuthService,
) {
  @PostMapping("/magic-link/request")
  fun requestMagicLink(
      @Valid @RequestBody request: MagicLinkRequest,
  ): MagicLinkRequestedResponse {
    return authService.requestMagicLink(request.email)
  }

  @PostMapping("/magic-link/consume")
  fun consumeMagicLink(
      @Valid @RequestBody request: MagicLinkConsumeRequest,
  ): ResponseEntity<SessionResponse> {
    val session =
        authService.consumeMagicLink(request.token)
            ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()

    return ResponseEntity.ok(session)
  }

  @GetMapping("/me")
  fun me(
      @RequestHeader("X-BagTag-Session", required = false) sessionToken: String?,
  ): MeResponse {
    return authService.me(sessionToken)
  }

  @PostMapping("/logout")
  fun logout(
      @RequestHeader("X-BagTag-Session", required = false) sessionToken: String?,
  ): LogoutResponse {
    return authService.logout(sessionToken)
  }
}
