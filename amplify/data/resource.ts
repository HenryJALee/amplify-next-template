import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { notifyWinner } from "../functions/notify-winner/resource"
import { use } from "react";
import { UserPoolIdentityProvider } from "aws-cdk-lib/aws-cognito";


/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/

const schema = a.schema({    
  User: a
    .model({
      cognitoId: a.string().required(), // Add this to link to Cognito user
      username: a.string(),  // Make this optional
      firstName: a.string(),
      lastName: a.string(),
      streetAddress: a.string(),
      city: a.string(),
      state: a.string(),
      zipCode: a.string(),
      country: a.string(),
      profileImageKey: a.string(),
      points: a.integer()
    })
    .authorization((allow) => [allow.authenticated()]),
  
    Message: a
      .model({
        id: a.id(),
        sender: a.string(),
        content: a.string(),
        timestamp: a.string(),
        read: a.boolean()
      })
      .authorization((allow) => [allow.authenticated()]),

    CommunityPost: a.model({
        id: a.id(),
        creator: a.string(),
        mediaType: a.enum(['video']),
        mediaUrl: a.string(),
        mediaKey: a.string(),
        caption: a.string(),
        likes: a.integer(),
        points: a.integer(),
        createdAt: a.string(),
        userID: a.string(),
        sortOrder: a.float(),
    }).authorization((allow) => [allow.authenticated()])
      .secondaryIndexes((index) => [
        index("mediaType")
          .sortKeys(["sortOrder"])
      ]),
    
    Challenges: a.model({
      id: a.id(),
      userId: a.string(),
      username: a.string(),
      challengeType: a.string(),  // 'tiktok' or 'insta'
      challengeInfo: a.string(),
      challengeDate: a.string(),
      pointsGiven: a.integer(),
    }).authorization((allow) => [allow.authenticated()]),

    PrizeRecord:  a.model({
      id: a.id(),
      weekId: a.string(),  // Format: '2024-W1', '2024-W2', etc.
      winningTime: a.string(),
      userId: a.string()
    }).authorization((allow) => [allow.authenticated()]),

    notifyWinQuery: a
    .query()
    .arguments({
      userName: a.string(),
    })
    .returns(a.string())
    .handler(a.handler.function(notifyWinner))
    .authorization((allow) => [allow.authenticated()])
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});


