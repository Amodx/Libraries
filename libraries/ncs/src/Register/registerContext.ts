import { NCSRegister } from "./NCSRegister";
import {
  ContextRegisterData,
  CreateContextData,
} from "../Contexts/Context.types";
import { NodeCursor } from "../Nodes/NodeCursor";
import { ContextCursor } from "../Contexts/ContextCursor";

type RegisteredContext<
  ContextSchema extends {} = {},
  Data extends object = {},
> = (ContextRegisterData<ContextSchema, Data> & {
  set: (
    parent: NodeCursor,
    schema?: ContextSchema,
    data?: Data
  ) => ContextCursor<ContextSchema, Data>;
  get: (parent: NodeCursor) => ContextCursor<ContextSchema, Data> | null;
  getRequired: (parent: NodeCursor) => ContextCursor<ContextSchema, Data>;
  remove: (parent: NodeCursor) => ContextCursor<ContextSchema, Data> | null;

  data: ContextRegisterData<ContextSchema, Data>;
  default: ContextCursor<ContextSchema, Data>;
}) &
  ((
    schema?: ContextSchema,
    schemaViewId?: string,
    data?: Data
  ) => CreateContextData);

export function registerContext<
  ContextSchema extends {} = {},
  Data extends object = {},
>(
  data: ContextRegisterData<ContextSchema, Data>
): RegisteredContext<ContextSchema, Data> {
  NCSRegister.contexts.register(data.type, data);

  const createContext = (
    schema?: ContextSchema,
    schemaViewId?: string,
    data?: any
  ): CreateContextData<ContextSchema> => {
    return [data.type, schema || ({} as any), schemaViewId || "default", data];
  };

  return Object.assign(createContext, data, {
    data,
    set: (parent: NodeCursor, schema?: ContextSchema, data?: Data) => {
      const newContext = parent.context.add(createContext(schema));
      if (data) {
        //  newContext.data = data;
      }
      return newContext;
    },
    get: (parent: NodeCursor) => {
      return parent.context.get(data.type);
    },
    getRequired: (parent: NodeCursor) => {
      const found = parent.context.get(data.type);
      if (!found)
        throw new Error(`Could not find required context type: ${data.type}`);
      return found;
    },
    remove: (parent: NodeCursor) => {
      return parent.context.remove(data.type);
    },
  }) as any;
}
