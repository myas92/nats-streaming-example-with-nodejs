import { Message, Stan } from "node-nats-streaming";

export abstract class Listener {
    abstract subject: string;
    abstract queueGroupName: string; 
    abstract onMessage(data: any, msg:Message): void;
    private client: Stan;
    protected awkWait = 5 * 1000;

    constructor(client: Stan) {
        this.client = client;
    }

    subsciptionOption() {
        return this.client
            .subscriptionOptions()
            .setDeliverAllAvailable()
            .setManualAckMode(true)
            .setAckWait(this.awkWait) // Default is 30s
            .setDurableName(this.queueGroupName)
    }

    listen() {
        const subscription = this.client.subscribe(this.subject, this.queueGroupName, this.subsciptionOption())
        subscription.on('message', (msg: Message) => {
            console.log(`Message Received ${msg.getSequence()}: ${this.subject}/${this.queueGroupName}`)
            const parsedMessage = this.parseMessage(msg);
            this.onMessage(parsedMessage, msg)
        })
    }

    parseMessage(msg: Message) {
        const data = msg.getData()
        return typeof data === 'string'
            ? JSON.parse(data)
            : JSON.parse(data.toString('utf-8'))
    }
}
