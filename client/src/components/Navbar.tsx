import { Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { ModeToggle } from "./theme/theme-toggle"

export default function Navbar() {
  const navigate = useNavigate()
  return (
    <nav className="sticky top-0 bg-primary text-primary-foreground p-4 shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center">
        <a               onClick={() => navigate("/dashboard")}
 className="text-xl font-bold font-serif">
          mypeeps
        </a>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => navigate("notifications")}>
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => navigate("profile")}>
            <User className="h-5 w-5" />
          </Button>
          <ModeToggle/>
        </div>
      </div>
    </nav>
  )
}

