import crypto from "crypto";

export function generateInvitationLink(capsuleId: string): string {
  const uniqueToken = crypto.randomBytes(16).toString("hex");
  const baseUrl = process.env.INVITATION_BASE_URL!;

  return `${baseUrl}?token=${uniqueToken}&capsuleId=${capsuleId}`;
}
