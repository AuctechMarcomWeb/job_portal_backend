import nodemailer from "nodemailer";


export const sendEmailOTP = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", 
    auth: {
      user: process.env.SMTP_USER, 
      pass: process.env.SMTP_PASS, 
    },
  });

  const mailOptions = {
    from: `"Your App Name" <${process.env.SMTP_USER}>`,
    to,
    subject: "Your Login OTP",
    html: `
        <h2>OTP Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 5 minutes.</p>
      `,
  };

  await transporter.sendMail(mailOptions);
};



export default sendEmailOTP;