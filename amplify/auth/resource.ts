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
             `We're happy to have you! You can now login with username ${user()} and temporary password ${code()}`, 
         },
       },
      },
    })
