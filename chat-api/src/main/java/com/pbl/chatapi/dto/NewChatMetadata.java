package com.pbl.chatapi.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class NewChatMetadata {
    String name;
    String createdBy;
    String knowledgeBaseId;
}
