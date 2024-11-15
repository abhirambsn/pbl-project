# Installation Guide

## Pre-requisites

1. **Docker Desktop installed**
2. **Default Kubernetes Cluster Enabled (with kubectl installed)**

Follow the steps below to set up the project:

1. **Run setup-ghcr-secret.sh**
    - Ask @abhirambsn for the secret.
    ```sh
    sh setup-ghcr-secret.sh
    ```

2. **Fetch API Keys**
    - Pinecone API Key
    - Google API Key
    - Supabase Postgres Database URL (ask @abhirambsn for the URL).

3. **Run setup-cert.sh**
    ```sh
    sh setup-cert.sh keycloak.convobot.cloud
    ```

4. **Run start-external-svc.sh**
    ```sh
    sh start-external-svc.sh
    ```

5. **Run start-all-svc.sh**
    ```sh
    sh start-all-svc.sh start
    ```

6. **Add the rootCA.crt to your keychain and mark it as trusted**
    - Search Google for instructions on how to do this.

7. **Login to Keycloak**
    - Go to [https://keycloak.convobot.cloud](https://keycloak.convobot.cloud) and login with the credentials:
      - Username: `admin`
      - Password: `change_me`

8. **Create a Custom Admin User**
    - After logging in, create a new user with admin privileges.
    - Go to the "Users" section, click "Add user", and fill in the required details.
    - Set a password for the new user.
    - Assign the necessary roles to the new user.
    - Delete the temporary `admin` user.

9. **Create a Realm**
    - Name the realm `pbl-api`.

10. **Create a Client**
     - Switch to the realm `pbl-api`
     - Name the client `ui-client`.
     - Set the callback URL to `http://localhost:5173/*`.
     - Set the web origin to `http://localhost:5173`.

11. **Setup the UI**
     - Navigate to the `ui` folder.
     - Run the following commands:
        ```sh
        npm install
        npm run dev
        ```

Follow these steps to complete the installation process.