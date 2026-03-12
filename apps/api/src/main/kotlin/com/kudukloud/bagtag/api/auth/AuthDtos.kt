package com.kudukloud.bagtag.api.auth

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import java.time.Instant

data class MagicLinkRequest(
    @field:Email @field:NotBlank val email: String,
)

data class MagicLinkRequestedResponse(
    val email: String,
    val expiresAt: Instant,
    val previewToken: String?,
)

data class MagicLinkConsumeRequest(
    @field:NotBlank val token: String,
)

data class SessionResponse(
    val sessionToken: String,
    val user: AuthenticatedUser,
)

data class MeResponse(
    val authenticated: Boolean,
    val user: AuthenticatedUser?,
)

data class LogoutResponse(
    val loggedOut: Boolean,
)

data class AuthenticatedUser(
    val email: String,
)
