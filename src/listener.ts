import { randomBytes } from 'crypto';
import NATS, { Message, Stan } from 'node-nats-streaming'

console.clear()
const stan = NATS.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'

})

stan.on('connect', () => {
    console.log('Listener connected to NATS');

    stan.on('close', () => {
        console.log('NATS connection closed !');
        process.exit()
    })

    const option = stan
        .subscriptionOptions()
        .setManualAckMode(true)
        .setDeliverAllAvailable()
        .setDurableName('accouning-service')
    // queue-group-> for scaling services
    const subscription = stan.subscribe(
        'ticket:created',
        'orders-service-queue-group',
        option);
    subscription.on('message', (msg: Message) => {
        const data = msg.getData()
        if (typeof data === 'string') {
            console.log(`Recieved event #${msg.getSequence()}, with data ${data}`)
        }
        msg.ack()
    })
})

process.on('SIGINT', () => stan.close())
process.on('SIGTERM', () => stan.close())

abstract class Listener {
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
            console.log(`Message Received: ${this.subject}/ ${this.queueGroupName}`)
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