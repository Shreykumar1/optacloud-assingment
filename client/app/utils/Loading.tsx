import { Loader2 } from "lucide-react"

export default function Component() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-600">
      <div className="text-white">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    </div>
  )
}