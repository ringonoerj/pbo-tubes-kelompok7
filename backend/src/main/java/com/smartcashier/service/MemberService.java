package com.smartcashier.service;

import com.smartcashier.entity.Member;
import com.smartcashier.repository.MemberRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MemberService {

    @Autowired
    private MemberRepository memberRepository;

    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }

    public Optional<Member> getMemberById(String id) {
        return memberRepository.findById(id);
    }

    public Optional<Member> getMemberByPhoneNumber(String phoneNumber) {
        return memberRepository.findByPhoneNumber(phoneNumber);
    }

    public Member registerMember(Member member) {
        // Generate Member ID (e.g. MEM002)
        long count = memberRepository.count();
        String generatedId = "MEM" + String.format("%03d", count + 1);
        
        // Ensure uniqueness
        while (memberRepository.existsById(generatedId)) {
            count++;
            generatedId = "MEM" + String.format("%03d", count + 1);
        }
        
        member.setId(generatedId);
        if (member.getJoinDate() == null || member.getJoinDate().isEmpty()) {
            member.setJoinDate(LocalDate.now().toString());
        }
        if (member.getDiscountRate() <= 0) {
            member.setDiscountRate(0.05); // Default 5%
        }
        return memberRepository.save(member);
    }
}
