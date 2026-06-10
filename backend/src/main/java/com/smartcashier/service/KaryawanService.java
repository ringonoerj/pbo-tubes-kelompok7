package com.smartcashier.service;

import com.smartcashier.entity.Karyawan;
import com.smartcashier.repository.KaryawanRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class KaryawanService {

    @Autowired
    private KaryawanRepository karyawanRepository;

    public List<Karyawan> getAllKaryawan() {
        return karyawanRepository.findAll();
    }

    public Optional<Karyawan> getKaryawanById(String id) {
        return karyawanRepository.findById(id);
    }

    public Optional<Karyawan> getKaryawanByEmployeeId(String employeeId) {
        return karyawanRepository.findByEmployeeId(employeeId);
    }

    public Karyawan saveKaryawan(Karyawan karyawan) {
        return karyawanRepository.save(karyawan);
    }

    public boolean validateLogin(String employeeId, String password) {
        Optional<Karyawan> optionalKaryawan = karyawanRepository.findByEmployeeId(employeeId);
        if (optionalKaryawan.isPresent()) {
            return optionalKaryawan.get().login(employeeId, password);
        }
        return false;
    }
}
