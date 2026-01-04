import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen mt-10">
      <SignIn />
    </div>
  )
}