import DialogForm from "@/components/dialog-form";
import AuthenticationService from "@/service/AuthenticationService";
import { KnowledgeBaseService } from "@/service/KnowledgeBaseService";
import { QueueService } from "@/service/QueueService";
import { useAuthStore } from "@/store/auth-store";
import { MainContextType } from "@/typings";
import { createContext, useEffect, useState } from "react";

const initialState: MainContextType = {
  queueService: null,
  knowledgeBaseService: null,
};

export const MainContext = createContext<MainContextType>(initialState);

export const MainProvider = ({ children }: { children: React.ReactNode }) => {
  const [queueService, setQueueService] = useState<QueueService>();
  const [knowledgeBaseService, setKnowledgeBaseService] =
    useState<KnowledgeBaseService>();
  const authState = useAuthStore();

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
  }, [queueService, knowledgeBaseService]);

  useEffect(() => {
    if (!authState.isAuthenticated || !queueService || !knowledgeBaseService)
      return;
    const interval = setInterval(() => {
      console.log("DEBUG: polling for messages");
      queueService.recieveMessage();
    }, 30000);

    knowledgeBaseService.token = authState.token;

    return () => clearInterval(interval);
  }, [authState, knowledgeBaseService, queueService]);

  useEffect(() => {
    if (!authState.isAuthenticated || !knowledgeBaseService) return;
    knowledgeBaseService
      .getKnowledgeBasesOfCurrentUser()
      .then((data) => {
        console.log("DEBUG: knowledge bases", data);
      })
      .catch((err) => {
        console.error(err);
        authState.clear();
      });
  }, [authState, knowledgeBaseService]);

  return (
    <MainContext.Provider
      value={{
        queueService: queueService || null,
        knowledgeBaseService: knowledgeBaseService || null,
      }}
    >
      {children}
      <DialogForm />
    </MainContext.Provider>
  );
};
