/// <reference types="vite/client" />
import { Ref, UnwrapRef } from "vue";

declare global {
  // // ref
  // function ref<T extends object>(
  //   value: T
  // ): [T] extends [Ref] ? T : Ref<UnwrapRef<T>>;
  // function ref<T>(value: T): Ref<UnwrapRef<T>>;
  // function ref<T = any>(): Ref<T | undefined>;
  // // reactive
  // function reactive<T extends object>(target: T): UnwrapNestedRefs<T>;
  // // computed
  // function computed<T>(
  //   getter: ComputedGetter<T>,
  //   debugOptions?: DebuggerOptions
  // ): ComputedRef<T>;
  // function computed<T>(
  //   options: WritableComputedOptions<T>,
  //   debugOptions?: DebuggerOptions
  // ): WritableComputedRef<T>;
  // // watch
  // export declare function watch<
  //   T extends MultiWatchSources,
  //   Immediate extends Readonly<boolean> = false
  // >(
  //   sources: [...T],
  //   cb: WatchCallback<MapSources<T, false>, MapSources<T, Immediate>>,
  //   options?: WatchOptions<Immediate>
  // ): WatchStopHandle;
  // export declare function watch<
  //   T extends Readonly<MultiWatchSources>,
  //   Immediate extends Readonly<boolean> = false
  // >(
  //   source: T,
  //   cb: WatchCallback<MapSources<T, false>, MapSources<T, Immediate>>,
  //   options?: WatchOptions<Immediate>
  // ): WatchStopHandle;
  // export declare function watch<T, Immediate extends Readonly<boolean> = false>(
  //   source: WatchSource<T>,
  //   cb: WatchCallback<T, Immediate extends true ? T | undefined : T>,
  //   options?: WatchOptions<Immediate>
  // ): WatchStopHandle;
  // export declare function watch<
  //   T extends object,
  //   Immediate extends Readonly<boolean> = false
  // >(
  //   source: T,
  //   cb: WatchCallback<T, Immediate extends true ? T | undefined : T>,
  //   options?: WatchOptions<Immediate>
  // ): WatchStopHandle;
}

export {};
