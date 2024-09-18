package com.pbl.profileapi.dto;

import lombok.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JsonResponse<T> {
    private HttpStatus status;
    private T body;
    private boolean success;

    public static <T> ResponseEntity<JsonResponse<T>> makeResponse(HttpStatus status, T body, boolean success) {
        JsonResponseBuilder<T> jsonResponseBuilder = JsonResponse.builder();
        return new ResponseEntity<>(
                jsonResponseBuilder
                        .status(status)
                        .body(body)
                        .success(success)
                        .build(),
                status
        );
    }
}
