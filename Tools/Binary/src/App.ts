import { elm } from "@amodx/elm";
import Reader from "./Reader/Reader";

export default function App() {
  return elm(
    "div",
    {
      id: "root",
    },
    Reader()
  );
}
