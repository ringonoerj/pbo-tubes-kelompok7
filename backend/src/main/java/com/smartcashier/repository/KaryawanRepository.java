package com.smartcashier.repository;

import com.smartcashier.entity.Karyawan;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KaryawanRepository extends JpaRepository<Karyawan, String> {
    Optional<Karyawan> findByEmployeeId(String employeeId);
}
