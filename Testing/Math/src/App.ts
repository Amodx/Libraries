import { elm } from "@amodx/elm";

export default function App() {
  return elm(
    "div",
    {
      id: "root",
    },
    elm(
      "canvas",
      {
        id: "main-canvas",
      }
    )
  );
}
