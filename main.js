// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

const effectStack = [];
const signal = (initValue)=>{
    const effects = new Set();
    let value = initValue;
    const getter = ()=>{
        const running = effectStack[0];
        running && effects.add(running);
        return value;
    };
    getter.effects = effects;
    const setter = (newValue)=>{
        if (newValue !== value) {
            value = newValue;
            [
                ...effects
            ]?.forEach((fn)=>fn?.());
        }
    };
    return [
        getter,
        setter
    ];
};
const reaction = (fn)=>{
    try {
        effectStack.push(fn);
        fn();
    } finally{
        effectStack.pop();
    }
};
const isNull = (value)=>{
    return value === undefined || value === null;
};
const nonNull = (value, fb = "")=>{
    return isNull(value) ? fb : value;
};
const getPrevElement = (arr, index)=>{
    return arr[index - 1];
};
const set = (map, key, value)=>{
    map.set(key, value);
    return true;
};
const typeOf = (value)=>{
    return typeof value;
};
const isFunction = (value)=>{
    return typeOf(value) === 'function';
};
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function customElement(name) {
    return function(target) {
        customElements.define(name, target);
    };
}
const eventAttr = `event-id`;
const templateAttr = `t-id`;
let HTMLTemplElement = class HTMLTemplElement1 extends HTMLElement {
    nestedTempls = new Map();
    handlers = new Map();
    constructor(){
        super();
    }
    setupReaction(fn) {
        const react = ()=>{
            const [templs, exprs] = fn();
            const template = templs.reduce((p, v, i)=>{
                const expr = nonNull(getPrevElement(exprs, i), "");
                const exprIndex = i - 1;
                switch(true){
                    case this.isTemplElement(expr):
                        return this.parseTemplElement(expr, exprIndex, p, v);
                    case isFunction(expr):
                        return this.parseEventhandlers(expr, exprIndex, p, v);
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
    isTemplElement(element) {
        return element instanceof HTMLTemplElement;
    }
    parseTemplElement(expr, id, prev, current) {
        set(this.nestedTempls, id, expr);
        return prev + `<template ${templateAttr}="${id}" ></template>` + current;
    }
    serializeTemplElements() {
        [
            ...this.nestedTempls
        ].forEach(([n, templ])=>{
            const placeholder = this.querySelector(`template[${templateAttr}="${n}"]`);
            placeholder?.replaceWith(templ);
        });
    }
    isPossibleEventhandler(expr, p) {
        const indexOfHandler = p.lastIndexOf(" on");
        if (!indexOfHandler) throw new Error(`Can't find an event in ${p} to place event handler ${expr}`);
        const eventType = p.slice(indexOfHandler).replace("on", "").replace(/="/g, "").replace(/=/g, "").replace(" ", "");
        return [
            indexOfHandler,
            eventType
        ];
    }
    parseEventhandlers(expr, exprIndex, p, v) {
        const [indexOfHandler, eventType] = this.isPossibleEventhandler(expr, p);
        p = p.slice(0, indexOfHandler), v = v.replace('"', "");
        set(this.handlers, exprIndex, {
            type: eventType,
            fn: expr
        });
        return p + `${eventAttr}="${exprIndex}"` + v;
    }
    serializeEventListeners() {
        [
            ...this.handlers
        ].forEach(([id, evh])=>{
            const elementWithEvent = this.querySelector(`[${eventAttr}="${id}"]`);
            elementWithEvent?.addEventListener(evh.type, evh.fn);
            elementWithEvent?.removeAttribute(`${eventAttr}`);
            this.handlers.delete(id);
        });
    }
};
HTMLTemplElement = _ts_decorate([
    customElement(`templ-ate`)
], HTMLTemplElement);
const html = (...string)=>{
    const [templs, exprs] = [
        string[0],
        string.splice(1)
    ];
    return [
        templs,
        exprs
    ];
};
const $component = (fn)=>{
    const template = document.createElement("templ-ate");
    template.setupReaction(fn);
    return template;
};
const render = (comp, root)=>{
    try {
        root?.append(comp());
        return true;
    } catch (error) {
        console.error(error);
    }
};
const [count, setCoont] = signal("flex");
const [accounts, setAccounts] = signal({
    JANE: 33
});
setTimeout(()=>{
    setAccounts({
        JANE: 55
    });
}, 2000);
const Child = ()=>{
    return $component(()=>html`
      <article class="${count()} flex-row bg-blue-1000">
        Jane has $${count()} in her account. She is ${accounts().JANE} years old
      </article>
    `);
};
const View = ()=>{
    function showCount() {
        setAccounts({
            JANE: 788888
        });
        setCoont("hidden");
    }
    return $component(()=>html`
      <section
        class="bg-blue-400"
        onclick="${showCount}">
        name ${Child()}
      </section>
    `);
};
render(()=>View(), document.body);
