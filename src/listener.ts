import { randomBytes } from 'crypto';
import NATS, { Message } from 'node-nats-streaming'

console.clear()
const stan = NATS.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'

})

stan.on('connect', () => {
    console.log('Listener connected to NATS');
    // queue-group-> for scaling services
    const subscription = stan.subscribe('ticket:created','orders-service-queue-group');
    subscription.on('message', (msg: Message) => {
        const data = msg.getData()
        if (typeof data === 'string') {
            console.log(`Recieved event #${msg.getSequence()}, with data ${data}`)
        }
    })
})