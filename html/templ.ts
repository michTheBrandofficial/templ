import { Primitive } from "./signal.ts";
import "./templ-ate.ts";
import { HTMLTemplElement, Template2 } from "./templ-ate.ts";

export const html = (
  ...string: Array<
    TemplateStringsArray | Primitive | Template2 | CallableFunction
  >
) => {
  const [templs, exprs] = [string[0], string.splice(1)];
  return [templs, exprs] as unknown as Template2;
};

export const $component = (fn: () => Template2): Template2 => {
  const template = document.createElement(
    "templ-ate"
  ) as unknown as HTMLTemplElement;
  template.setupReaction(fn as any);
  return template;
};

export const render = (comp: () => Template2, root: Element | null) => {
  try {
    root?.append(comp() as any);
    return true;
  } catch (error) {
    console.error(error);
  }
};
