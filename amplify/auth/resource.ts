import { defineAuth } from "@aws-amplify/backend";

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
       email: {
         // can be used in conjunction with a customized welcome email as well
         verificationEmailStyle: "CODE",
         verificationEmailSubject: "Welcome to my app!",
         verificationEmailBody: (createCode) => `Use this code to confirm your account: ${createCode()}`,
         userInvitation: {
           emailSubject: "Welcome to the Wonder Society!",
           emailBody: (user, code) =>
             `We're so excited to have you on board. You can now login to wonder-society.com to win merch, play games, and check out other ambassadors with username ${user()} and temporary password ${code()} Don't forget to update your profile!`, 
         },
       },
      },
    })
