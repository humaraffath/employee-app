package com.example.employeeapp.service;

import com.example.employeeapp.dto.ChatRequest;
import com.example.employeeapp.dto.ChatResponse;
import com.example.employeeapp.entity.Conversation;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.stereotype.Service;

@Service
public class ChatService {

    private final ChatClient chatClient;
    private final ConversationService conversationService;

    public ChatService(
            ChatClient.Builder chatClientBuilder,
            ChatMemory chatMemory,
            ConversationService conversationService) {

        this.conversationService = conversationService;

        this.chatClient = chatClientBuilder
                .defaultAdvisors(
                        MessageChatMemoryAdvisor.builder(chatMemory).build())
                .build();
    }

    public ChatResponse chat(
            ChatRequest request,
            String email) {

        Conversation conversation;

        if (request.conversationId() == null) {

            conversation = conversationService
                    .createConversation(email);

        } else {

            conversation = conversationService
                    .getConversation(
                            request.conversationId(),
                            email);
        }

        String response = chatClient
                .prompt()
                .user(request.message())
                .advisors(advisor -> advisor.param(
                        ChatMemory.CONVERSATION_ID,
                        conversation.getId().toString()))
                .call()
                .content();

        return new ChatResponse(
                conversation.getId(),
                response);
    }
}