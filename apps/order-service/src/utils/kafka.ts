import {createConsumer,createKafkaClient,createProducer} from "@repo/kafka"
 const kafkaClient=createKafkaClient("order-service")
export const Producer=createProducer(kafkaClient)
export const Consumer=createConsumer(kafkaClient,"order-group")
