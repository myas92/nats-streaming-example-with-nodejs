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
1- **getData()**

2- **getSequence()**

3- **Message**

4- **Queue Grouping**
```
 subscription.on('message', (msg: Message) => {})