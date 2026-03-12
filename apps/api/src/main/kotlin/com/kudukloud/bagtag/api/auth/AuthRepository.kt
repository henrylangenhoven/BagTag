package com.kudukloud.bagtag.api.auth

import java.sql.ResultSet
import java.sql.Timestamp
import java.time.Instant
import java.util.UUID
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.jdbc.core.simple.JdbcClient
import org.springframework.stereotype.Repository

@Repository
class AuthRepository(
    private val jdbcClient: JdbcClient,
) {
  fun findOrCreateUser(email: String, now: Instant): UserRecord {
    findUserByEmail(email)?.let {
      return it
    }

    val user =
        UserRecord(
            id = UUID.randomUUID(),
            email = email,
            displayName = null,
            createdAt = now,
            lastLoginAt = null,
        )

    try {
      jdbcClient
          .sql(
              """
              insert into users (id, email, display_name, created_at)
              values (:id, :email, :displayName, :createdAt)
              """
                  .trimIndent())
          .param("id", user.id)
          .param("email", user.email)
          .param("displayName", user.displayName)
          .param("createdAt", timestamp(user.createdAt))
          .update()
      return user
    } catch (_: DataIntegrityViolationException) {
      return findUserByEmail(email)
          ?: throw IllegalStateException("Failed to create user for $email")
    }
  }

  fun storeMagicLink(userId: UUID, tokenHash: String, expiresAt: Instant, now: Instant) {
    jdbcClient
        .sql(
            """
            insert into magic_link_tokens (id, user_id, token_hash, expires_at, created_at)
            values (?, ?, ?, ?, ?)
            """
                .trimIndent())
        .params(UUID.randomUUID(), userId, tokenHash, timestamp(expiresAt), timestamp(now))
        .update()
  }

  fun findActiveMagicLink(tokenHash: String): MagicLinkTokenRecord? {
    return jdbcClient
        .sql(
            """
            select t.id,
                   t.user_id,
                   t.token_hash,
                   t.expires_at,
                   t.consumed_at,
                   t.created_at,
                   u.email,
                   u.display_name
            from magic_link_tokens t
            join users u on u.id = t.user_id
            where t.token_hash = ?
              and t.consumed_at is null
            """
                .trimIndent())
        .param(tokenHash)
        .query(::mapMagicLinkToken)
        .optional()
        .orElse(null)
  }

  fun markMagicLinkConsumed(id: UUID, consumedAt: Instant): Boolean {
    val updated =
        jdbcClient
            .sql(
                """
                update magic_link_tokens
                set consumed_at = ?
                where id = ?
                  and consumed_at is null
                """
                    .trimIndent())
            .params(timestamp(consumedAt), id)
            .update()

    return updated == 1
  }

  fun touchUserLastLogin(userId: UUID, lastLoginAt: Instant) {
    jdbcClient
        .sql(
            """
            update users
            set last_login_at = ?
            where id = ?
            """
                .trimIndent())
        .params(timestamp(lastLoginAt), userId)
        .update()
  }

  fun updateUserDisplayName(userId: UUID, displayName: String?) {
    jdbcClient
        .sql(
            """
            update users
            set display_name = :displayName
            where id = :id
            """
                .trimIndent())
        .param("displayName", displayName)
        .param("id", userId)
        .update()
  }

  fun purgeExpiredMagicLinks(now: Instant) {
    jdbcClient
        .sql(
            """
            delete from magic_link_tokens
            where expires_at < ?
            """
                .trimIndent())
        .param(timestamp(now))
        .update()
  }

  private fun findUserByEmail(email: String): UserRecord? {
    return jdbcClient
        .sql(
            """
            select id, email, display_name, created_at, last_login_at
            from users
            where email = ?
            """
                .trimIndent())
        .param(email)
        .query(::mapUser)
        .optional()
        .orElse(null)
  }

  fun findUserById(id: UUID): UserRecord? {
    return jdbcClient
        .sql(
            """
            select id, email, display_name, created_at, last_login_at
            from users
            where id = ?
            """
                .trimIndent())
        .param(id)
        .query(::mapUser)
        .optional()
        .orElse(null)
  }

  private fun mapUser(resultSet: ResultSet, rowNum: Int): UserRecord {
    return UserRecord(
        id = resultSet.getObject("id", UUID::class.java),
        email = resultSet.getString("email"),
        displayName = resultSet.getString("display_name"),
        createdAt = resultSet.getTimestamp("created_at").toInstant(),
        lastLoginAt = resultSet.getTimestamp("last_login_at")?.toInstant(),
    )
  }

  private fun mapMagicLinkToken(resultSet: ResultSet, rowNum: Int): MagicLinkTokenRecord {
    return MagicLinkTokenRecord(
        id = resultSet.getObject("id", UUID::class.java),
        userId = resultSet.getObject("user_id", UUID::class.java),
        email = resultSet.getString("email"),
        displayName = resultSet.getString("display_name"),
        tokenHash = resultSet.getString("token_hash"),
        expiresAt = resultSet.getTimestamp("expires_at").toInstant(),
        consumedAt = resultSet.getTimestamp("consumed_at")?.toInstant(),
        createdAt = resultSet.getTimestamp("created_at").toInstant(),
    )
  }

  private fun timestamp(instant: Instant): Timestamp = Timestamp.from(instant)
}

data class UserRecord(
    val id: UUID,
    val email: String,
    val displayName: String?,
    val createdAt: Instant,
    val lastLoginAt: Instant?,
)

data class MagicLinkTokenRecord(
    val id: UUID,
    val userId: UUID,
    val email: String,
    val displayName: String?,
    val tokenHash: String,
    val expiresAt: Instant,
    val consumedAt: Instant?,
    val createdAt: Instant,
)
