import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import  { notifyWinner } from './functions/notify-winner/resource';
import * as iam from "aws-cdk-lib/aws-iam"
import * as ses from "aws-cdk-lib/aws-ses"

const backend = defineBackend({
  auth,
  data,
  storage,
  notifyWinner
});

const { cfnIdentityPool } = backend.auth.resources.cfnResources;
cfnIdentityPool.allowUnauthenticatedIdentities = false;

const notifyWinnerLambda = backend.notifyWinner.resources.lambda

const statement = new iam.PolicyStatement({
  sid: "AllowPublishToDigest",
  actions: ["ses:SendEmail", "ses:SendRawEmail"],
  resources: ["arn:aws:ses:us-east-1:209167615351:identity/*","arn:aws:ses:us-east-1:209167615351:identity/admin@thewonderverselabs.com"],
})

notifyWinnerLambda.addToRolePolicy(statement)

