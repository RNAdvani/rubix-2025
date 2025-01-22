import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Users } from "lucide-react"
import PeepsModal from "./peeps-modal"
import SharedWithYou from "./shared-with-you"
import YouShared from "./you-shared"
import Settings from "./settings"

export default function UserProfile() {
  const [isPeepsModalOpen, setIsPeepsModalOpen] = useState(false)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center mb-8">
        <Avatar className="w-32 h-32 mb-4">
          <AvatarImage src="/placeholder.svg?height=128&width=128" alt="User" />
          <AvatarFallback>UN</AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-bold mb-2">User Name</h1>
        <p className="text-gray-600 mb-4">@username</p>
        <Button onClick={() => setIsPeepsModalOpen(true)} variant="outline" className="flex items-center">
          <Users className="mr-2 h-4 w-4" />
          Peeps
        </Button>
      </div>

      <Tabs defaultValue="shared-with-you" className="w-full ">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="shared-with-you">Shared with you</TabsTrigger>
          <TabsTrigger value="you-shared">You shared</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="shared-with-you">
          <SharedWithYou />
        </TabsContent>
        <TabsContent value="you-shared">
          <YouShared />
        </TabsContent>
        <TabsContent value="settings">
          <Settings />
        </TabsContent>
      </Tabs>

      <PeepsModal isOpen={isPeepsModalOpen} onClose={() => setIsPeepsModalOpen(false)} />
    </div>
  )
}

