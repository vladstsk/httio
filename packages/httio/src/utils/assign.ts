export default function assign<T, U>(target: T, source: U): T & U;
export default function assign<T, U, V>(target: T, source1: U, source2: V): T & U & V;
export default function assign<T, U, V, W>(target: T, source1: U, source2: V, source3: W): T & U & V & W;
export default function assign(target: object, ...source: object[]): object {
  return Object.assign(target, ...source);
}
