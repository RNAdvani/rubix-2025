import { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
   DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import debounce from "lodash/debounce";
import { api } from "@/lib/api";
import { Loader2, Check } from "lucide-react";

interface User {
   _id: string;
   username: string;
   email: string;
}

export function SearchUsers({
   onUserSelect,
   title,
   existingUsers = [],
}: {
   title: string;
   onUserSelect: (userId: string) => void;
   existingUsers?: string[];
}) {
   const [searchQuery, setSearchQuery] = useState("");
   const [searchResults, setSearchResults] = useState<User[]>([]);
   const [loading, setLoading] = useState(false);

   const fetchSearchResults = useCallback(
      async (query: string) => {
         if (!query) {
            setSearchResults([]);
            return;
         }
         setLoading(true);
         try {
            const res = await api.get(`/api/auth/search?query=${query}`);
            if (res.data.success) {
               // Filter out existing users
               const filteredUsers = res.data.users.filter(
                  (user: User) => !existingUsers.includes(user._id)
               );
               setSearchResults(filteredUsers);
            }
         } catch (error) {
            console.error("Error fetching search results:", error);
         } finally {
            setLoading(false);
         }
      },
      [existingUsers]
   );

   // Memoize debounced search with stable reference
   const debouncedSearch = useCallback(
      debounce((query: string) => {
         fetchSearchResults(query);
      }, 300),
      [] // Empty dependency array ensures stable reference
   );

   useEffect(() => {
      debouncedSearch(searchQuery);
      return () => debouncedSearch.cancel();
   }, [searchQuery, debouncedSearch]);

   const handleUserSelect = (userId: string) => {
      onUserSelect(userId);
      // Optional: You might want to clear search results after selection
      setSearchQuery("");
      setSearchResults([]);
   };

   return (
      <Dialog>
         <DialogTrigger asChild>
            <Button variant="outline">{title}</Button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
               <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
               <div className="flex space-x-2">
                  <Input
                     placeholder="Search by username or email"
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                  />
               </div>
               <div className="max-h-[300px] overflow-y-auto">
                  {loading ? (
                     <div className="flex justify-center">
                        <Loader2 className="size-7 animate-spin" />
                     </div>
                  ) : (
                     searchResults.map((user) => (
                        <div
                           key={user._id}
                           className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-gray-500/20"
                           onClick={() => handleUserSelect(user._id)}
                        >
                           <div className="flex items-center space-x-3">
                              <Avatar>
                                 <AvatarFallback>
                                    {user.email?.charAt(0).toUpperCase()}
                                 </AvatarFallback>
                              </Avatar>
                              <div>
                                 <p className="text-sm font-medium">
                                    {user.username}
                                 </p>
                                 <p className="text-xs">{user.email}</p>
                              </div>
                           </div>
                        </div>
                     ))
                  )}
               </div>
            </div>
         </DialogContent>
      </Dialog>
   );
}
