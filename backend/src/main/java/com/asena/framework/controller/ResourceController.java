package com.asena.framework.controller;

import com.asena.framework.dto.ResourceItemDto;
import com.asena.framework.service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/resources", produces = MediaType.APPLICATION_JSON_VALUE)
public class ResourceController {
    @Autowired
    private ResourceService resourceService;

    @GetMapping("/{languageCode}")
    public List<ResourceItemDto> getResources(@PathVariable String languageCode) {
        return resourceService.getResources(languageCode);
    }

    @GetMapping("/{languageCode}/{transactionName}")
    public List<ResourceItemDto> getResourcesByTransaction(
            @PathVariable String languageCode,
            @PathVariable String transactionName
    ) {
        return resourceService.getResources(languageCode, transactionName);
    }
}
