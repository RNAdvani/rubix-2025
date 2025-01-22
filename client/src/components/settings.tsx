import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function Settings() {
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input id="username" defaultValue="@username" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" defaultValue="user@example.com" />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="notifications">Enable Notifications</Label>
        <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="darkMode">Dark Mode</Label>
        <Switch id="darkMode" checked={darkMode} onCheckedChange={setDarkMode} />
      </div>
      <Button className="w-full">Save Changes</Button>
    </div>
  )
}

