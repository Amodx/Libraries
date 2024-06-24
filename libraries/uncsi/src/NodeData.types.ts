export interface NodeStateData {
  [key: string]: any;
}

export type NodeData = {
  id: string;
  name: string;
  state: NodeStateData;
  children: NodeData[];
  components: ComponentData[];
};
export type PrefabNodeData = {
  id: string;
  name: string;
  node: NodeData;
};
export interface ComponentStateData {
  [key: string]: any;
}
export type ComponentData<Properties extends object = any> = {
  type: string;
  state: ComponentStateData;
  properties: Properties;
  traits: TraitData[];
};
export interface TraitStateData {
  [key: string]: any;
}
export type TraitData<Properties extends object = any> = {
  type: string;
  state: TraitStateData;
  properties: Properties;
  traits: TraitData[];
};
