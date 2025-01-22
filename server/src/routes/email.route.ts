import express from "express";
import EmailController from "../controllers/email.controller";

const router = express.Router();

router.post("/schedule-ndays-email", async (req, res) => {
  try {
    const { recipients, eventDate, eventName, nDaysBefore } = req.body;

    await EmailController.scheduleNDaysEmail(
      recipients,
      eventDate,
      eventName,
      nDaysBefore
    );
    res.status(200).json({ message: "Scheduled N-days email successfully." });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/send-congratulations", async (req, res) => {
  try {
    const { email, name, eventName } = req.body;

    await EmailController.sendCongratulationsEmail(email, name, eventName);
    res
      .status(200)
      .json({ message: "Sent congratulations email successfully." });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
