import ejs from "ejs";
import nodemailer from "nodemailer";
import transporter from "../config/mail";

// Utility function to send emails
export const sendEmail = async (
  to: string,
  subject: string,
  templatePath: string,
  templateData: Record<string, any>
): Promise<void> => {
  try {
    const html = await ejs.renderFile(templatePath, templateData);

    const mailOptions: nodemailer.SendMailOptions = {
      from: "ngenx2831@gmail.com",
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
