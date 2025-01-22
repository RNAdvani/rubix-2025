import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface SharedItem {
  id: number
  title: string
  description: string
  image: string
  sharedBy: { name: string; avatar: string }[]
}

const dummySharedItems: SharedItem[] = [
  {
    id: 1,
    title: "Summer Vacation Photos",
    description: "Beautiful memories from our trip to Bali",
    image: "/placeholder.svg?height=200&width=300",
    sharedBy: [
      { name: "Aarav", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Diya", avatar: "/placeholder.svg?height=32&width=32" },
    ],
  },
  {
    id: 2,
    title: "Project Presentation",
    description: "Final slides for the client meeting",
    image: "/placeholder.svg?height=200&width=300",
    sharedBy: [{ name: "Vihaan", avatar: "/placeholder.svg?height=32&width=32" }],
  },
  {
    id: 3,
    title: "Recipe Collection",
    description: "Our favorite family recipes",
    image: "/placeholder.svg?height=200&width=300",
    sharedBy: [
      { name: "Ananya", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Ishaan", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Kavya", avatar: "/placeholder.svg?height=32&width=32" },
    ],
  },
  {
    id: 4,
    title: "Project Presentation",
    description: "Final slides for the client meeting",
    image: "/placeholder.svg?height=200&width=300",
    sharedBy: [{ name: "Vihaan", avatar: "/placeholder.svg?height=32&width=32" }],
  },
  {
    id: 5,
    title: "Recipe Collection",
    description: "Our favorite family recipes",
    image: "/placeholder.svg?height=200&width=300",
    sharedBy: [
      { name: "Ananya", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Ishaan", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Kavya", avatar: "/placeholder.svg?height=32&width=32" },
    ],
  },
  
  
]

export default function SharedWithYou() {
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
              {item.sharedBy.map((user, index) => (
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

