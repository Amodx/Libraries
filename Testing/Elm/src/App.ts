import { elm } from "@amodx/elm";

export default function App() {
  return elm(
    "div",
    "#root .test.cool role=region",
    elm("h1",undefined, "NCS Testing")
  );
}
