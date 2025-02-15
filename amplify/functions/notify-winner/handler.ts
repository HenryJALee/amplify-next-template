// amplify/functions/notify-winner/handler.ts
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const ses = new SESClient({ region: 'us-east-1' }); // or your preferred region

export const handler = async (event: any) => {
  try {
    const { userId, prize } = JSON.parse(event.body);

    // Send email using SES
    const params = {
      Destination: {
        ToAddresses: ['admin@yourdomain.com'], // Replace with your email
      },
      Message: {
        Body: {
          Text: {
            Data: `New winner: User ${userId} has won a Pink Crop Top`,
          },
        },
        Subject: {
          Data: 'New Wonder Wheel Winner!',
        },
      },
      Source: 'from@yourdomain.com', // Replace with your verified SES email
    };

    await ses.send(new SendEmailCommand(params));

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        message: `Successfully notified about winner ${userId}`
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ error: 'Failed to process winner notification' })
    };
  }
};