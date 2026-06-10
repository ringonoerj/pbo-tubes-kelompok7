package com.smartcashier.controller;

import com.smartcashier.entity.Member;
import com.smartcashier.service.MemberService;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/member")
public class MemberController {

    @Autowired
    private MemberService memberService;

    @PostMapping("/register")
    public Member registerMember(@RequestBody Member member) {
        return memberService.registerMember(member);
    }

    @GetMapping("/{phone}")
    public ResponseEntity<Member> getMemberByPhone(@PathVariable String phone) {
        Optional<Member> memberOpt = memberService.getMemberByPhoneNumber(phone);
        return ResponseEntity.ok(memberOpt.orElse(null));
    }
}
