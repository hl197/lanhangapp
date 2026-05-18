package com.nchu.library.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "学号不能为空")
    @Size(min = 8, max = 20, message = "学号长度不合法")
    private String studentId;

    @NotBlank(message = "密码不能为空")
    @Size(min = 6, max = 32, message = "密码长度需6-32位")
    private String password;

    @NotBlank(message = "姓名不能为空")
    private String name;

    private String phone;
}
