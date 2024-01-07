export const isNull = (value: any) => {
  return value === undefined || value === null;
};

export const nonNull = (value: any, fb: any = "") => {
  return isNull(value) ? fb : value;
};

export const getPrevElement = <T extends any[]>(arr: T, index: number) => {
  return arr[index - 1] as T[number]
}

export const has = <K>(map: Map<K, any>, key: K) => {
  return map.has(key)
}

export const set = <K, V, M extends Map<K, V>>(map: M,  key: K, value: V) => {
  map.set(key, value)
  return true;
}

export const typeOf = (value: any) => {
  return typeof value;
}

export const isFunction = (value: any) => {
  return typeOf(value) === 'function'
}
