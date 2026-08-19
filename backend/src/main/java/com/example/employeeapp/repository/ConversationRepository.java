package com.example.employeeapp.repository;

import com.example.employeeapp.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ConversationRepository
        extends JpaRepository<Conversation, Long> {

    List<Conversation> findByEmployeeIdOrderByUpdatedAtDesc(Long employeeId);

    Optional<Conversation> findByIdAndEmployeeId(
            Long conversationId,
            Long employeeId);
}