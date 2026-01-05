import type{ Consumer, Kafka, Producer } from "kafkajs";

export const createConsumer=(Kafka:Kafka,groupId:string)=>{

    const Consumer:Consumer = Kafka.consumer({groupId})

    const connect=async()=>{
    await Consumer.connect()
    console.log(`Kafka Consumer connected ${groupId}`)
    }

    const subscribe=async(
        topics:string,
        handler:(message:any)=>Promise<void>
    )=>{
        await Consumer.subscribe({
            topic:topics,
            fromBeginning:true
        })

        await Consumer.run({
            eachMessage:async({topic,partition,message})=>{
                try {
                    const value = message?.value?.toString()
                    if(value){
                        await handler(JSON.parse(value))
                    }
                } catch (error) {
                    console.log(error)
                    
                }
            }
        })
    }

    const disconnect=async()=>{
        await Consumer.disconnect()
    }

    return {connect,subscribe,disconnect}
}
