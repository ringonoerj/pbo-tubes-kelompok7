package com.smartcashier.controller;

import com.smartcashier.dto.LoginRequest;
import com.smartcashier.dto.LoginResponse;
import com.smartcashier.entity.Karyawan;
import com.smartcashier.service.KaryawanService;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private KaryawanService karyawanService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        boolean valid = karyawanService.validateLogin(request.getEmployeeId(), request.getPassword());
        if (valid) {
            Optional<Karyawan> karyawanOpt = karyawanService.getKaryawanByEmployeeId(request.getEmployeeId());
            if (karyawanOpt.isPresent()) {
                Karyawan k = karyawanOpt.get();
                LoginResponse response = new LoginResponse(true, k.getId(), k.getName(), k.getKpi());
                return ResponseEntity.ok(response);
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new LoginResponse(false, null, null, 0.0));
    }
}
