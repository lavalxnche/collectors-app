import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'collectionPhotos',
  access: (allow: { authenticated: { to: (arg0: string[]) => any; }; }) => ({
    'pictures/*': [
      allow.authenticated.to(['read', 'write', 'delete'])
    ],
  }),
});


