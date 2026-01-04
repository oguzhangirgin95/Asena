package com.asena.framework.dto.base;

import lombok.Data;
import java.util.List;

@Data
public class BaseExecuteResponse {
    private boolean success;
    private String message;
    private String referenceNumber;
    private List<KeyValueDto> details;
}
