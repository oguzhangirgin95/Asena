package com.asena.framework.service;

import com.asena.framework.dto.ResourceItemDto;
import com.asena.framework.entity.ResourceEntity;
import com.asena.framework.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResourceService {
    @Autowired
    private ResourceRepository resourceRepository;

    public List<ResourceItemDto> getResources(String languageCode) {
        return resourceRepository.findByLanguageCode(languageCode)
                .stream()
                .map(this::toDto)
                .toList();
    }

    public List<ResourceItemDto> getResources(String languageCode, String transactionName) {
        final String tx = (transactionName == null || transactionName.isBlank()) ? "general" : transactionName;
        return resourceRepository.findByLanguageCodeAndTransactionName(languageCode, tx)
                .stream()
                .map(this::toDto)
                .toList();
    }

    public void saveResource(String transactionName, String resourceCode, String resourceValue, String languageCode) {
        final String tx = (transactionName == null || transactionName.isBlank()) ? "general" : transactionName;

        ResourceEntity resource = resourceRepository
                .findByResourceCodeAndLanguageCodeAndTransactionName(resourceCode, languageCode, tx)
                .orElse(new ResourceEntity());

        resource.setTransactionName(tx);
        resource.setResourceCode(resourceCode);
        resource.setResourceValue(resourceValue);
        resource.setLanguageCode(languageCode);
        resourceRepository.save(resource);
    }

    private ResourceItemDto toDto(ResourceEntity e) {
        return new ResourceItemDto(
                e.getTransactionName(),
                e.getResourceCode(),
                e.getResourceValue(),
                e.getLanguageCode()
        );
    }
}
