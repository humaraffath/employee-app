package com.example.employeeapp.service;

import com.example.employeeapp.entity.Conversation;
import com.example.employeeapp.entity.Employee;
import com.example.employeeapp.repository.ConversationRepository;
import com.example.employeeapp.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ConversationService {

        private final ConversationRepository conversationRepository;
        private final EmployeeRepository employeeRepository;

        public Conversation createConversation(String email) {

                Employee employee = getEmployeeByEmail(email);

                Conversation conversation = Conversation.builder()
                                .employee(employee)
                                .title("New Conversation")
                                .build();

                return conversationRepository.save(conversation);
        }

        public List<Conversation> getEmployeeConversations(String email) {

                Employee employee = getEmployeeByEmail(email);

                return conversationRepository
                                .findByEmployeeIdOrderByUpdatedAtDesc(employee.getId());
        }

        public Conversation getConversation(
                        Long conversationId,
                        String email) {

                Employee employee = getEmployeeByEmail(email);

                return conversationRepository
                                .findByIdAndEmployeeId(
                                                conversationId,
                                                employee.getId())
                                .orElseThrow(() -> new RuntimeException("Conversation not found"));
        }

        private Employee getEmployeeByEmail(String email) {

                return employeeRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("Employee not found"));
        }
}