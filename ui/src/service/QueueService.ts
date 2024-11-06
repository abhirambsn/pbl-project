import { SQSClient, ReceiveMessageCommand, Message, DeleteMessageCommand } from '@aws-sdk/client-sqs';

export class QueueService {
    queueUrl: string;
    sqsClient: SQSClient;

    constructor() {
        this.queueUrl = import.meta.env.VITE_SQS_URL || '';
        this.sqsClient = new SQSClient({
            endpoint: 'http://localhost.localstack.cloud:4566',
            region: 'us-east-1',
            credentials: {
                accessKeyId: 'test',
                secretAccessKey: 'test'
            }
        }); 
    }

    private processMessages(messages: Array<Message>): unknown {
        console.log('messages', messages);
        const result: unknown[] = [];
        messages.forEach((message) => {
            try {
                const body = JSON.parse(message.Body || '');
                console.log('DEBUG: parsed body', body);
                result.push(body);
            } catch (err) {
                console.error('DEBUG: error parsing message', err);
            }
            this.sqsClient.send(new DeleteMessageCommand({
                QueueUrl: this.queueUrl,
                ReceiptHandle: message.ReceiptHandle || ''
            }))
        })
        return result;
    }

    async recieveMessage() {
        try {
            const params = {
                MaxNumberOfMessages: 10,
                MessageAttributeNames: ["All"],
                QueueUrl: this.queueUrl,
                WaitTimeSeconds: 0,
            }
    
            const command = new ReceiveMessageCommand(params);
    
            const {Messages} = await this.sqsClient.send(command);
            if (!Messages) {
                console.log('DEBUG: no messages yet!');
                return [];
            }
            await this.processMessages(Messages);
        } catch (error) {
            console.error('DEBUG: error', error);
        }
    }
}