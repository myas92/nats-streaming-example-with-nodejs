import { Message } from 'node-nats-streaming';
import { Listener } from "./based-listener";

export class TicketCreatedListener extends Listener {
    subject='ticket:created';
    queueGroupName='orders-service-queue-group';
    onMessage(data: any, msg: Message) {
        console.log('Event message', data);
        msg.ack()
    }
}