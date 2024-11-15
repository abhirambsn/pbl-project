/* eslint-disable react-refresh/only-export-components */
import DialogForm from "@/components/dialog-form";
import { useToast } from "@/hooks/use-toast";
import AuthenticationService from "@/service/AuthenticationService";
import { ChatService } from "@/service/ChatService";
import { KnowledgeBaseService } from "@/service/KnowledgeBaseService";
import { QueueService } from "@/service/QueueService";
import { RAGBotService } from "@/service/RAGBotService";
import { useAuthStore } from "@/store/auth-store";
import { useChatStore } from "@/store/chat-store";
import { useKnowledgeBaseStore } from "@/store/kb-store";
import { useNotificationStore } from "@/store/notifications-store";
import { ChatMetadata, MainContextType, MessageList } from "@/typings";
import { createContext, useCallback, useEffect, useState } from "react";

const initialState: MainContextType = {
  queueService: null,
  knowledgeBaseService: null,
  chatService: null,
  ragBotService: null,
  fetchChatMessages: async () => [],
};

export const MainContext = createContext<MainContextType>(initialState);

export const MainProvider = ({ children }: { children: React.ReactNode }) => {
  const [queueService, setQueueService] = useState<QueueService>();
  const [knowledgeBaseService, setKnowledgeBaseService] =
    useState<KnowledgeBaseService>();
  const [chatService, setChatService] = useState<ChatService>();
  const [ragBotService, setRagBotService] = useState<RAGBotService>();
  const authState = useAuthStore();
  const { setKnowledgeBaseList } = useKnowledgeBaseStore();
  const { setChats, currentChat } = useChatStore();
  const { addNotification } = useNotificationStore();
  const { toast } = useToast();

  useEffect(() => {
    if (!authState.isAuthenticated) return;
    if (authState.expiresAt < Date.now()) {
      console.log("DEBUG: Session expired");
      alert("Session Expired, Login again");
      authState.clear();
    }
  }, [authState]);

  useEffect(() => {
    (async () => {
      if (authState.isAuthenticated) return;
      await AuthenticationService.initKeycloak(() => {
        authState.setIsAuthenticated(true);
        const keycloakProfile = AuthenticationService.getUserInfo();
        const userProfile = {
          email: keycloakProfile?.email || "",
          username: keycloakProfile?.username || "",
          firstName: keycloakProfile?.firstName || "",
          lastName: keycloakProfile?.lastName || "",
          emailVerified: keycloakProfile?.emailVerified || false,
          id: keycloakProfile?.id || "",
        };
        authState.setUserDetails(userProfile);
        authState.setToken(AuthenticationService.getToken());
        let expiresAt = AuthenticationService.getExpiresAt();
        if (!expiresAt) {
          expiresAt = Date.now() + 1000 * 60 * 60;
        } else {
          expiresAt = expiresAt * 1000;
        }
        authState.setExpiresAt(expiresAt);
      });
    })();
  }, [authState]);

  useEffect(() => {
    if (!queueService) {
      console.log("DEBUG: creating queue service");
      setQueueService(new QueueService());
    }
    if (!knowledgeBaseService) {
      console.log("DEBUG: creating knowledge base service");
      setKnowledgeBaseService(new KnowledgeBaseService());
    }
    if (!chatService) {
      console.log("DEBUG: creating chat service");
      setChatService(new ChatService());
    }
    if (!ragBotService) {
      console.log("DEBUG: creating rag bot service");
      setRagBotService(new RAGBotService());
    }
  }, [queueService, knowledgeBaseService, chatService, ragBotService]);

  useEffect(() => {
    if (
      !authState.isAuthenticated ||
      !queueService ||
      !knowledgeBaseService ||
      !chatService ||
      !ragBotService
    )
      return;

    knowledgeBaseService.token = authState.token;
    chatService.token = authState.token;
    ragBotService.token = authState.token;
  }, [
    authState,
    knowledgeBaseService,
    queueService,
    chatService,
    ragBotService,
  ]);

  useEffect(() => {
    if (!authState.isAuthenticated || !queueService || !currentChat) return;

    console.log("DEBUG: starting poll for messages of chat", currentChat.id);
    const interval = setInterval(() => {
      console.log("DEBUG: polling for messages of chat", currentChat.id);
      queueService.recieveMessage(currentChat.id);
    }, 5000);

    return () => clearInterval(interval);
  }, [authState, queueService, currentChat]);

  useEffect(() => {
    if (!authState.isAuthenticated || !knowledgeBaseService) return;
    knowledgeBaseService
      .getKnowledgeBasesOfCurrentUser()
      .then((data) => {
        console.log("DEBUG: knowledge bases", data);
        if (data) setKnowledgeBaseList(data);
      })
      .catch((err) => {
        console.error(err);
        authState.clear();
      });
  }, [authState, knowledgeBaseService, setKnowledgeBaseList]);

  useEffect(() => {
    if (!authState.isAuthenticated || !chatService) return;
    console.log("DEBUG: authState -> UserDetails", authState.userDetails);
    chatService
      .getAllChats(authState.userDetails?.id || "")
      .then((data) => {
        console.log("DEBUG: chats", data);
        if (data) setChats(data as ChatMetadata[]);
      })
      .catch((err) => {
        console.error(err);
        authState.clear();
      });
  }, [authState, chatService, setChats]);

  const handleNotificationRecieve = useCallback(
    (event: CustomEvent) => {
      console.log("DEBUG: new notification event", event.detail);
      const { body } = event.detail;
      addNotification({
        message: body.message,
        read: false,
        timestamp: Date.now(),
        id: "notification" + Math.random().toString(),
        type: "success",
      });
      toast({
        title: "Documents Stored",
        description: body.message,
      });
    },
    [addNotification, toast]
  );

  useEffect(() => {
    if (!authState.isAuthenticated) return;
    console.log("DEBUG: Adding Notification Event Listener");
    window.addEventListener(
      "new-notification",
      handleNotificationRecieve as EventListener
    );

    return () => {
      console.log("DEBUG: Removing Event Listener");
      window.removeEventListener(
        "new-notification",
        handleNotificationRecieve as EventListener
      );
    };
  }, [handleNotificationRecieve, authState]);

  const fetchChatMessages = async (
    chatId: string | undefined
  ): Promise<MessageList> => {
    if (!chatService || !authState.isAuthenticated || !chatId) return [];
    return (await chatService.getMessagesOfChat(chatId)) || [];
  };

  return (
    <MainContext.Provider
      value={{
        queueService: queueService || null,
        knowledgeBaseService: knowledgeBaseService || null,
        chatService: chatService || null,
        ragBotService: ragBotService || null,
        fetchChatMessages,
      }}
    >
      {children}
      <DialogForm />
    </MainContext.Provider>
  );
};
