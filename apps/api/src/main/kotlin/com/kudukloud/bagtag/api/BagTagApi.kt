package com.kudukloud.bagtag.api

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.ConfigurationPropertiesScan
import org.springframework.boot.runApplication

@ConfigurationPropertiesScan @SpringBootApplication class BagTagApi

fun main(args: Array<String>) {
  runApplication<BagTagApi>(*args)
}
