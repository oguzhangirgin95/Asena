package com.asena.framework.dto;

import lombok.Data;


@Data
public class TokenRequest {
    private String browserAgent;
    private String browserName;
    private String browserVersion;
    private String code;
    private String clientDate;
    private String clientGMT;
    private String clientTime;
    private Integer isMobileBrowser;
    private String recordTime;
    private String screenResolution;
}
