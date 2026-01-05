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
  return (
    <div>
      
    </div>
  )
}

export default page
