import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Search, Users, Check } from "lucide-react";
import { useState } from "react";

interface Collaborator {
  id: string;
  name: string;
  avatar: string;
}

interface Group {
  id: string;
  name: string;
  members: Collaborator[];
  createdAt: string;
}

// This would come from your database
const sampleGroups: Group[] = [
  {
    id: "1",
    name: "Family",
    members: [
      { id: "1", name: "Alice Smith", avatar: "/api/placeholder/100/100" },
      { id: "2", name: "Bob Johnson", avatar: "/api/placeholder/100/100" },
    ],
    createdAt: "2024-01-20",
  },
  {
    id: "2",
    name: "Work Team",
    members: [
      { id: "3", name: "Carol Williams", avatar: "/api/placeholder/100/100" },
      { id: "4", name: "David Brown", avatar: "/api/placeholder/100/100" },
    ],
    createdAt: "2024-01-21",
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
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  // This would be replaced with your actual data fetching logic
  const groups = sampleGroups;

  const collaborators = groups.flatMap((group) => group.members);
  const filteredCollaborators = collaborators.filter((c) =>
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

  const handleGroupSelect = (groupId: string) => {
    if (selectedGroupId === groupId) {
      setSelectedGroupId(null);
      setSelectedCollaborators(new Set());
    } else {
      setSelectedGroupId(groupId);
      const group = groups.find((g) => g.id === groupId);
      if (group) {
        setSelectedCollaborators(new Set(group.members.map((m) => m.id)));
      }
    }
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
              <div className="space-y-2">
                <Label>Your Groups</Label>
                <ScrollArea className="h-[200px]">
                  <div className="grid grid-cols-1 gap-2">
                    {groups.map((group) => (
                      <div
                        key={group.id}
                        onClick={() => handleGroupSelect(group.id)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedGroupId === group.id
                            ? "border-primary bg-primary/5"
                            : "hover:bg-muted"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{group.name}</span>
                          {selectedGroupId === group.id && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <Avatar>
                            {group.members.map((member) => (
                              <Avatar key={member.id} className="h-6 w-6">
                                <img src={member.avatar} alt={member.name} />
                              </Avatar>
                            ))}
                          </Avatar>
                          <span className="text-sm text-muted-foreground">
                            {group.members.length} members
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <div className="space-y-2">
                <Label>Or Add Individual Collaborators</Label>
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
              </div>

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

        <div className="space-y-2">
          <Button className="w-full" onClick={onClose}>
            Create Capsule
          </Button>
          <Button variant="outline" className="w-full" onClick={onClose}>
            Skip for now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCapsule;
