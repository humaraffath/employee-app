package com.example.employeeapp.controller;

import com.example.employeeapp.dto.ChatRequest;
import com.example.employeeapp.dto.ChatResponse;
import com.example.employeeapp.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping
    public ChatResponse chat(
            @RequestBody ChatRequest request,
            Authentication authentication) {

        return chatService.chat(
                request,
                authentication.getName());
    }
}