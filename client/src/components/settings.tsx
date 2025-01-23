import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useUser } from "./hooks/use-user";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Cookies from "js-cookie";

export function Logout() {

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="w-full text-red-600">Log out</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
        You can always log out of your account later
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => {
        Cookies.remove("token");
        window.location.reload();
          }}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default function Settings() {
   const [notifications, setNotifications] = useState(true);
   const [darkMode, setDarkMode] = useState(false);

   const { user } = useUser();

   return (
    <div className="space-y-6">
    <div className="space-y-2">
      <Label htmlFor="username">Username</Label>
      <Input
        id="username"
        defaultValue={`@${user?.username}` || "@username"}
      />
    </div>
  
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" defaultValue={user?.email || "user@example.com"} />
    </div>
  
    <div className="flex items-center justify-between">
      <Label htmlFor="notifications">Enable Notifications</Label>
      <Switch
        id="notifications"
        checked={notifications}
        onCheckedChange={setNotifications}
      />
    </div>
  
    <div className="flex items-center justify-between">
      <Label htmlFor="darkMode">Dark Mode</Label>
      <Switch
        id="darkMode"
        checked={darkMode}
        onCheckedChange={setDarkMode}
      />
    </div>
  
    <Button className="w-full">Save Changes</Button>
    
    <Logout />
  </div>
  
   );
}
