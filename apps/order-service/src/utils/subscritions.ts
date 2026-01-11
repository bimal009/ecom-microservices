import { Consumer } from "./kafka"
import { createOrder } from "./order"

export const runKafkaSubscriptions = async () => {
    await Consumer.subscribe([
        {
            topicName: "payment.successful",
            topicHandler: async (message) => {
                console.log("Received message in payment.successful handler", message)
                const order = message.value
                await createOrder(order)
            }
        }
    ])
}