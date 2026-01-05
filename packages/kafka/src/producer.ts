import{ Partitioners, type Kafka, type Producer } from "kafkajs";

export const createProducer=(Kafka:Kafka)=>{

    const Producer:Producer = Kafka.producer({
          createPartitioner: Partitioners.DefaultPartitioner
    })

    const connect=async()=>{
    await Producer.connect()
    }

    const send=async(topic:string,message:object)=>{
        await Producer.send({
            topic:topic,
            messages:[{value:JSON.stringify({message})}]
            
        })
    }

    const disconnect=async()=>{
        await Producer.disconnect()
    }

    return {connect,send,disconnect}
}
