package com.sneakcart.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data @AllArgsConstructor
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    // password is intentionally excluded
}
