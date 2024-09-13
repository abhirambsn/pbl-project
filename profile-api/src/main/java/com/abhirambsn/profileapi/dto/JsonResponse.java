package com.abhirambsn.profileapi.dto;

import lombok.*;
import org.springframework.http.HttpStatus;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JsonResponse<T> {
    private HttpStatus status;
    private T body;
    private boolean success;
}
