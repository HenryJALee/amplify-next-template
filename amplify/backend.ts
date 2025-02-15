import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import  { notifyWinner } from './functions/notify-winner/resource';

const backend = defineBackend({
  auth,
  data,
  storage,
  notifyWinner
});

const { cfnIdentityPool } = backend.auth.resources.cfnResources;
cfnIdentityPool.allowUnauthenticatedIdentities = false;