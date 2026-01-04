package com.asena.framework.controller;

import com.asena.framework.dto.MoneyTransferRequest;
import com.asena.framework.dto.base.BaseConfirmResponse;
import com.asena.framework.dto.base.BaseExecuteResponse;
import com.asena.framework.service.MoneyTransferService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/money-transfer")
@RequiredArgsConstructor
public class MoneyTransferController {

    private final MoneyTransferService moneyTransferService;

    @PostMapping("/confirm")
    public ResponseEntity<BaseConfirmResponse> confirm(@Valid @RequestBody MoneyTransferRequest request) {
        return ResponseEntity.ok(moneyTransferService.confirm(request));
    }

    @PostMapping("/execute")
    public ResponseEntity<BaseExecuteResponse> execute(@Valid @RequestBody MoneyTransferRequest request) {
        return ResponseEntity.ok(moneyTransferService.execute(request));
    }
}
