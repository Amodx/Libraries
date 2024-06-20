type SyncPipelineFunction<T> = (data: T) => T;
type AsyncPipelineFunction<T> = (data: T) => Promise<T> | T;
export type PipelineKeys = Object | string | Symbol | Function;

export class Pipeline<T extends any = {}> {
  private pipes = new Map<PipelineKeys, SyncPipelineFunction<T>>();

  constructor() {}

  isRegistered(key: PipelineKeys) {
    return this.pipes.has(key);
  }

  regiser(func: SyncPipelineFunction<T>): void;
  regiser(key: PipelineKeys, func: SyncPipelineFunction<T>): void;
  regiser(
    key: PipelineKeys | SyncPipelineFunction<T>,
    func?: SyncPipelineFunction<T>
  ) {
    if (typeof key === "function" && func === undefined) {
      this.pipes.set(key, key as SyncPipelineFunction<T>);
    } else if (func !== undefined) {
      this.pipes.set(key, func);
    } else {
      throw new Error("Invalid arguments for regiser method");
    }
  }

  unRegister(key: PipelineKeys) {
    this.pipes.delete(key);
  }

  pipe(data: T) {
    for (const [key, pipe] of this.pipes) {
      data = pipe(data);
    }
    return data;
  }
}
export class AsyncPipeline<T extends any = {}> {
  private pipes = new Map<PipelineKeys, AsyncPipelineFunction<T>>();

  constructor() {}

  isRegistered(key: PipelineKeys) {
    return this.pipes.has(key);
  }

  regiser(key: PipelineKeys, func: AsyncPipelineFunction<T>) {
    this.pipes.set(key, func);
  }

  unRegister(key: PipelineKeys) {
    this.pipes.delete(key);
  }

  async pipe(data: T) {
    for (const [key, pipe] of this.pipes) {
      data = await pipe(data);
    }
    return data;
  }
}
