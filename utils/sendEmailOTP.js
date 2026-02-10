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
    from: `"Wazifaesadat-Job" <${process.env.SMTP_USER}>`,
    to,
    subject: "Your Login OTP – Wazifaesadat Job",
    html: `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>OTP Verification</title>
  </head>
  
  <body style="margin:0; padding:0; background-color:#f3f2f1; font-family: Arial, Helvetica, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:30px 10px;">
          
          <!-- CONTAINER -->
          <table width="600" cellpadding="0" cellspacing="0"
                 style="background:#ffffff; border-radius:8px; overflow:hidden;">
  
            <!-- HEADER -->
            <tr>
              <td style="padding:20px 30px; border-bottom:1px solid #e4e2e0;">
                <h2 style="margin:0; color:#2557a7;">
                  Wazifaesadat Job
                </h2>
              </td>
            </tr>
  
            <!-- BODY -->
            <tr>
              <td style="padding:30px;">
                
                <p style="font-size:16px; color:#2d2d2d;">
                  Hello,
                </p>
  
                <p style="font-size:16px; color:#2d2d2d;">
                  Use the following One-Time Password (OTP) to complete your login:
                </p>
  
                <!-- OTP BOX -->
                <div style="margin:25px 0; text-align:center;">
                  <span style="
                    display:inline-block;
                    font-size:32px;
                    letter-spacing:6px;
                    font-weight:bold;
                    color:#2d2d2d;
                    background:#f3f2f1;
                    padding:15px 25px;
                    border-radius:6px;
                  ">
                    ${otp}
                  </span>
                </div>
  
                <p style="font-size:14px; color:#4b4b4b;">
                  This OTP is valid for <strong>5 minutes</strong>.  
                  Please do not share it with anyone.
                </p>
  
                <p style="font-size:14px; color:#4b4b4b;">
                  If you didn’t request this, you can safely ignore this email.
                </p>
  
              </td>
            </tr>
  
            <!-- FOOTER -->
            <tr>
              <td style="padding:20px 30px; background:#faf9f8; font-size:12px; color:#6f6f6f;">
                <p style="margin:0;">
                  © ${new Date().getFullYear()} Wazifaesadat Job. All rights reserved.
                </p>
              </td>
            </tr>
  
          </table>
  
        </td>
      </tr>
    </table>
  </body>
  </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};



export default sendEmailOTP;