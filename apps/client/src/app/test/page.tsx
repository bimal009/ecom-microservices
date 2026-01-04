import { auth } from '@clerk/nextjs/server'
import React from 'react'

const page = async() => {
    const {getToken}=await auth()
    const token =await getToken()
    console.log("Token from Clerk:", token)
    const res =await fetch("http://localhost:8000/test",{
        headers:{
            Authorization: `Bearer ${token}`
        }
    })
    const data=await res.text()
    console.log(data)

  return (
    <div>
      test page
    </div>
  )
}

export default page
