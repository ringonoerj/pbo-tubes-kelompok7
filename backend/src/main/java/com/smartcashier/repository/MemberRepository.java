package com.smartcashier.repository;

import com.smartcashier.entity.Member;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberRepository extends JpaRepository<Member, String> {
    Optional<Member> findByPhoneNumber(String phoneNumber);
}
