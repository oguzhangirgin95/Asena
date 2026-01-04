package com.asena.framework.controller;

import com.asena.framework.dto.MoneyTransferRequest;
import com.asena.framework.dto.base.BaseConfirmResponse;
import com.asena.framework.dto.base.BaseExecuteResponse;
import com.asena.framework.service.MoneyTransferService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class MoneyTransferControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MoneyTransferService moneyTransferService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser
    public void testConfirm() throws Exception {
        MoneyTransferRequest request = new MoneyTransferRequest();
        request.setIban("TR123456");
        request.setAmount(100.0);

        BaseConfirmResponse response = new BaseConfirmResponse();
        response.setTransactionToken("token");

        when(moneyTransferService.confirm(any(MoneyTransferRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/money-transfer/confirm")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    public void testExecute() throws Exception {
        MoneyTransferRequest request = new MoneyTransferRequest();
        request.setIban("TR123456");
        request.setAmount(100.0);

        BaseExecuteResponse response = new BaseExecuteResponse();
        response.setSuccess(true);
        response.setMessage("SUCCESS");

        when(moneyTransferService.execute(any(MoneyTransferRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/money-transfer/execute")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }
}
