import { randomBytes } from 'crypto';
import NATS, { Message } from 'node-nats-streaming'

console.clear()
const stan = NATS.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'

})

stan.on('connect', () => {
    console.log('Listener connected to NATS');

    stan.on('close', ()=>{
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

process.on('SIGINT', ()=> stan.close())
process.on('SIGTERM', ()=> stan.close())