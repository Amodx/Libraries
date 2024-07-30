//import { Approutes } from "Routes";
import { createRoot } from "react-dom/client";
import "./core.css";
import { App } from "App";
import { elm, useSignal } from "@amodx/elm";

const signal = useSignal(0);

console.log(signal.compose);
setInterval(() => {
  console.log("interval", signal.value);
  signal.value++;
}, 100);

document.body.append(
  elm(
    "div",
    {},
    elm("img", {
      signal: signal((elm) => (elm.innerText = String(signal.value))),
    })
  )
);

/* const root = createRoot(document.getElementById("root")!);
document.getElementById("root")!.classList.add("bp5-dark");

const C = () => {
  const [count, setCount] = React.useState(0);

  return (
    <div>
      <p>Count: {count} </p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      {count > 5 && <C />}
    </div>
  );
};

root.render(
  <>
    < C />
  </>
);
 */
