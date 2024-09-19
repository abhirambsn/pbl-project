package com.pbl.chatapi.repository;

import com.pbl.chatapi.models.ChatMetadata;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ChatMetadataRepository extends MongoRepository<ChatMetadata, String> {
}
