package com.pbl.chatapi.controller;

import com.pbl.chatapi.dto.NewChatMessage;
import com.pbl.chatapi.dto.JsonResponse;
import com.pbl.chatapi.dto.NewChatMetadata;
import com.pbl.chatapi.models.ChatMessage;
import com.pbl.chatapi.service.ChatService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
public class ChatController {
    private final ChatService chatService;

    @PostMapping
    public ResponseEntity<JsonResponse<String>> createNewChat(@RequestBody NewChatMetadata metadata) {
        String chat_id = chatService.createNewChat(metadata);
        return JsonResponse.makeResponse(
                HttpStatus.CREATED,
                chat_id,
                true
        );
    }

    @PutMapping("/{chat_id}")
    public ResponseEntity<JsonResponse<String>> createMessage(@PathVariable String chat_id, @RequestBody NewChatMessage message) {
        String msg_id = chatService.createMessage(message, chat_id);
        return JsonResponse.makeResponse(
                HttpStatus.CREATED,
                msg_id,
                true
        );
    }

    @GetMapping
    public ResponseEntity<JsonResponse<List<ChatMessage>>> getChatMessages(@RequestParam String chatId) {
        List<ChatMessage> messages = chatService.getChatsById(chatId);
        return JsonResponse.makeResponse(
                HttpStatus.OK,
                messages,
                true
        );
    }
}
