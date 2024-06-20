import { IndexDBSchema } from "./Schema.types.js";
export type IndexDBObjectStoreData = {
 name: string;
 schema: IndexDBSchema;
};
export type IndexDBDatabaseCreationData = {
 databaseName: string;
 objectStores: IndexDBObjectStoreData[];
};

export type IndexDBDatabaseLayout = IndexDBDatabaseCreationData[];
