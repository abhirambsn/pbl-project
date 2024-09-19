package com.pbl.chatapi.dto;

import com.pbl.chatapi.enums.SenderType;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class NewChatMessage {
    String message;
    String senderType;
}
