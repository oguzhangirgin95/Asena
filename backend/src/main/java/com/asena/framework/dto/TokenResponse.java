package com.asena.framework.dto;

import lombok.Data;
import java.util.List;

@Data
public class TokenResponse {
    private String token;
    private String encryptionKey;
    private Integer expiresIn;
    private Integer beforeLoginTimeout;
    private Integer expiresInWarning;
    private String currentTime;
    private Boolean checkMsisdn;
    private Integer timeout;
    private Integer mainPageCacheTimeout;
    private Boolean isNotificationMenuVisible;
    private Boolean isQrMenuVisible;
    private String cardImageCacheLastFlushDate;
    private Boolean isChatBotVisible;
    private String backgroundImages;
    private String currentBackgroundImage;
    private String clientShowPageDefinitions;
    private List<Long> activeVersions;
    private Boolean isLoadTestRefererShow;
    private String sessionName;
}
