import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";





type EagerCollection = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Collection, 'id'>;
    readOnlyFields: 'updatedAt';
  };
  readonly id: string;
  readonly title: string;
  readonly description?: string | null;
  readonly imageUrl?: string | null;
  readonly createdAt?: string | null;
  readonly owner?: string | null;
  readonly updatedAt?: string | null;
}

type LazyCollection = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Collection, 'id'>;
    readOnlyFields: 'updatedAt';
  };
  readonly id: string;
  readonly title: string;
  readonly description?: string | null;
  readonly imageUrl?: string | null;
  readonly createdAt?: string | null;
  readonly owner?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Collection = LazyLoading extends LazyLoadingDisabled ? EagerCollection : LazyCollection

export declare const Collection: (new (init: ModelInit<Collection>) => Collection) & {
  copyOf(source: Collection, mutator: (draft: MutableModel<Collection>) => MutableModel<Collection> | void): Collection;
}