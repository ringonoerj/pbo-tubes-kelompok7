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

    public Karyawan updateKaryawan(String id, Karyawan details) {
        Karyawan karyawan = karyawanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Karyawan tidak ditemukan dengan id: " + id));
        karyawan.setName(details.getName());
        karyawan.setPhoneNumber(details.getPhoneNumber());
        karyawan.setEmployeeId(details.getEmployeeId());
        if (details.getPassword() != null && !isEmpty(details.getPassword())) {
            karyawan.setPassword(details.getPassword());
        }
        karyawan.setKpi(details.getKpi());
        return karyawanRepository.save(karyawan);
    }

    private boolean isEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }

    public void deleteKaryawan(String id) {
        karyawanRepository.deleteById(id);
    }

    public boolean validateLogin(String employeeId, String password) {
        Optional<Karyawan> optionalKaryawan = karyawanRepository.findByEmployeeId(employeeId);
        if (optionalKaryawan.isPresent()) {
            return optionalKaryawan.get().login(employeeId, password);
        }
        return false;
    }
}
