import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function CreateTimeCapsule() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const handleCreateTimeCapsule = () => {
    // Implement time capsule creation logic here
    console.log("Creating time capsule:", { name, description })
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Time Capsule</h1>
      <div className="space-y-4">
        <div>
          <Label htmlFor="capsule-name">Name</Label>
          <Input
            id="capsule-name"
            type="text"
            placeholder="Time Capsule Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="capsule-description">Description</Label>
          <Textarea
            id="capsule-description"
            placeholder="Describe your time capsule..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>
        <Button onClick={handleCreateTimeCapsule} className="w-full">
          Create Time Capsule
        </Button>
      </div>
    </div>
  )
}

