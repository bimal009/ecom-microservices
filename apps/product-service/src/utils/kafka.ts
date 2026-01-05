import {createConsumer,createKafkaClient,createProducer} from "@repo/kafka"
 const kafkaClient=createKafkaClient("product-service")
export const Producer=createProducer(kafkaClient)
export const Consumer=createConsumer(kafkaClient,"product-group")
