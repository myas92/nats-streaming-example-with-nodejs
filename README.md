# Introduction

Simple example for NATS streaming with NodeJS
# Modules
```bash
npm i node-nats-streaming 
npm i typescript
npm i @types/node 
npm i ts-node-dev
```

## Important terminologies
1- **Message**
```
import NATS, { Message } from 'node-nats-streaming'
...
...
...

subscription.on('message', (msg: Message) => {})

 ```
2- **getData()**

3- **getSequence()**

4- **Queue Grouping**
```
subscription.on('message', (msg: Message, 'service-queue-group') => {})
```