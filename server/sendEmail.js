import nodemailer from "nodemailer";

const sendEmail = async (guest, email, response) => {
  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    // host: "SMTP.ethereal.email",
    // port: 587,
    // secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Define dynamic content based on response
  const dynamicContent =
    response === "accept"
      ? `
    <p style="font-size: 16px; color: #555;">
      We appreciate you taking the time to respond to our invitation. We have received your <strong>acceptance</strong> response, and we're excited to have you be a part of our event!
    </p>
    <div style="text-align: center; margin: 20px 0;">
      <p style="font-size: 16px; color: #555;">We look forward to celebrating with you!</p>
    </div>
  `
      : `
    <p style="font-size: 16px; color: #555;">
      We appreciate you taking the time to respond to our invitation. We have received your <strong>decline</strong> response, we’ll miss you on our special day, but we appreciate your well wishes!
    </p>
    
  `;

  // Email options
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Thank You for Your Response",
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
          <h2 style="color: #333; text-align: center;">Thank You for Your Response!</h2>
          <p style="font-size: 16px; color: #555;">Dear <strong>${guest}</strong>,</p>
          ${dynamicContent}
          <p style="font-size: 14px; color: #777; text-align: center;">
            Best regards,<br>AeronJake&Mel
          </p>
        </div>
      `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Export function
export default sendEmail;
