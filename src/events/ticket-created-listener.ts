import { TicketCreatedEvent } from './ticket-created-events';
import { Message } from 'node-nats-streaming';
import { Listener } from "./based-listener";
import { Subjects } from './subjects';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject:Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = 'payment-service';
    onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        console.log('Event data', data);
        msg.ack()
    }
}