import { defineAuth } from '@aws-amplify/backend';
import { a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  User: a.model({
    id: a.id(),
    username: a.string(),
    bio: a.string(),
    avatarUrl: a.string(),
    collections: a.hasMany('Collection', 'owner')
  }),

  Collection: a.model({
    id: a.id(),
    title: a.string(),
    description: a.string(),
    imageUrl: a.string(),
    owner: a.belongsTo('User', 'collections'),
    createdAt: a.datetime()
  })
});

export const data = defineData({
  schema,
});

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
});
