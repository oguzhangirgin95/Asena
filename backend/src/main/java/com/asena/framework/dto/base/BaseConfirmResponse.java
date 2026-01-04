package com.asena.framework.dto.base;

import lombok.Data;
import java.util.List;

@Data
public class BaseConfirmResponse {
    private List<KeyValueDto> details;
    private String transactionToken;
    private String transactionId;
}
