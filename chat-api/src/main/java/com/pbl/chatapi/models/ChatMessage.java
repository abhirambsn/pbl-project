package com.pbl.chatapi.models;

import com.pbl.chatapi.enums.SenderType;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class ChatMessage {
    @Id
    String _id;

    String message;
    SenderType senderType;

    @CreatedDate
    private Date createdOn;

    @Version
    private Integer version;
}
