import type{ Kafka, Producer } from "kafkajs";

export const createProducer=(Kafka:Kafka)=>{

    const Producer:Producer = Kafka.producer()

    const connect=async()=>{
    await Producer.connect()
    }

    const sendMessages=async(topic:string,message:object)=>{
        await Producer.send({
            topic:topic,
            messages:[{value:JSON.stringify({message})}]
        })
    }

    const disconnect=async()=>{
        await Producer.disconnect()
    }

    return {connect,sendMessages,disconnect}
}
