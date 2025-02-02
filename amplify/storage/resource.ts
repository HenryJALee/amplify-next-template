import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'profile-pictures',
  access: (allow) => ({
    'pictures/*': [allow.authenticated.to(['read', 'write', 'delete'])],
    'public/*': [allow.authenticated.to(['read', 'write', 'delete'])],
    'profile-pictures/*': [allow.authenticated.to(['read', 'write', 'delete'])]
  })
});