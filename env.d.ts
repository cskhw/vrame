/// <reference types="vite/client" />
import { Ref, UnwrapRef } from "vue";

declare global {
  // ref
  function ref<T extends object>(
    value: T
  ): [T] extends [Ref] ? T : Ref<UnwrapRef<T>>;
  function ref<T>(value: T): Ref<UnwrapRef<T>>;
  function ref<T = any>(): Ref<T | undefined>;

  // reactive
  function reactive<T extends object>(target: T): UnwrapNestedRefs<T>;

  // computed
  function computed<T>(
    getter: ComputedGetter<T>,
    debugOptions?: DebuggerOptions
  ): ComputedRef<T>;

  function computed<T>(
    options: WritableComputedOptions<T>,
    debugOptions?: DebuggerOptions
  ): WritableComputedRef<T>;
}

// Env
interface ImportMetaEnv {
  VITE_MODE: string;
  VITE_PREFIX_URL: string;
  VITE_SUBFIX_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export {};
