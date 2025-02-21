// amplify/functions/notify-winner/resource.ts
import { defineFunction } from '@aws-amplify/backend';

export const notifyWinner = defineFunction({
  // optionally specify a name for the Function (defaults to directory name)
  name: 'notify-winner',
  // optionally specify a path to your handler (defaults to "./handler.ts")
  entry: './handler.ts'
});