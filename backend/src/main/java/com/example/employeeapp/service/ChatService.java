package com.example.employeeapp.service;

import com.example.employeeapp.dto.ChatRequest;
import com.example.employeeapp.ai.EmployeeTools;
import com.example.employeeapp.dto.ChatMessageResponse;
import com.example.employeeapp.dto.ChatResponse;
import com.example.employeeapp.entity.Conversation;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.stereotype.Service;
import org.springframework.ai.chat.client.advisor.vectorstore.QuestionAnswerAdvisor;

import java.util.List;

@Service
public class ChatService {

        private final ChatClient chatClient;
        private final ChatMemory chatMemory;
        private final ConversationService conversationService;

        public ChatService(
                        ChatClient.Builder chatClientBuilder,
                        ChatMemory chatMemory,
                        ConversationService conversationService,
                        VectorStore vectorStore,
                        EmployeeTools employeeTools) {

                this.chatMemory = chatMemory;
                this.conversationService = conversationService;

                this.chatClient = chatClientBuilder
                                .defaultAdvisors(
                                                MessageChatMemoryAdvisor.builder(chatMemory).build(),
                                                QuestionAnswerAdvisor.builder(vectorStore).build())
                                .defaultTools(employeeTools)
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
                                .system("""
                                                You have access to document context and application tools.

                                                Use the document context only for questions that can be answered
                                                from the uploaded documents.

                                                If the user asks for live employee data, employee records,
                                                database information, or information from the application,
                                                use the appropriate tool instead.

                                                Do not say that information is unavailable just because it
                                                is not present in the document if an appropriate tool is available.
                                                """)
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

        public List<ChatMessageResponse> getConversationMessages(
                        Long conversationId,
                        String email) {

                conversationService.getConversation(
                                conversationId,
                                email);

                return chatMemory
                                .get(conversationId.toString())
                                .stream()
                                .map(this::toChatMessageResponse)
                                .toList();
        }

        private ChatMessageResponse toChatMessageResponse(Message message) {
                String role = message.getMessageType().name().toLowerCase();
                return new ChatMessageResponse(role, message.getText());
        }
}