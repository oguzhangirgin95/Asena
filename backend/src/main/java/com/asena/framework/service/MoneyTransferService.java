package com.asena.framework.service;

import com.asena.framework.dto.MoneyTransferRequest;
import com.asena.framework.dto.base.BaseConfirmResponse;
import com.asena.framework.dto.base.BaseExecuteResponse;
import com.asena.framework.dto.base.KeyValueDto;
import com.asena.framework.entity.Transaction;
import com.asena.framework.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MoneyTransferService {

    private final TransactionRepository transactionRepository;

    public BaseConfirmResponse confirm(MoneyTransferRequest request) {
        // Simulate validation logic
        BaseConfirmResponse response = new BaseConfirmResponse();
        response.setTransactionToken(UUID.randomUUID().toString());
        response.setTransactionId(UUID.randomUUID().toString());
        
        List<KeyValueDto> details = new ArrayList<>();
        details.add(new KeyValueDto("iban", request.getIban(), "IBAN", 1));
        details.add(new KeyValueDto("amount", String.valueOf(request.getAmount()), "Amount", 2));
        details.add(new KeyValueDto("fee", "5.00", "Transaction Fee", 3));
        
        response.setDetails(details);
        return response;
    }

    public BaseExecuteResponse execute(MoneyTransferRequest request) {
        Transaction transaction = new Transaction();
        transaction.setTransactionName("Money Transfer");
        transaction.setIban(request.getIban());
        transaction.setAmount(request.getAmount());
        transaction.setStartTime(LocalDateTime.now());
        transaction.setStatus("SUCCESS");
        transaction.setReferenceNumber(UUID.randomUUID().toString());
        transaction.setEndTime(LocalDateTime.now());

        transactionRepository.save(transaction);

        BaseExecuteResponse response = new BaseExecuteResponse();
        response.setSuccess(true);
        response.setMessage("Transfer Successful");
        response.setReferenceNumber(transaction.getReferenceNumber());
        
        List<KeyValueDto> details = new ArrayList<>();
        details.add(new KeyValueDto("referenceNumber", transaction.getReferenceNumber(), "Reference Number", 1));
        details.add(new KeyValueDto("status", "SUCCESS", "Status", 2));
        
        response.setDetails(details);
        return response;
    }
}
