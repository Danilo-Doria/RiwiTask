package com.danilodoria.riwitask.controller;

import com.danilodoria.riwitask.dto.request.LoginRequestDTO;
import com.danilodoria.riwitask.dto.request.RegisterRequestDTO;
import com.danilodoria.riwitask.dto.response.AuthResponseDTO;
import com.danilodoria.riwitask.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@Valid @RequestBody RegisterRequestDTO requestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(requestDTO));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody LoginRequestDTO requestDTO) {
        return ResponseEntity.ok(authService.login(requestDTO));
    }
}
