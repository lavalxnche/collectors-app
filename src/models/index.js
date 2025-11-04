// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Collection } = initSchema(schema);

export {
  Collection
};