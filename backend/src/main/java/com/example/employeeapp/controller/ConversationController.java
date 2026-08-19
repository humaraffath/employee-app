package com.example.employeeapp.controller;

import com.example.employeeapp.dto.ChatMessageResponse;
import com.example.employeeapp.entity.Conversation;
import com.example.employeeapp.service.ChatService;
import com.example.employeeapp.service.ConversationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/conversations")
@RequiredArgsConstructor
public class ConversationController {

    private final ConversationService conversationService;
    private final ChatService chatService;

    @GetMapping
    public List<Conversation> getConversations(
            Authentication authentication) {

        return conversationService
                .getEmployeeConversations(authentication.getName());
    }

    @PostMapping
    public Conversation createConversation(Authentication authentication) {
        return conversationService.createConversation(authentication.getName());
    }

    @GetMapping("/{conversationId}/messages")
    public List<ChatMessageResponse> getConversationMessages(
            @PathVariable Long conversationId,
            Authentication authentication) {
        return chatService.getConversationMessages(
                conversationId,
                authentication.getName());
    }
}