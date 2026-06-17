import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "atharvajadhavlm10@gmail.com", // Replace with your email
    pass: "wotl syxw bsae theg", // Replace with your email password or app password
  },
});

export const sendConfirmationEmail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from: 'atharvajadhavlm10@gmail.com',
      to,
      subject,
      text,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log("Confirmation email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
