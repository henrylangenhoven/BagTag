package com.kudukloud.bagtag.api

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication class BagTagApi

fun main(args: Array<String>) {
  runApplication<BagTagApi>(*args)
}
