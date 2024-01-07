const effectStack: CallableFunction[] = [];

export type Primitive = string | bigint | number | boolean | undefined | null;

export type NonPrimitive = object | any[]

export const signal = <T extends Primitive | NonPrimitive>(initValue: T): [() => T, (newValue: T) => void] => {
  const effects: Set<CallableFunction> = new Set();
  let value = initValue;
  const getter = () => {
    const running = effectStack[0];
    running && effects.add(running);
    return value;
  }

  getter.effects = effects;

  const setter = (newValue: T) => {
    if (newValue !== value) {
      value = newValue;
      [...effects]?.forEach(fn => fn?.())
    }
  }
  return [getter, setter]
}

export const reaction = (fn: () => void) => {
  try {
    effectStack.push(fn)
    fn()
  } finally {
    effectStack.pop()
  }
}