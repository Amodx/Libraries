import { NCS } from "../NCS";
import { NCSRegister } from "./NCSRegister";
import { ContextData, ContextRegisterData } from "../Contexts/ContextData";
import { NodeInstance } from "../Nodes/NodeInstance";
import { ContextInstance } from "../Contexts/ContextInstance";
import { ObjectSchemaInstance } from "@amodx/schemas";
import { ContextPrototype } from "../Contexts/ContextPrototype";

type RegisteredContext<
  ContextSchema extends {} = {},
  Data extends object = {}
> = (ContextRegisterData<ContextSchema, Data> & {
  set: (
    parent: NodeInstance,
    schema?: ContextSchema,
    data?: Data
  ) => ContextInstance<ContextSchema, Data>;
  get: (parent: NodeInstance) => ContextInstance<ContextSchema, Data> | null;
  getRequired: (parent: NodeInstance) => ContextInstance<ContextSchema, Data>;
  remove: (parent: NodeInstance) => ContextInstance<ContextSchema, Data> | null;

  prototype: ContextPrototype<ContextSchema, Data>;
  default: ContextInstance<ContextSchema,Data>;
  schemaController: ObjectSchemaInstance<ContextSchema>;
}) &
  (() => ContextData);

export function registerContext<
  ContextSchema extends {} = {},
  Data extends object = {}
>(
  data: ContextRegisterData<ContextSchema, Data>
): RegisteredContext<ContextSchema, Data> {
  const prototype = new ContextPrototype<ContextSchema, Data>(data);

  NCSRegister.contexts.register(data.type, data.namespace || "main", prototype);

  const createContext = (
    schema?: ContextSchema
  ): ContextData<ContextSchema> => {
    return NCS.Pipelines.OnContextDataCreate.pipe({
      type: data.type,
      schema: {
        ...structuredClone(prototype.baseContextSchema),
        ...(schema || ({} as any)),
      },
    }) as any;
  };

  return Object.assign(createContext, data, {
    prototype,
    set: (parent: NodeInstance, schema?: ContextSchema, data?: Data) => {
      const newContext = parent.context.add(createContext(schema));
      if (data) {
        newContext.data = data;
      }
      return newContext;
    },
    get: (parent: NodeInstance) => {
      return parent.context.get(data.type);
    },
    getRequired: (parent: NodeInstance) => {
      const found = parent.context.get(data.type);
      if (!found)
        throw new Error(`Could not find required context type: ${data.type}`);
      return found;
    },
    remove: (parent: NodeInstance) => {
      return parent.context.remove(data.type);
    },
  }) as any;
}
