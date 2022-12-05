export function checker(
  target: any,
  name: string,
  descriptor: TypedPropertyDescriptor<any>
): any {
  const original = descriptor.value;
  if (typeof original === "function") {
    descriptor.value = function (...args: any[]) {
      const date = new Date().toLocaleString();
      try {
        const result = original(...args);
        return result;
      } catch (e) {
        console.log(e);
        // logger.error(e);
      }
    };
    return descriptor;
  }
}

export function asyncChecker(
  target: any,
  name: string,
  descriptor: TypedPropertyDescriptor<any>
): any {
  const original = descriptor.value;
  if (typeof original === "function") {
    descriptor.value = async function (...args: any[]) {
      const date = new Date().toLocaleString();
      try {
        const result = await original(...args);
        // logger.error(result);
        console.log("log: ", result);
        return result;
      } catch (e) {
        // 로거 남기기
      }
    };
    return descriptor;
  }
}

export function isDefined(value: any) {
  if (value === "" || value === undefined || value === null) {
    return false;
  }
  return true;
}
