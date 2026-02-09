
export const applicationAppliedTemplate = ({
  candidateName,
  jobTitle,
  companyName,
  location,
}) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Application Submitted</title>
</head>

<body style="margin:0; padding:0; background-color:#f3f2f1; font-family: Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:30px 10px;">
        
        <!-- MAIN CONTAINER -->
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
          
          <!-- HEADER -->
          <tr>
            <td style="padding:20px 30px; border-bottom:1px solid #e4e2e0;">
              <img src="https://res.cloudinary.com/dg5fbnhzq/image/upload/v1770625528/jhvl5ndmyykcplyswga5.jpg"
                   alt="Job Portal"
                   height="30"
                   style="display:block;" />
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:30px;">
              
              <!-- STATUS -->
              <p style="color:#2557a7; font-size:14px; font-weight:bold; margin:0 0 10px;">
                ✔ Application submitted
              </p>

              <!-- JOB TITLE -->
              <h1 style="font-size:26px; color:#2d2d2d; margin:5px 0;">
                ${jobTitle}
              </h1>

              <!-- COMPANY + LOCATION -->
              <p style="font-size:16px; color:#4b4b4b; margin:5px 0 20px;">
                <strong>${companyName}</strong> – ${location}
              </p>

              <hr style="border:none; border-top:1px solid #e4e2e0; margin:20px 0;" />

              <!-- ITEMS SENT -->
              <p style="font-size:15px; color:#2d2d2d; margin-bottom:8px;">
                The following items were sent to <strong>${companyName}</strong>. Good luck!
              </p>

              <ul style="padding-left:18px; margin:0 0 20px; color:#2d2d2d;">
                <li>Application</li>
                <li>Resume</li>
              </ul>

              <hr style="border:none; border-top:1px solid #e4e2e0; margin:20px 0;" />

              <!-- NEXT STEPS -->
              <h3 style="font-size:18px; color:#2d2d2d; margin-bottom:10px;">
                Next steps
              </h3>

              <p style="font-size:15px; color:#4b4b4b;">
                The employer or job advertiser may reach out to you about your application.
              </p>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:20px 30px; background:#faf9f8; font-size:12px; color:#6f6f6f;">
              <p style="margin:0;">
                You’re receiving this email because you applied for a job on Job Portal.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
`;

export const applicationStatusTemplate = ({
  name,
  jobTitle,
  status,
}) => `
  <h2>Application Status Update</h2>
  <p>Hello ${name},</p>
  <p>Your application for <b>${jobTitle}</b> is now:</p>
  <h3>${status}</h3>
  <br/>
  <p>– Job Portal Team</p>
`;

export const newApplicationRecruiterTemplate = ({
  recruiterName,
  jobTitle,
  companyName,
  applicantName,
  location,
}) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Application Received</title>
</head>

<body style="margin:0; padding:0; background-color:#f3f2f1; font-family: Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:30px 10px;">
        
        <!-- MAIN CONTAINER -->
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
          
          <!-- HEADER -->
          <tr>
            <td style="padding:20px 30px; border-bottom:1px solid #e4e2e0;">
              <img src="https://res.cloudinary.com/dg5fbnhzq/image/upload/v1770625528/jhvl5ndmyykcplyswga5.jpg"
                   alt="Job Portal"
                   height="30"
                   style="display:block;" />
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:30px;">
              
              <!-- STATUS -->
              <p style="color:#2557a7; font-size:14px; font-weight:bold; margin:0 0 10px;">
                ✔ New application received
              </p>

              <!-- JOB TITLE -->
              <h1 style="font-size:26px; color:#2d2d2d; margin:5px 0;">
                ${jobTitle}
              </h1>

              <!-- COMPANY + LOCATION -->
              <p style="font-size:16px; color:#4b4b4b; margin:5px 0 20px;">
                <strong>${companyName}</strong> – ${location}
              </p>

              <hr style="border:none; border-top:1px solid #e4e2e0; margin:20px 0;" />

              <!-- MESSAGE -->
              <p style="font-size:15px; color:#2d2d2d;">
                Hello <strong>${recruiterName}</strong>,
              </p>

              <p style="font-size:15px; color:#2d2d2d;">
                <strong>${applicantName}</strong> has applied for your job.
              </p>

              <p style="font-size:15px; color:#2d2d2d;">
                Please log in to your dashboard to review the application.
              </p>

              <!-- CTA BUTTON -->
              <div style="margin-top:25px;">
                <a href="#"
                   style="background:#2557a7; color:#ffffff; padding:12px 20px;
                          text-decoration:none; border-radius:4px; font-size:14px;
                          display:inline-block;">
                  View Application
                </a>
              </div>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:20px 30px; background:#faf9f8; font-size:12px; color:#6f6f6f;">
              <p style="margin:0;">
                You’re receiving this email because you posted a job on Job Portal.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
`;