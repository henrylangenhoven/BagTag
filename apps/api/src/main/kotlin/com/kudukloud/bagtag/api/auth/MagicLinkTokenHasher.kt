package com.kudukloud.bagtag.api.auth

import java.nio.charset.StandardCharsets
import java.security.MessageDigest
import org.springframework.stereotype.Component

@Component
class MagicLinkTokenHasher {
  fun hash(token: String): String {
    val digest =
        MessageDigest.getInstance("SHA-256").digest(token.toByteArray(StandardCharsets.UTF_8))
    return digest.joinToString(separator = "") { byte -> "%02x".format(byte) }
  }
}
