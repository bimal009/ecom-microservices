import {createConsumer,createKafkaClient} from "@repo/kafka"
 const kafkaClient=createKafkaClient("email-service")
export const Consumer=createConsumer(kafkaClient,"email-group")
