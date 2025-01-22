import schedule from "node-schedule";
import { sendEmail } from "./email";
interface Recipient {
  name: string;
  email: string;
}

// Function to schedule N-days remaining emails
export const scheduleDaysRemainingEmails = (
  recipients: Recipient[],
  eventDate: string,
  eventName: string,
  nDaysBefore: number
): void => {
  const now = new Date();
  const targetDate = new Date(eventDate);
  targetDate.setDate(targetDate.getDate() - nDaysBefore);

  if (targetDate <= now) {
    console.log("Target date is in the past. Cannot schedule.");
    return;
  }

  schedule.scheduleJob(targetDate, () => {
    recipients.forEach((recipient) => {
      sendEmail(
        recipient.email,
        "Reminder: Event is coming soon!",
        "./templates/days_remaining.ejs",
        { name: recipient.name, days: nDaysBefore, event: eventName }
      );
    });
  });

  console.log(
    `Emails scheduled for ${nDaysBefore} days before ${eventName} on ${targetDate}.`
  );
};
