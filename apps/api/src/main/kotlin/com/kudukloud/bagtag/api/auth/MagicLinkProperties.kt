package com.kudukloud.bagtag.api.auth

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties("bagtag.auth.magic-link")
data class MagicLinkProperties(
    val baseUrl: String = "http://localhost:4200/login",
)
