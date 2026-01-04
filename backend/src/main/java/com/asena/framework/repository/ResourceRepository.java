package com.asena.framework.repository;

import com.asena.framework.entity.ResourceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ResourceRepository extends JpaRepository<ResourceEntity, Long> {
    List<ResourceEntity> findByLanguageCode(String languageCode);
    List<ResourceEntity> findByLanguageCodeAndTransactionName(String languageCode, String transactionName);
    Optional<ResourceEntity> findByResourceCodeAndLanguageCodeAndTransactionName(String resourceCode, String languageCode, String transactionName);
}
