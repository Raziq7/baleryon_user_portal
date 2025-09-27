// import AWS from 'aws-sdk';
// import sanitizedConfig from '../config.js';

// // Initialize SES service object
// const ses = new AWS.SES({ region: sanitizedConfig.AWS_REGION});

// // Send an email function
// export const sendEmail = async (to, subject, body) => {
//   const params = {
//     Destination: {
//       ToAddresses: [to], // To email address
//     },
//     Message: {
//       Body: {
//         Text: { Data: body }, // Text email body
//       },
//       Subject: { Data: subject }, // Email subject
//     },
//     Source: 'admin@baleryon.in', // The "From" email address (must be verified in SES)
//   };

//   try {
//     const result = await ses.sendEmail(params).promise();
//     console.log('Email sent successfully:', result);
//     return result;
//   } catch (error) {
//     console.log('Error sending email:', error);
//     throw error;
//   }
// };


import postmark from 'postmark';
import sanitizedConfig from '../config.js';

// Initialize Postmark client
const client = new postmark.ServerClient(sanitizedConfig.POSTMARK_API_TOKEN);

// Send an email function
export const sendEmail = async (to, subject, body) => {
  const params = {
    From: 'support@baleryon.in',  // Must be a verified sender domain in Postmark
    To: to,                        // Recipient's email address
    Subject: subject,
    TextBody: body,               // Plain text body of the email
  };

  try {
    const result = await client.sendEmail(params);
    console.log('Email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Error sending email via Postmark:', error.message);
    throw error;
  }
};
