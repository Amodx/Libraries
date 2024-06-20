import { CommPortTypes } from "./Thread.types"

export type ThreadPoolData = {
    name: string;
    onPortSet: (port: CommPortTypes, commName: string) => void;
  };