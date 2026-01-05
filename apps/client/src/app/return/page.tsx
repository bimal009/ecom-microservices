import React from 'react'

interface props {
  searchParams:Promise<{
    session_id:string
  }>
}
const page = async ({searchParams}:props) => {
  const sessionId=(await searchParams)?.session_id
  if(!sessionId){
    return <div>Invalid session</div>
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL}/sessions/${sessionId}`,{
    method:"GET"
  })

  if(!res.ok){
    return <div>Error fetching session details</div>
  }


  const data = await res.json()
  console.log(data)
  return (
    <div>
      
    </div>
  )
}

export default page
