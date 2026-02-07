package com.storeos.api.controller;

import tools.jackson.databind.ObjectMapper;
import com.storeos.api.dto.CreateStoreRequest;
import com.storeos.api.dto.UpdateStoreRequest;
import com.storeos.api.repository.StoreRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest // 스프링 서버를 실제로 띄워서 테스트함
@Transactional // 테스트가 끝나면 DB에 넣은 데이터를 도로 뺌 (롤백)
class StoreControllerTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    private MockMvc mockMvc; // 가짜 브라우저 (요청 보내는 도구)

    @Autowired
    private ObjectMapper objectMapper; // 자바 객체 -> JSON 변환기

    @Autowired
    private StoreRepository storeRepository;

    @BeforeEach
    void setUp() {
        // MockMvc를 수동으로 설정
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    @Test
    @DisplayName("가게 등록이 성공해야 한다")
    void registerStoreTest() throws Exception {
        // 1. 준비 (Given)
        CreateStoreRequest request = new CreateStoreRequest("백종원 반점", "123-45-67890", "백종원");
        
        // 자바 객체를 JSON 문자열로 변환
        String json = objectMapper.writeValueAsString(request);

        // 2. 실행 (When) & 3. 검증 (Then)
        mockMvc.perform(post("/api/v1/stores") // POST 요청
                        .contentType(MediaType.APPLICATION_JSON) // 보내는 데이터는 JSON이야
                        .content(json)) // 내용은 이거야
                .andExpect(status().isCreated()) // 결과는 201 Created 여야 해
                .andDo(print()); // 콘솔에 로그 찍어줘
    }

    @Test
    @DisplayName("가게 정보 수정이 성공해야 한다")
    void updateStoreTest() throws Exception {
        // 1. 준비: 먼저 수정할 가게를 하나 미리 만들어둠 (DB에 저장)
        Long savedStoreId = saveStore();

        // 수정할 데이터 준비
        UpdateStoreRequest updateDto = new UpdateStoreRequest("이연복 만두", "999-99-99999", "이연복");
        String json = objectMapper.writeValueAsString(updateDto);

        // 2. 실행 (PUT 요청)
        // 아까 우리가 PUT으로 바꿨던 URL 기억나시죠?
        mockMvc.perform(put("/api/v1/stores/" + savedStoreId + "/update")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk()) // 200 OK 여야 해
                .andDo(print());
    }

    // 도우미 메서드: 테스트용 가게를 하나 만들고 ID를 반환
    private Long saveStore() throws Exception {
        CreateStoreRequest request = new CreateStoreRequest("테스트 가게", "000-00-00000", "테스터");
        String json = objectMapper.writeValueAsString(request);

        String responseString = mockMvc.perform(post("/api/v1/stores")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andReturn().getResponse().getContentAsString();
        
        return Long.parseLong(responseString);
    }
}