package com.pbl.chatapi.service;

import com.pbl.chatapi.dto.NewChatMessage;
import com.pbl.chatapi.dto.NewChatMetadata;
import com.pbl.chatapi.enums.SenderType;
import com.pbl.chatapi.models.ChatMessage;
import com.pbl.chatapi.models.ChatMetadata;
import com.pbl.chatapi.repository.ChatMetadataRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.CollectionOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@AllArgsConstructor
public class ChatService {
    private final MongoTemplate mongoTemplate;
    private final ChatMetadataRepository chatMetadataRepository;


    private String createChatCollection() {
        String chat_id = UUID.randomUUID().toString();
        String collectionName = "chat_" + chat_id;
        if (!mongoTemplate.collectionExists(collectionName)) {
            CollectionOptions options = CollectionOptions.empty();
            mongoTemplate.createCollection(collectionName, options);
        }
        return chat_id;
    }

    public String createNewChat(NewChatMetadata metadata) {
        String chat_id = createChatCollection();
        ChatMetadata chatMetadata = ChatMetadata.builder()
                ._id(chat_id)
                .chat_name(metadata.getName())
                .knowledgeBaseId(metadata.getKnowledgeBaseId())
                .createdBy(metadata.getCreatedBy())
                .build();

        chatMetadataRepository.save(chatMetadata);
        return chat_id;
    }

    public String createMessage(NewChatMessage message, String chat_id) {
        SenderType type = message.getSenderType().equals("user") ? SenderType.USER : SenderType.SYSTEM;
        ChatMessage newMessage = ChatMessage.builder()
                .message(message.getMessage())
                .senderType(type)
                .build();

        String collectionName = "chat_" + chat_id;
        mongoTemplate.insert(newMessage, collectionName);

        return newMessage.get_id();
    }

    public List<ChatMessage> getChatsById(String chat_id) {
        String collectionName = "chat_" + chat_id;
        return mongoTemplate.findAll(ChatMessage.class, collectionName);
    }
}
