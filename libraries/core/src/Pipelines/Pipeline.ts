type PipelineFunction<T> = (data: T) => T | Promise<T>;
export type PipelineKeys = Object | string | Symbol | Function;

export class Pipeline<T extends any = {}> {
  private pipeMap = new Map<PipelineKeys, PipelineFunction<T>>();
  private pipes: PipelineFunction<T>[] = [];
  constructor() {}

  isRegistered(key: PipelineKeys) {
    return this.pipeMap.has(key);
  }

  regiser(func: PipelineFunction<T>): void;
  regiser(key: PipelineKeys, func: PipelineFunction<T>): void;
  regiser(key: PipelineKeys | PipelineFunction<T>, func?: PipelineFunction<T>) {
    if (typeof key === "function" && func === undefined) {
      this.pipeMap.set(key, key as PipelineFunction<T>);
      this.pipes.push(key as PipelineFunction<T>);
    } else if (func !== undefined) {
      this.pipeMap.set(key, func);
      this.pipes.push(func);
    } else {
      throw new Error("Invalid arguments for regiser method");
    }
  }

  unRegister(key: PipelineKeys) {
    const func = this.pipeMap.get(key);
    if (!func) return false;
    this.pipeMap.delete(key);
    for (let i = 0; i < this.pipes.length; i++) {
      if (this.pipes[i] == func) {
        this.pipes.splice(i,1);
      }
    }
  }

  pipe(data: T) {
    for (let i = 0; i < this.pipes.length; i++) {
      data = this.pipes[i](data) as T;
    }
    return data;
  }

  async pipeAsync(data: T) {
    for (let i = 0; i < this.pipes.length; i++) {
      data = (await this.pipes[i](data)) as T;
    }
    return data;
  }
}
