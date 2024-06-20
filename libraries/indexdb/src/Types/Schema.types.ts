export type IndexDBSchemaNodeValueTypes =
 | "string"
 | "boolean"
 | "number"
 | "any"
 | "any[]"
 | "string[]"
 | "number[]"
 | "object";
export type IndexDBSchemaNode = {
 name: string;
 valueType : IndexDBSchemaNodeValueTypes;
 index ?: boolean;
 isUnique ?: boolean;
 children ?: IndexDBSchema;
};

export type IndexDBSchemaNodes = IndexDBSchemaNode | IndexDBSchemaNode[] | IndexDBSchema[];
export type IndexDBSchema = IndexDBSchemaNodes[];

