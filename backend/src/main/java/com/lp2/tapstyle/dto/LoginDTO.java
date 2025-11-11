package com.lp2.tapstyle.dto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class LoginDTO {
    private String username;
    private String contraseña;
}
