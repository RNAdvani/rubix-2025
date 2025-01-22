import TimeCapsuleDialog from "@/components/modals/CreateCapsuleDialog";
import { TimelineDemo } from "@/components/timeline";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Clock, Plus, Sparkles, Users } from "lucide-react";
import { useState } from "react";

// Mock data
const items = [
  {
    id: 1,
    title: "Summer Memories 2023",
    description: "A collection of our best moments from this summer",
    image:
      "https://sjc.microlink.io/djxdCugu4CRzM8ahIwkpWPdwFVBurlgy9kNsoZiS3ePsZS9lwa_3Hx2lkMIQwqaTAE45fZzqyN5BAYoCKTVU7A.jpeg",
    sharedBy: [
      { name: "Alex", avatar: "/placeholder.svg" },
      { name: "Sam", avatar: "/placeholder.svg" },
    ],
  },
  {
    id: 2,
    title: "Beach Weekend",
    description: "Unforgettable moments by the ocean",
    image: "/placeholder.svg",
    sharedBy: [
      { name: "Taylor", avatar: "/placeholder.svg" },
      { name: "Jordan", avatar: "/placeholder.svg" },
    ],
  },
  {
    id: 3,
    title: "Mountain Retreat",
    description: "Adventure in the wilderness",
    image: "/placeholder.svg",
    sharedBy: [
      { name: "Casey", avatar: "/placeholder.svg" },
      { name: "Morgan", avatar: "/placeholder.svg" },
    ],
  },
  {
    id: 4,
    title: "City Lights",
    description: "Urban exploration and nightlife",
    image: "/placeholder.svg",
    sharedBy: [
      { name: "Riley", avatar: "/placeholder.svg" },
      { name: "Jamie", avatar: "/placeholder.svg" },
    ],
  },
];

const suggestedUsers = [
  {
    name: "Sarah Wilson",
    username: "@sarahw",
    avatar: "/placeholder.svg",
  },
  {
    name: "Mike Johnson",
    username: "@mikej",
    avatar: "/placeholder.svg",
  },
  {
    name: "Emma Davis",
    username: "@emmad",
    avatar: "/placeholder.svg",
  },
  // Add more users
];

export default function Page() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);
  return (
    <div className="min-h-screen bg-background">
      <Card className="p-6 m-6 bg-primary text-secondary">
        <div className="flex justify-between items-start mb-4">
          <Clock className="h-8 w-8 " />
          <Sparkles className="h-6 w-6 " />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-secondary">
          Create a Time Capsule
        </h3>
        <p className="text-secondary mb-4">
          Preserve today's moments for tomorrow. AI-powered suggestions help you
          create meaningful time capsules.
        </p>
        <Button variant="secondary" className="w-full">
          Start Time Capsule
        </Button>
      </Card>

      {/* Scrollable Cards Section */}
      <div className="flex overflow-x-auto gap-6 p-6 pb-8 snap-x snap-mandatory">
        {items.map((item) => (
          <Card
            key={item.id}
            className="relative overflow-hidden h-64 min-w-[320px] snap-center"
          >
            <img
              src={item.image || "/placeholder.svg"}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-primary/60 to-primary/90" />
            <div className="relative z-10 p-6 flex flex-col h-full justify-between">
              <div>
                <CardTitle className="text-white mb-2">{item.title}</CardTitle>
                <CardDescription className="text-white/80">
                  {item.description}
                </CardDescription>
              </div>
              <div className="flex -space-x-2 overflow-hidden">
                {item.sharedBy.map((user, index) => (
                  <Avatar
                    key={index}
                    className="inline-block border-2 border-background"
                  >
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Banner Section */}
      <div className="relative h-64 bg-[url('/placeholder.svg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-primary/80" />
        <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Create Lasting Memories Together
            </h2>
            <p className="text-white/90 max-w-2xl">
              Join groups, share moments, and build connections that last a
              lifetime
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Users Section */}
      <div className="py-6 px-4">
        <h3 className="text-2xl font-semibold mb-6">Suggested Connections</h3>
        <div className="flex overflow-x-auto gap-4 w-full max-w-5xl mx-auto">
          {Array.from({ length: suggestedUsers.length }).map((_, userIndex) => (
            <div key={userIndex} className="flex-shrink-0 w-64">
              {/* Card 1 */}
              <div className="p-4 bg-white shadow rounded-md mb-4">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="w-16 h-16 mb-2">
                    <AvatarImage src={suggestedUsers[userIndex].avatar} />
                    <AvatarFallback>
                      {suggestedUsers[userIndex].name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <h4 className="font-medium">
                    {suggestedUsers[userIndex].name}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {suggestedUsers[userIndex].username}
                  </p>
                  <Button className="w-full" variant="outline">
                    Connect
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Group & Time Capsule CTAs */}
      <div className="grid md:grid-cols-2 gap-6 p-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex -space-x-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Avatar key={i} className="border-4 border-background">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <Button size="icon" variant="secondary">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <h3 className="text-xl font-semibold mb-2">Create a New Group</h3>
          <p className="text-muted-foreground mb-4">
            Start a community and invite friends to share memories together
          </p>
          <Button className="w-full">
            <Users className="mr-2 h-4 w-4" />
            Create Group
          </Button>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white">
          <div className="flex justify-between items-start mb-4">
            <Clock className="h-8 w-8" />
            <Sparkles className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Create a Time Capsule</h3>
          <p className="text-white/90 mb-4">
            Preserve today's moments for tomorrow. AI-powered suggestions help
            you create meaningful time capsules.
          </p>
          <Button variant="secondary" className="w-full">
            Start Time Capsule
          </Button>
        </Card>
      </div>

      <TimelineDemo />
    </div>
  );
}
