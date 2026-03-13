package com.kudukloud.bagtag.api.notifications

import org.slf4j.LoggerFactory
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.stereotype.Service

@Service
@ConditionalOnMissingBean(ResendEmailSender::class)
class NoOpEmailSender : EmailSender {
  private val logger = LoggerFactory.getLogger(javaClass)

  override fun deliversEmail(): Boolean = false

  override fun sendMagicLink(email: String, magicLinkUrl: String) {
    logger.info(
        "Resend is not configured. Magic link for {} is available at {}",
        email,
        magicLinkUrl,
    )
  }
}
