import express from "express";
import morgan from "morgan";
import { connectDb } from "./lib/db";
import emailRoutes from "./routes/email.route";

const app = express();

// connectDb();
app.use(express.json());
app.use(morgan("dev"));

app.use("/email", emailRoutes);

// interface Recipient {
//   name: string;
//   email: string;
// }
// // Example recipients
// const recipients: Recipient[] = [
//   { name: "Sahil Gurnani", email: "gurnanisahil87@gmail.com" },
//   { name: "Jane Smith", email: "jane.smith@example.com" },
// ];

// const eventDate = "2025-02-01T00:00:00";
// const eventName = "Hackathon 2025";
// const nDaysBefore = 5;

// // Schedule the N-days remaining email
// scheduleDaysRemainingEmails(recipients, eventDate, eventName, nDaysBefore);

// // Send other emails manually
// sendEmail(
//   "ritojnanm@gmail.com",
//   "Congratulations!",
//   "./templates/congratulations.ejs",
//   { name: "User", event: eventName }
// );

// sendEmail(
//   "user@example.com",
//   "A Special Surprise!",
//   "./templates/surprise.ejs",
//   { name: "User" }
// );

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
