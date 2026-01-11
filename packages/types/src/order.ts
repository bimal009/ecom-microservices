import {orderSchemaType} from "@repo/order-db"


export type OrderType=orderSchemaType &{
_id:string
}