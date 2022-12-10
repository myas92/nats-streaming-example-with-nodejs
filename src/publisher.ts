import { TicketCreatedPublisher } from './events/ticket-created-publisher';
import nats from 'node-nats-streaming';
import {randomBytes} from 'crypto'
console.clear()
const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
})

stan.on('connect', () => {
    console.log('Publisher connected to NATS');

    const data = {
        id: '0',
        title: 'hi',
        price: 10
    }
    const publisher = new TicketCreatedPublisher(stan);
    publisher.publish(data);
})
