import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"; // Adjust paths as needed
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Search, Plus, Users } from "lucide-react";
import { useState } from "react";

interface Collaborator {
  id: string;
  name: string;
  avatar: string;
}

const sampleCollaborators: Collaborator[] = [
  {
    id: "1",
    name: "Alice Smith",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format",
  },
  {
    id: "2",
    name: "Bob Johnson",
    avatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format",
  },
  {
    id: "3",
    name: "Carol Williams",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format",
  },
];

interface CreateCapsuleProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateCapsule = ({ isOpen, onClose }: CreateCapsuleProps) => {
  const [username, setUsername] = useState("");
  const [capsuleType, setCapsuleType] = useState("individual");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCollaborators, setSelectedCollaborators] = useState<
    Set<string>
  >(new Set());

  const filteredCollaborators = sampleCollaborators.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleCollaborator = (id: string) => {
    setSelectedCollaborators((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Capsule</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Capsule Type</Label>
            <RadioGroup
              value={capsuleType}
              onValueChange={setCapsuleType}
              className="flex flex-col gap-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="individual" id="individual" />
                <Label htmlFor="individual">Individual</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="group" id="group" />
                <Label htmlFor="group">Group</Label>
              </div>
            </RadioGroup>
          </div>

          {capsuleType === "group" && (
            <div className="space-y-4">
              <Label>Invite Collaborators</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search collaborators..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <ScrollArea className="h-[200px] rounded-md border">
                <div className="p-4 space-y-2">
                  {filteredCollaborators.map((collaborator) => (
                    <div
                      key={collaborator.id}
                      className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                        selectedCollaborators.has(collaborator.id)
                          ? "bg-primary/10"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => toggleCollaborator(collaborator.id)}
                    >
                      <Avatar className="h-8 w-8">
                        <img
                          src={collaborator.avatar}
                          alt={collaborator.name}
                        />
                      </Avatar>
                      <span className="flex-1">{collaborator.name}</span>
                      {selectedCollaborators.has(collaborator.id) && (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
              {selectedCollaborators.size > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>
                    {selectedCollaborators.size} collaborator
                    {selectedCollaborators.size !== 1 ? "s" : ""} selected
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
        <Button className="w-full" onClick={onClose}>
          Create Capsule
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCapsule;
