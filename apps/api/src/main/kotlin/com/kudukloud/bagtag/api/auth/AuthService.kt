package com.kudukloud.bagtag.api.auth

import com.kudukloud.bagtag.api.notifications.EmailSender
import java.net.URLEncoder
import java.nio.charset.StandardCharsets
import java.time.Clock
import java.time.Duration
import java.time.Instant
import java.util.UUID
import java.util.concurrent.ConcurrentHashMap
import org.springframework.stereotype.Service

@Service
class AuthService(
    private val emailSender: EmailSender,
    private val magicLinkProperties: MagicLinkProperties,
    private val clock: Clock = Clock.systemUTC(),
) {
  private val pendingLinks = ConcurrentHashMap<String, PendingMagicLink>()
  private val sessions = ConcurrentHashMap<String, Session>()

  fun requestMagicLink(email: String): MagicLinkRequestedResponse {
    purgeExpiredLinks()

    val normalizedEmail = email.trim().lowercase()
    val token = "ml_${UUID.randomUUID()}"
    val expiresAt = Instant.now(clock).plus(MAGIC_LINK_TTL)
    val magicLinkUrl = magicLinkUrl(token)

    pendingLinks[token] = PendingMagicLink(email = normalizedEmail, expiresAt = expiresAt)
    emailSender.sendMagicLink(normalizedEmail, magicLinkUrl)

    return MagicLinkRequestedResponse(
        email = normalizedEmail,
        expiresAt = expiresAt,
        previewToken = previewToken(token),
    )
  }

  fun consumeMagicLink(token: String): SessionResponse? {
    purgeExpiredLinks()

    val pending = pendingLinks.remove(token.trim()) ?: return null
    if (pending.expiresAt.isBefore(Instant.now(clock))) {
      return null
    }

    val sessionToken = "session_${UUID.randomUUID()}"
    val session =
        Session(
            token = sessionToken,
            email = pending.email,
            createdAt = Instant.now(clock),
        )

    sessions[sessionToken] = session

    return SessionResponse(
        sessionToken = sessionToken,
        user = AuthenticatedUser(email = session.email),
    )
  }

  fun me(sessionToken: String?): MeResponse {
    val session = sessionToken?.trim()?.takeIf { it.isNotEmpty() }?.let(sessions::get)
    return if (session == null) {
      MeResponse(authenticated = false, user = null)
    } else {
      MeResponse(authenticated = true, user = AuthenticatedUser(email = session.email))
    }
  }

  fun logout(sessionToken: String?): LogoutResponse {
    val removed = sessionToken?.trim()?.takeIf { it.isNotEmpty() }?.let(sessions::remove) != null
    return LogoutResponse(loggedOut = removed)
  }

  private fun purgeExpiredLinks() {
    val now = Instant.now(clock)
    pendingLinks.entries.removeIf { (_, link) -> link.expiresAt.isBefore(now) }
  }

  private fun magicLinkUrl(token: String): String {
    val separator = if ('?' in magicLinkProperties.baseUrl) '&' else '?'
    val encodedToken = URLEncoder.encode(token, StandardCharsets.UTF_8)
    return "${magicLinkProperties.baseUrl}$separator" + "token=$encodedToken"
  }

  private fun previewToken(token: String): String? {
    return if (!emailSender.deliversEmail()) {
      token
    } else {
      null
    }
  }

  companion object {
    private val MAGIC_LINK_TTL: Duration = Duration.ofMinutes(15)
  }
}

private data class PendingMagicLink(
    val email: String,
    val expiresAt: Instant,
)

private data class Session(
    val token: String,
    val email: String,
    val createdAt: Instant,
)
