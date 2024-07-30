import { NCS } from "../NCS";
import { NCSRegister } from "../Register/NCSRegister";
import { ContextData, ContextRegisterData } from "../Contexts/ContextData";
import { NodeInstance } from "../Nodes/NodeInstance";
import { ContextInstance } from "../Contexts/ContextInstance";

type RegisteredContext<Data extends object = {}> =
  (ContextRegisterData<Data> & {
    set: (parent: NodeInstance, data?: Data) => Promise<void>;
    get: (parent: NodeInstance) => ContextInstance<Data> | null;
    getRequired: (parent: NodeInstance) => ContextInstance<Data>;
    remove: (parent: NodeInstance) => Promise<ContextInstance<Data> | null>;

    default: ContextInstance<Data>;
  }) &
    (() => ContextData);

export function registerContext<Data extends object = {}>(
  data: ContextRegisterData<Data>
): RegisteredContext<Data> {
  NCSRegister._context.set(data.type, data as any);

  const createContext = (): ContextData => {
    return NCS.Pipelines.OnContextDataCreate.pipe({
      type: data.type,
    });
  };

  return Object.assign(createContext, data, {
    set: (parent: NodeInstance, data: Data) => {
      const newContext = parent.context.add(createContext());
      if (data) {
        newContext.data = data;
      }
    },
    get: (parent: NodeInstance) => {
      return parent.context.get(data.type);
    },
    getRequired: (parent: NodeInstance) => {
      const found = parent.context.get(data.type);
      if (!found)
        throw new Error(`Could not find required context  type: ${data.type}`);
      return found;
    },
    reove: (parent: NodeInstance) => {
      return parent.context.remove(data.type);
    },
  }) as any;
}
