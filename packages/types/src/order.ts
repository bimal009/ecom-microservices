import {orderSchemaType} from "@repo/order-db"


export type OrderType=orderSchemaType &{
_id:string
}

export type OrderChartType={
    month:string,
    total:number,
    successful:number
}