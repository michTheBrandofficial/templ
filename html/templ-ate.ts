import { getPrevElement, isFunction, nonNull, set } from "./helpers.ts";
import { Primitive, reaction } from "./signal.ts";

export interface Template
  extends Readonly<{
    innerHTML: string;
    outerHTML: string;
  }> {}

export interface Template2 {}

function customElement(name: `${string}-${string}`): any {
  return function (target: any) {
    customElements.define(name, target);
  };
}

const eventAttr = `event-id`;
const templateAttr = `t-id`;

type EventHandler = {
  type: string;
  fn: CallableFunction;
};

@customElement(`templ-ate`)
export class HTMLTemplElement extends HTMLElement {
  private nestedTempls: Map<number, HTMLTemplElement> = new Map();

  private handlers: Map<number, EventHandler> = new Map();

  constructor() {
    super();
  }
  setupReaction(fn: () => Template) {
    const react = () => {
      const [templs, exprs] = fn() as unknown as [
        TemplateStringsArray,
        Array<Primitive | Template>
      ];
      const template = templs.reduce((p, v, i) => {
        const expr = nonNull(getPrevElement(exprs, i), "");
        const exprIndex = i - 1;
        switch (true) {
          case this.isTemplElement(expr):
            return this.parseTemplElement(expr, exprIndex, p, v);
          case isFunction(expr):
            return this.parseEventhandlers(expr, exprIndex, p, v)
          default:
            return p + expr + v;
        }
      });
      this.innerHTML = template;
      this.serializeTemplElements();
      this.serializeEventListeners();
    };
    reaction(react);
  }

  isTemplElement(element: any) {
    return element instanceof HTMLTemplElement;
  }

  parseTemplElement<T = string>(expr: any, id: number, prev: T, current: T) {
    set(this.nestedTempls, id, expr);
    return prev + `<template ${templateAttr}="${id}" ></template>` + current;
  }

  serializeTemplElements() {
    [...this.nestedTempls].forEach(([n, templ]) => {
      const placeholder = this.querySelector(`template[${templateAttr}="${n}"]`);
      placeholder?.replaceWith(templ);
    });
  }

  isPossibleEventhandler(expr: any, p: string) {
    const indexOfHandler = p.lastIndexOf(" on");
    if (!indexOfHandler)
      throw new Error(
        `Can't find an event in ${p} to place event handler ${expr}`
      );
    const eventType = p
      .slice(indexOfHandler)
      .replace("on", "")
      .replace(/="/g, "")
      .replace(/=/g, "")
      .replace(" ", "");
    return [indexOfHandler, eventType] as const;
  }

  parseEventhandlers(expr: any, exprIndex: number, p: string, v: string) {
    const [indexOfHandler, eventType] = this.isPossibleEventhandler(
      expr,
      p
    );
    (p = p.slice(0, indexOfHandler)), (v = v.replace('"', ""));
    set(this.handlers, exprIndex, {
      type: eventType,
      fn: expr,
    });
    return p + `${eventAttr}="${exprIndex}"` + v;
  }

  serializeEventListeners() {
    [...this.handlers].forEach(([id, evh]) => {
      const elementWithEvent = this.querySelector(`[${eventAttr}="${id}"]`);
      elementWithEvent?.addEventListener(evh.type, evh.fn as any);
      elementWithEvent?.removeAttribute(`${eventAttr}`);
      this.handlers.delete(id);
    });
  }
}

/**
 * Base class for the `templ-ate` custom element
 */
export interface HTMLTemplElement extends HTMLElement {
  setupReaction: (fn: () => Template) => void;
}

export {};
