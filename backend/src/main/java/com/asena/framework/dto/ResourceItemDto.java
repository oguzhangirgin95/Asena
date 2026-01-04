package com.asena.framework.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ResourceItemDto {
    private String transactionName;
    private String resourceCode;
    private String resourceValue;
    private String languageCode;
}
