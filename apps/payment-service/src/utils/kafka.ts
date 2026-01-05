import {createConsumer,createKafkaClient,createProducer} from "@repo/kafka"
 const kafkaClient=createKafkaClient("payment-service")
export const Producer=createProducer(kafkaClient)
export const Consumer=createConsumer(kafkaClient,"payment-group")
