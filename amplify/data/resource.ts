import { ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  User: a.model({
    // id: a.id(),
    username: a.string(),
    bio: a.string(),
    avatarUrl: a.string(),
    collections: a.hasMany("Collection", "ownerId"),
  }),
  Collection: a.model({
    // id: a.id(),
    title: a.string(),
    description: a.string(),
    imageUrl: a.string(),
    ownerId: a.id(),
    owner: a.belongsTo("User", "ownerId"),
    createdAt: a.datetime(),
  }),
}).authorization((allow) => allow.publicApiKey());

// Used for code completion / highlighting when making requests from frontend
export type Schema = ClientSchema<typeof schema>;

// defines the data resource to be deployed
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: { expiresInDays: 30 }
  }
});
// redeploy trigger
