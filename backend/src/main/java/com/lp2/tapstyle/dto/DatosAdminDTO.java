package com.lp2.tapstyle.dto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class DatosAdminDTO {
    private String nombres;
    private String apellidos;
    private String email;
    private String password;
}
