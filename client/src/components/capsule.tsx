import { useState } from "react";
import { format } from "date-fns";
import {
  Lock,
  Instagram,
  Clock,
  Calendar,
  Menu,
  AlertTriangle,
  X,
  ImagePlus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { base64ToFile, cn } from "@/lib/utils";
import { Capsule, MediaFile } from "@/lib/types";
import { FileUpload } from "./file-upload";
import { SearchUsers } from "./groups/searchUser";
import { CapsuleLockModal } from "./lock-modal";

interface CapsulePageProps {
  data: Capsule;
  onAddCollaborator: (userId: string) => void;
  onAddRecipient: (userId: string) => void;
  onUpdateCollaboratorLock?: (canLock: boolean) => void;
  onAddMedia: (files: File[]) => void;
}

export const CapsulePage = ({
  data,
  onAddCollaborator,
  onAddRecipient,
  onUpdateCollaboratorLock,
  onAddMedia,
}: CapsulePageProps) => {
  const [isCollaboratorLock, setIsCollaboratorLock] = useState(
    data.isCollaboratorLock ?? false
  );
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const [mediaItems, setMediaItems] = useState<MediaFile[]>([]);
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);

  const handleCollaboratorLockToggle = (checked: boolean) => {
    setIsCollaboratorLock(checked);
    onUpdateCollaboratorLock?.(checked);
  };

  const handleUploadMedia = async () => {
    if (onAddMedia && mediaItems.length > 0) {
      const mediaFiles = mediaItems.map((file, index) => ({
        id: `${Date.now()}-${index}`,
        url: base64ToFile(file.url, file.id),
        alt: file.alt,
        type: file.type || "image",
      }));

      onAddMedia(mediaFiles.map((file) => file.url));
      setMediaItems([]);
      setShowMediaUpload(false);
    }
  };

  if (!data)
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <AlertTriangle />
        <p className="text-muted-foreground text-sm mt-2">
          Error fetching capsule
        </p>
      </div>
    );

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 max-w-4xl">
      <Card className="overflow-hidden">
        <CardHeader className="space-y-4">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1 flex-1">
              <CardTitle className="text-2xl sm:text-3xl font-bold break-words">
                {data.title}
              </CardTitle>
              <p className="text-muted-foreground text-sm sm:text-base">
                {data?.description}
              </p>
            </div>

            {/* Mobile Menu Button */}
            <div className="w-full flex justify-end">
              <Button
                variant="ghost"
                size="icon"
                className="sm:hidden self-end border border-muted-foreground"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>

            <div
              className={cn(
                "flex  items-start sm:items-center gap-4",
                showMobileMenu ? "block" : "hidden sm:flex"
              )}
            >
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <div className="flex justify-between p-1 items-center gap-2">
                  <span className="text-md whitespace-nowrap">
                    Allow Collaborator Lock
                  </span>
                  <Switch
                    checked={isCollaboratorLock}
                    onCheckedChange={handleCollaboratorLockToggle}
                  />
                </div>
              </div>

              {/* Add Collaborators */}
              <div className="py-2">
                <SearchUsers
                  className="w-full "
                  onUserSelect={(userId) => onAddCollaborator(userId)}
                  title="Add Collaborators"
                  existingUsers={(data.contributors ?? []).map((c) => c._id)}
                />
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 ">
            <Badge variant="secondary" className="gap-1 text-xs sm:text-sm">
              <Lock className="w-3 h-3" />
              <span className="hidden xs:inline p-1">
                Collaborators Can Lock
              </span>
              <span className="xs:hidden p-1">Collab Lock</span>
            </Badge>
            <Badge variant="secondary" className="gap-1 text-xs sm:text-sm">
              <Lock className="w-3 h-3" />
              <span className="hidden xs:inline">Permanent Lock</span>
              <span className="xs:hidden">Perm</span>
            </Badge>
            <Badge variant="secondary" className="gap-1 text-xs sm:text-sm">
              <Instagram className="w-3 h-3" />
              <span className="hidden xs:inline">Instagram Upload</span>
              <span className="xs:hidden p-1">IG</span>
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Time Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            {data.createdAt && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground whitespace-nowrap">
                  Created:
                </span>
                <span className="truncate">
                  {format(new Date(data.createdAt), "PPP")}
                </span>
              </div>
            )}
            {data.unlockDate && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground whitespace-nowrap">
                  Unlock Date:
                </span>
                <span className="truncate">
                  {format(new Date(data.unlockDate), "PPP")}
                </span>
              </div>
            )}
          </div>

          <Separator />

          {data.media && data.media.length > 0 && (
            <>
              <div className="space-y-2">
                <h3 className="font-semibold text-sm sm:text-base">Media</h3>
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                  {data.media.map((media: any) => (
                    <div
                      key={media?._id}
                      className="group relative aspect-square rounded-lg overflow-hidden bg-muted"
                    >
                      <img
                        src={media?.url}
                        alt={"Media"}
                        className="object-cover w-full h-full transition-transform group-hover:scale-105"
                        loading="lazy"
                      />
                      {/* {media?.metadata?.description && (
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 sm:p-4">
                                       <p className="text-white text-xs sm:text-sm text-center line-clamp-3">
                                          {media?.metadata.description}
                                       </p>
                                    </div>
                                 )} */}
                    </div>
                  ))}
                </div>
              </div>

              <Dialog open={showMediaUpload} onOpenChange={setShowMediaUpload}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <ImagePlus className="size-10" />
                    <span className="hidden xs:inline">Add Media</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] max-w-[425px] sm:w-full">
                  <DialogHeader>
                    <DialogTitle>Upload Media</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <FileUpload setMediaItems={setMediaItems} />

                    {mediaItems.length > 0 && (
                      <ScrollArea className="h-[200px] rounded-md border">
                        <div className="p-4 space-y-2">
                          {mediaItems.map((item, index) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between p-2 bg-muted rounded-lg"
                            >
                              <span className="text-sm truncate flex-1 mr-2">
                                {item.alt}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  setMediaItems((prev) =>
                                    prev.filter((_, i) => i !== index)
                                  )
                                }
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    )}

                    <Button
                      className="w-full"
                      disabled={mediaItems.length === 0}
                      onClick={handleUploadMedia}
                    >
                      Upload {mediaItems.length} file
                      {mediaItems.length !== 1 ? "s" : ""}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}

          <Separator />

          {/* Recipients and Contributors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {data.recipients && (
              <div className="space-y-2">
                <h3 className="font-semibold text-sm sm:text-base">
                  Recipients
                </h3>
                <div className="space-y-2">
                  {data.recipients.length > 0 ? (
                    data.recipients.map((recipient) => (
                      <div
                        key={recipient._id}
                        className="flex items-center gap-2 p-2 bg-muted rounded-lg"
                      >
                        <Avatar className="h-6 w-6 shrink-0 rounded-full ml-2">
                          {recipient.name?.charAt(0).toUpperCase()}
                        </Avatar>
                        <span className="text-base sm:text-sm truncate">
                          {recipient.name || recipient._id}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      No recipients yet
                    </p>
                  )}

                  <div className="flex items-center  py-2 gap-2">
                    <SearchUsers
                      title="Add Recipients"
                      onUserSelect={(userId) => onAddRecipient(userId)}
                      existingUsers={data.recipients.map((r) => r._id)}
                    />
                  </div>
                </div>
              </div>
            )}

            {data.contributors && (
              <div className="space-y-2">
                <h3 className="font-semibold text-sm sm:text-base">
                  Contributors
                </h3>
                <div className="space-y-2">
                  {data.contributors.length > 0 ? (
                    data.contributors.map((contributor) => (
                      <div
                        key={contributor._id}
                        className="flex items-center gap-2 p-2 bg-muted rounded-lg"
                      >
                        <Avatar className="h-6 w-6 shrink-0">
                          <span className="text-xs">
                            {contributor.name?.charAt(0)}
                          </span>
                        </Avatar>
                        <span className="text-xs sm:text-sm truncate">
                          {contributor.name || contributor._id}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      No contributors yet
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <div className="my-4 w-full">
        <Button
          className="w-full rounded-lg"
          onClick={() => setIsLockModalOpen(true)}
        >
          Lock Capsule
        </Button>

        <CapsuleLockModal
          capsuleId={data._id as string}
          isOpen={isLockModalOpen}
          onOpenChange={setIsLockModalOpen}
        />
      </div>
    </div>
  );
};
