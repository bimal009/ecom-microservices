import { Consumer } from "./kafka"
import { createStripeProducts, deleteStripeProductsPrices } from "./StripeProducts"

export const runKafkaSubscriptions=async()=>{
    await Consumer.subscribe("product.created",async(message)=>{
        const product =message.value
        console.log("Received message in product.created handler",product)
        await createStripeProducts(product)
    })

    await Consumer.subscribe("product.deleted",async(message)=>{
        const productId =message.value
        console.log("Received message in product.created handler",productId)
        await deleteStripeProductsPrices(productId)
    })
}