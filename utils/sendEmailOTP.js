import nodemailer from "nodemailer";

const sendEmailOTP = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true, // true for 465, false for 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Job Portal" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your Login OTP",
      html: `
        <h2>OTP Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 5 minutes.</p>
      `,
    });

    console.log("OTP email sent to:", email);
  } catch (error) {
    console.error("Email OTP error:", error);
    throw new Error("Failed to send OTP email");
  }
};

export default sendEmailOTP;