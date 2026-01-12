import {createKafkaClient,createProducer} from "@repo/kafka"
 const kafkaClient=createKafkaClient("auth-service")
export const Producer=createProducer(kafkaClient)
