"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, UserPlus, UserMinus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Friend {
  id: number
  name: string
  username: string
  avatar: string
}

interface CreateGroupProps {
  friends: Friend[]
  isLoading: boolean
}

export default function CreateGroup({ friends, isLoading }: CreateGroupProps) {
  const [groupName, setGroupName] = useState("")
  const [invitedFriends, setInvitedFriends] = useState<number[]>([])

  const handleInvite = (id: number) => {
    setInvitedFriends((prev) => (prev.includes(id) ? prev.filter((friendId) => friendId !== id) : [...prev, id]))
  }

  const handleCreateGroup = () => {
    // Implement group creation logic here
    console.log("Creating group:", groupName, "with friends:", invitedFriends)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center flex-1">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Group</h1>
      <Input
        type="text"
        placeholder="Group Name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        className="mb-4"
      />
      <div className="overflow-y-auto max-h-[60vh] -mx-4 px-4 custom-scrollbar">
        <AnimatePresence>
          {friends.map((friend) => (
            <motion.div
              key={friend.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="bg-secondary rounded-lg p-4 mb-4 flex items-center justify-between"
            >
              <div className="flex items-center">
                <img
                  src={friend.avatar || "/placeholder.svg"}
                  alt={friend.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h2 className="font-semibold">{friend.name}</h2>
                  <p className="text-muted-foreground text-sm">@{friend.username}</p>
                </div>
              </div>
              <Button
                onClick={() => handleInvite(friend.id)}
                variant={invitedFriends.includes(friend.id) ? "destructive" : "secondary"}
                size="sm"
                className="ml-4"
              >
                {invitedFriends.includes(friend.id) ? (
                  <>
                    <UserMinus className="mr-2 h-4 w-4" />
                    Uninvite
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Invite
                  </>
                )}
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <Button onClick={handleCreateGroup} className="mt-4 w-full">
        Create Group
      </Button>
    </div>
  )
}

