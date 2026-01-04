package com.asena.framework.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "resources", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"transaction_name", "resource_key", "language_code"})
})
public class ResourceEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "resource_key", nullable = false)
    private String resourceCode;

    @Column(name = "resource_value", nullable = false)
    private String resourceValue;

    @Column(name = "transaction_name")
    private String transactionName;

    @Column(name = "language_code", nullable = false)
    private String languageCode;

    @PrePersist
    @PreUpdate
    private void normalizeDefaults() {
        if (transactionName == null || transactionName.isBlank()) {
            transactionName = "general";
        }
    }
}
