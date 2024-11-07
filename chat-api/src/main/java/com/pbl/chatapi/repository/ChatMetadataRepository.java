package com.pbl.chatapi.repository;

import com.pbl.chatapi.models.ChatMetadata;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ChatMetadataRepository extends MongoRepository<ChatMetadata, String> {
    List<ChatMetadata> findAllByCreatedBy(String createdBy);
}
