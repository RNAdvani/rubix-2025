import { sendEmail } from "../services/email";
import { scheduleDaysRemainingEmails } from "../services/scheduleService";

interface Recipient {
  name: string;
  email: string;
}

class EmailController {
  /**
   * Schedule "N days remaining" emails for an event.
   * @param recipients List of recipients.
   * @param eventDate Event date in ISO format.
   * @param eventName Name of the event.
   * @param nDaysBefore Number of days before the event to send the email.
   */
  static async scheduleNDaysEmail(
    recipients: Recipient[],
    eventDate: string,
    eventName: string,
    nDaysBefore: number
  ): Promise<void> {
    scheduleDaysRemainingEmails(recipients, eventDate, eventName, nDaysBefore);
  }

  /**
   * Send a congratulatory email.
   * @param recipientEmail Recipient's email address.
   * @param name Recipient's name.
   * @param eventName Name of the event.
   */
  static async sendCongratulationsEmail(
    recipientEmail: string,
    name: string,
    eventName: string
  ): Promise<void> {
    sendEmail(
      recipientEmail,
      "Congratulations!",
      "./templates/congratulations.ejs",
      { name, event: eventName }
    );
  }

  /**
   * Send a surprise email.
   * @param recipientEmail Recipient's email address.
   * @param name Recipient's name.
   */
  static async sendSurpriseEmail(
    recipientEmail: string,
    name: string
  ): Promise<void> {
    sendEmail(
      recipientEmail,
      "A Special Surprise!",
      "./templates/surprise.ejs",
      { name }
    );
  }
}

export default EmailController;
