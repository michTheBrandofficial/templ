import { signal } from "./html/signal.ts";
import { $component, html, render } from "./html/templ.ts";
const [count, setCoont] = signal<"flex" | "hidden">("flex");
const [accounts, setAccounts] = signal({ JANE: 33 });

setTimeout(() => {
  setAccounts({ JANE: 55 });
}, 2000);

const Child = () => {
  return $component(
    () => html`
      <article class="${count()} flex-row bg-blue-1000">
        Jane has $${count()} in her account. She is ${accounts().JANE} years old
      </article>
    `
  );
};

const View = () => {
  function showCount() {
    setAccounts({ JANE: 788888 });
    setCoont("hidden");
  }

  return $component(
    () => html`
      <section
        class="bg-blue-400"
        onclick="${showCount}">
        name ${Child()}
      </section>
    `
  );
};

render(() => View(), document.body);
