import nodemailer from "nodemailer";

const sendEmail = async (guest, email, response) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Dynamic content based on response
  const dynamicContent =
    response === "accept"
      ? `<p style="font-size: 16px; color: #555; line-height: 1.5;">
          Thank you for your kind response! We are thrilled to hear that you will be celebrating our special day with us. 
          Your <strong style="color: #28a745;">acceptance</strong> brings us so much joy!
        </p>
        <p style="font-size: 16px; color: #555; line-height: 1.5;">
          We can't wait to share this beautiful day with you and make unforgettable memories together.
        </p>`
      : `<p style="font-size: 16px; color: #555; line-height: 1.5;">
          Thank you for letting us know. We’re sad that you won’t be able to join, but we truly appreciate your kind wishes. 
          Your <strong style="color: #dc3545;">decline</strong> has been recorded.
        </p>
        <p style="font-size: 16px; color: #555; line-height: 1.5;">
          We will miss your presence on our special day, but your warm thoughts mean a lot to us.
        </p>`;

  // Wedding-themed email HTML template
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Thank You for Your RSVP",
    html: `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #f2f2f2; border-radius: 12px; background-color: #fffbe6;">
        
        <h2 style="color: #a64ca6; text-align: center; font-size: 28px; margin-bottom: 10px;">Louie & Eliza's Wedding</h2>
        <p style="text-align: center; color: #555; font-size: 16px; margin-bottom: 30px;">A heartfelt thank you for your RSVP</p>
        
        <p style="font-size: 16px; color: #555; line-height: 1.5;">Dear <strong>${guest}</strong>,</p>
        
        ${dynamicContent}
        
        <div style="margin-top: 30px; text-align: center;">
          <p style="font-size: 16px; color: #555;">With love and joy,</p>
          <p style="font-size: 18px; color: #a64ca6; font-weight: bold;">Louie & Eliza</p>
        </div>

        <hr style="border: none; border-top: 1px solid #f2e6ff; margin: 40px 0;">
        <p style="font-size: 12px; color: #999; text-align: center;">
          This is an automated message from Louie & Eliza's Wedding RSVP system.
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
    return { success: false, error };
  }
};

export default sendEmail;
