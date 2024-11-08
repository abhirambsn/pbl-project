package com.pbl.chatapi.models;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ChatMetadata {

    @Id
    private String _id;
    private String chat_name;
    private String createdBy;
    private String knowledgeBaseId;

    @CreatedDate
    private Date createdOn;

    @Version
    private Integer version;
}
