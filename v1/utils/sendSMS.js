const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phone = process.env.TWILIO_PHONE_NUMBER;

const client = require("twilio")(accountSid, authToken);

exports.sendSMS = async (res, to, message) => {
  try {
    // Send SMS
    const result = await client.messages.create({
      body: message,
      from: phone,
      to,
    });

    console.log("SMS sent:", result);
    res.status(200).json({ success: true, data: "SMS sent successfully" });
  } catch (error) {
    console.error("Error sending SMS:", error);
    res
      .status(500)
      .json({
        success: false,
        data: "Failed to send SMS! Please try again 🙂",
      });
  }
};
