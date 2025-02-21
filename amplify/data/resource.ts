import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { notifyWinner } from "../functions/notify-winner/resource"


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
      profileImageKey: a.string()
    })
    .authorization((allow) => [allow.owner()]),
  
    Message: a
      .model({
        id: a.id(),
        sender: a.string(),
        content: a.string(),
        timestamp: a.string(),
        read: a.boolean()
      })
      .authorization((allow) => [allow.owner()]),

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
        userID: a.string()
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


/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
