package com.kudukloud.bagtag.api.notifications

import com.fasterxml.jackson.annotation.JsonProperty
import java.nio.charset.StandardCharsets
import java.util.UUID
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression
import org.springframework.http.MediaType
import org.springframework.stereotype.Service
import org.springframework.web.client.RestClient

@Service
@ConditionalOnExpression("'\${bagtag.notifications.resend.api-key:}'.trim().length() > 0")
class ResendEmailSender(
    private val properties: ResendProperties,
) : EmailSender {
  private val restClient = RestClient.builder().baseUrl("https://api.resend.com").build()

  override fun deliversEmail(): Boolean = true

  override fun sendMagicLink(email: String, magicLinkUrl: String) {
    val payload =
        ResendSendEmailRequest(
            from = "${properties.fromName} <${properties.fromEmail}>",
            to = listOf(email),
            subject = "Your BagTag magic link",
            html = magicLinkHtml(magicLinkUrl),
            text = magicLinkText(magicLinkUrl),
            replyTo = properties.replyTo,
        )

    restClient
        .post()
        .uri("/emails")
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", "Bearer ${properties.apiKey}")
        .header("Idempotency-Key", idempotencyKey(email, magicLinkUrl))
        .body(payload)
        .retrieve()
        .toBodilessEntity()
  }

  private fun idempotencyKey(email: String, magicLinkUrl: String): String {
    val seed = "$email:$magicLinkUrl"
    return "magic-link:${UUID.nameUUIDFromBytes(seed.toByteArray(StandardCharsets.UTF_8))}"
  }

  private fun magicLinkHtml(magicLinkUrl: String): String {
    return """
      <p>Use this secure link to sign in to BagTag:</p>
      <p><a href="$magicLinkUrl">Sign in to BagTag</a></p>
      <p>This link expires in 15 minutes.</p>
    """
        .trimIndent()
  }

  private fun magicLinkText(magicLinkUrl: String): String {
    return """
      Use this secure link to sign in to BagTag:
      $magicLinkUrl

      This link expires in 15 minutes.
    """
        .trimIndent()
  }
}

private data class ResendSendEmailRequest(
    val from: String,
    val to: List<String>,
    val subject: String,
    val html: String,
    val text: String,
    @param:JsonProperty("reply_to") val replyTo: String?,
)
