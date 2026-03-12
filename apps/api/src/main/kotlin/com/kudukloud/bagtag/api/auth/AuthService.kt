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
import org.springframework.transaction.annotation.Transactional

@Service
class AuthService(
    private val authRepository: AuthRepository,
    private val magicLinkTokenHasher: MagicLinkTokenHasher,
    private val emailSender: EmailSender,
    private val magicLinkProperties: MagicLinkProperties,
    private val clock: Clock = Clock.systemUTC(),
) {
  private val sessions = ConcurrentHashMap<String, Session>()

  @Transactional
  fun requestMagicLink(email: String): MagicLinkRequestedResponse {
    purgeExpiredLinks()

    val normalizedEmail = email.trim().lowercase()
    val now = Instant.now(clock)
    val token = "ml_${UUID.randomUUID()}"
    val expiresAt = now.plus(MAGIC_LINK_TTL)
    val magicLinkUrl = magicLinkUrl(token)
    val user = authRepository.findOrCreateUser(normalizedEmail, now)

    authRepository.storeMagicLink(user.id, magicLinkTokenHasher.hash(token), expiresAt, now)
    emailSender.sendMagicLink(normalizedEmail, magicLinkUrl)

    return MagicLinkRequestedResponse(
        email = normalizedEmail,
        expiresAt = expiresAt,
        previewToken = previewToken(token),
    )
  }

  @Transactional
  fun consumeMagicLink(token: String): SessionResponse? {
    purgeExpiredLinks()

    val normalizedToken = token.trim()
    val now = Instant.now(clock)
    val pending =
        authRepository.findActiveMagicLink(magicLinkTokenHasher.hash(normalizedToken))
            ?: return null
    if (pending.expiresAt.isBefore(now)) {
      return null
    }
    if (!authRepository.markMagicLinkConsumed(pending.id, now)) {
      return null
    }

    val sessionToken = "session_${UUID.randomUUID()}"
    val session =
        Session(
            token = sessionToken,
            userId = pending.userId,
            email = pending.email,
            displayName = pending.displayName,
            createdAt = now,
        )

    sessions[sessionToken] = session
    authRepository.touchUserLastLogin(pending.userId, now)

    return SessionResponse(
        sessionToken = sessionToken,
        user = session.toAuthenticatedUser(),
    )
  }

  fun me(sessionToken: String?): MeResponse {
    val session = sessionToken?.trim()?.takeIf { it.isNotEmpty() }?.let(sessions::get)
    return if (session == null) {
      MeResponse(authenticated = false, user = null)
    } else {
      val user =
          authRepository.findUserById(session.userId)
              ?: return MeResponse(authenticated = false, user = null)
      val refreshedSession = session.copy(email = user.email, displayName = user.displayName)
      sessions[session.token] = refreshedSession
      MeResponse(authenticated = true, user = refreshedSession.toAuthenticatedUser())
    }
  }

  @Transactional
  fun updateProfile(sessionToken: String?, displayName: String?): ProfileResponse? {
    val session =
        sessionToken?.trim()?.takeIf { it.isNotEmpty() }?.let(sessions::get) ?: return null
    val normalizedDisplayName = displayName?.trim()?.takeIf { it.isNotEmpty() }
    authRepository.updateUserDisplayName(session.userId, normalizedDisplayName)
    val updatedUser = authRepository.findUserById(session.userId) ?: return null
    val updatedSession =
        session.copy(email = updatedUser.email, displayName = updatedUser.displayName)
    sessions[session.token] = updatedSession
    return ProfileResponse(user = updatedSession.toAuthenticatedUser())
  }

  fun logout(sessionToken: String?): LogoutResponse {
    val removed = sessionToken?.trim()?.takeIf { it.isNotEmpty() }?.let(sessions::remove) != null
    return LogoutResponse(loggedOut = removed)
  }

  private fun purgeExpiredLinks() {
    authRepository.purgeExpiredMagicLinks(Instant.now(clock))
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

private data class Session(
    val token: String,
    val userId: UUID,
    val email: String,
    val displayName: String?,
    val createdAt: Instant,
)

private fun Session.toAuthenticatedUser(): AuthenticatedUser {
  return AuthenticatedUser(
      email = email,
      displayName = displayName,
  )
}
