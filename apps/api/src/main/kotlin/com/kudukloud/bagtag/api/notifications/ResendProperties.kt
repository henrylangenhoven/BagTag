package com.kudukloud.bagtag.api.notifications

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties("bagtag.notifications.resend")
data class ResendProperties(
    val apiKey: String? = null,
    val fromEmail: String = "onboarding@resend.dev",
    val fromName: String = "BagTag",
    val replyTo: String? = null,
)
