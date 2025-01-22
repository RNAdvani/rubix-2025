import CreateGroup from "../components/CreateGroup"

const dummyFriends = [
  { id: 1, name: "John Doe", username: "johndoe", avatar: "/placeholder.svg" },
  { id: 2, name: "Jane Smith", username: "janesmith", avatar: "/placeholder.svg" },
  { id: 3, name: "Bob Johnson", username: "bobjohnson", avatar: "/placeholder.svg" },
]

export default function GroupPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-4">
        <CreateGroup friends={dummyFriends} isLoading={false} />
      </main>
    </div>
  )
}

