package com.pbl.profileapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class ProfileApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProfileApiApplication.class, args);
    }

}
