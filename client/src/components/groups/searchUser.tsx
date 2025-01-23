import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import axios from "axios";

interface User {
  _id: string;
  username: string;
  email: string;
}

export function SearchUsers({
  onUserSelect,
  selectedUsers,
}: {
  onUserSelect: (user: User) => void;
  selectedUsers: User[];
}) {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!query) return;

    setIsSearching(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/auth/search?query=${query}`
      );
      console.log(response.data.users);
      const data = response.data.users;
      // const filteredUsers = data.users.filter(
      //   (user: User) =>
      //     !selectedUsers.some((selected) => selected._id === user._id)
      // );

      setUsers(data);
    } catch (error) {
      console.error("Error searching users", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Members</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Search Users</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Search by username or email"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {users.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => onUserSelect(user)}
              >
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>
                      {user?.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user.username}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
