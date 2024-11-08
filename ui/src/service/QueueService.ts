import {
  SQSClient,
  ReceiveMessageCommand,
  Message,
  DeleteMessageCommand,
} from "@aws-sdk/client-sqs";

export class QueueService {
  queueUrl: string;
  sqsClient: SQSClient;

  constructor() {
    this.queueUrl = import.meta.env.VITE_SQS_URL || "";
    this.sqsClient = new SQSClient({
      endpoint: "http://localhost.localstack.cloud:4566",
      region: "us-east-1",
      credentials: {
        accessKeyId: "test",
        secretAccessKey: "test",
      },
    });
  }

  private processMessages(messages: Array<Message>, chat_id: string): unknown {
    console.log("messages", messages);
    const result: unknown[] = [];
    messages.forEach((message) => {
      try {
        const body = JSON.parse(message.Body || "");
        console.log("DEBUG: parsed body", body);
        result.push(body);
        if (body.chat_id === chat_id) {
          if (body.type === "QUERY_RESULT") {
            const event = new CustomEvent("new-message-bot", {detail: {chat_id, body}});
            const invoked = document.dispatchEvent(event)
            if (!invoked) {
              console.error("DEBUG: new message event not invoked");
            }
          } else {
            const event = new CustomEvent("new-notification", {detail: {chat_id, body}});
            const invoked = document.dispatchEvent(event)
            if (!invoked) {
              console.error("DEBUG: new notification event not invoked");
            }
          }
          this.sqsClient.send(
            new DeleteMessageCommand({
              QueueUrl: this.queueUrl,
              ReceiptHandle: message.ReceiptHandle || "",
            })
          );
        }
      } catch (err) {
        console.error("DEBUG: error parsing message", err);
      }
    });
    return result;
  }

  async recieveMessage(chat_id: string) {
    try {
      const params = {
        MaxNumberOfMessages: 10,
        MessageAttributeNames: ["All"],
        QueueUrl: this.queueUrl,
        WaitTimeSeconds: 0,
      };

      const command = new ReceiveMessageCommand(params);

      const { Messages } = await this.sqsClient.send(command);
      if (!Messages) {
        console.log("DEBUG: no messages yet!");
        return [];
      }
      await this.processMessages(Messages, chat_id);
    } catch (error) {
      console.error("DEBUG: error", error);
    }
  }
}
