import { Consumer } from "./kafka"
import { createStripeProducts, deleteStripeProductsPrices } from "./StripeProducts"

export const runKafkaSubscriptions = async () => {
    await Consumer.subscribe([
        {
            topicName: "product.created",
            topicHandler: async (message) => {
                console.log("Received message in product.created handler", message)
                await createStripeProducts(message)
            }
        },
        {
            topicName: "product.deleted",
            topicHandler: async (message) => {
                console.log("Received message in product.deleted handler", message)
                await deleteStripeProductsPrices(message)
            }
        }
    ])
}