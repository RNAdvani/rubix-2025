import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface SharedItem {
  id: number
  title: string
  description: string
  image: string
  sharedWith: { name: string; avatar: string }[]
}

const dummySharedItems: SharedItem[] = [
  {
    id: 1,
    title: "Birthday Party Plans",
    description: "Ideas and arrangements for next month's celebration",
    image: "/placeholder.svg?height=200&width=300",
    sharedWith: [
      { name: "Rohan", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Sanya", avatar: "/placeholder.svg?height=32&width=32" },
    ],
  },
  {
    id: 2,
    title: "Travel Itinerary",
    description: "Detailed plan for our upcoming Europe trip",
    image: "/placeholder.svg?height=200&width=300",
    sharedWith: [
      { name: "Advait", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Zara", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Dhruv", avatar: "/placeholder.svg?height=32&width=32" },
    ],
  },
]

export default function YouShared() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {dummySharedItems.map((item) => (
        <Card key={item.id} className="relative overflow-hidden h-64">
          <img
            src={item.image || "/placeholder.svg"}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 to-primary/90"></div>
          <div className="relative z-10 p-6 flex flex-col h-full justify-between">
            <div>
              <CardTitle className="text-white mb-2">{item.title}</CardTitle>
              <CardDescription className="text-white/80">{item.description}</CardDescription>
            </div>
            <div className="flex -space-x-2 overflow-hidden">
              {item.sharedWith.map((user, index) => (
                <Avatar key={index} className="inline-block border-2 border-background">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

