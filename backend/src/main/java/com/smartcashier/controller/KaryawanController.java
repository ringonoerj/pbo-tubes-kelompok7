package com.smartcashier.controller;

import com.smartcashier.entity.Karyawan;
import com.smartcashier.service.KaryawanService;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/karyawan")
public class KaryawanController {

    @Autowired
    private KaryawanService karyawanService;

    @GetMapping
    public List<Karyawan> getAllKaryawan() {
        return karyawanService.getAllKaryawan();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Karyawan> getKaryawanById(@PathVariable String id) {
        return karyawanService.getKaryawanById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Karyawan> createKaryawan(@RequestBody Karyawan karyawan) {
        // Validation: employeeId is required
        if (karyawan.getEmployeeId() == null || karyawan.getEmployeeId().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        // If id is not set, set it to employeeId
        if (karyawan.getId() == null || karyawan.getId().trim().isEmpty()) {
            karyawan.setId(karyawan.getEmployeeId());
        }
        
        // Check if employeeId already exists to avoid conflict
        if (karyawanService.getKaryawanByEmployeeId(karyawan.getEmployeeId()).isPresent()) {
            return ResponseEntity.status(409).build(); // Conflict
        }

        Karyawan saved = karyawanService.saveKaryawan(karyawan);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Karyawan> updateKaryawan(@PathVariable String id, @RequestBody Karyawan karyawan) {
        try {
            Karyawan updated = karyawanService.updateKaryawan(id, karyawan);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteKaryawan(@PathVariable String id) {
        try {
            karyawanService.deleteKaryawan(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Karyawan berhasil dihapus");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
