package com.abhirambsn.profileapi.controller;

import com.abhirambsn.profileapi.dto.JsonResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ProfileController {
    @GetMapping("/hello")
    public ResponseEntity<JsonResponse<String>> hello() {
        JsonResponse<String> response = new JsonResponse<>();
        response.setStatus(HttpStatus.OK);
        response.setBody("Hello World");
        response.setSuccess(true);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
