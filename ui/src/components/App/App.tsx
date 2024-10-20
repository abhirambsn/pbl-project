import React, { useEffect } from 'react'
import { QueueService } from '@service/QueueService';
import AuthenticationService from '@service/AuthenticationService';
import './App.css'
import { useAuthStore } from '@store/auth-store';
import { KnowledgeBaseService } from '@service/KnowledgeBaseService';

function App() {
  const [count, setCount] = React.useState(0);
  const authState = useAuthStore();
  const queueSvc = new QueueService();
  const kbSvc = new KnowledgeBaseService();

  useEffect(() => {
    ;(async () => {
      await AuthenticationService.initKeycloak(() => {
        authState.setIsAuthenticated(true);
        const keycloakProfile = AuthenticationService.getUserInfo();
        const userProfile = {
          email: keycloakProfile?.email || '',
          username: keycloakProfile?.username || '',
          firstName: keycloakProfile?.firstName || '',
          lastName: keycloakProfile?.lastName || '',
          emailVerified: keycloakProfile?.emailVerified || false,
          id: keycloakProfile?.id || ''
        }
        authState.setUserDetails(userProfile);
        authState.setToken(AuthenticationService.getToken());
      });
    })();
  }, [])

  useEffect(() => {
    if (!authState.isAuthenticated) return;
    const interval = setInterval(() => {
      console.log('DEBUG: polling for messages');
      queueSvc.recieveMessage();
    }, 30000);

    kbSvc.token = authState.token;

    return () => clearInterval(interval);
  }, [authState.isAuthenticated]);

  useState(() => {
    if (!authState.isAuthenticated) return;
    kbSvc.getKnowledgeBasesOfCurrentUser().then((data) => {
      console.log('DEBUG: knowledge bases', data);
    });
  }, [authState.isAuthenticated]);

  return (
    <div>
      <h1>App</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c+1)}>+</button>
      <button onClick={() => setCount(c => c <= 0 ? 0 : c-1)}>-</button>
    </div>
  )
}

export default App
