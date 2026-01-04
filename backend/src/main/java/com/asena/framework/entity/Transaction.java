package com.asena.framework.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String transactionName;
    private String status;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String referenceNumber;
    
    private String iban;
    private Double amount;
}
