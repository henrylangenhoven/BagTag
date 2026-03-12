package com.kudukloud.bagtag.api.notifications

interface EmailSender {
  fun deliversEmail(): Boolean

  fun sendMagicLink(email: String, magicLinkUrl: String)
}
