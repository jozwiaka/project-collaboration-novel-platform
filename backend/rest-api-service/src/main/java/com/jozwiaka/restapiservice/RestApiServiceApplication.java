package com.jozwiaka.restapiservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class RestApiServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(RestApiServiceApplication.class, args);
	}

}
