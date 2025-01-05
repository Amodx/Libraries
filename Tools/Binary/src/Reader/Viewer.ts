// Viewer.ts
import { elm, frag, useRef } from "@amodx/elm";
import { ReaderManager } from "./ReaderManager";

function ObjectViewer(obj: any): HTMLElement {
  if (typeof obj !== "object" || obj === null) {
    // Primitive value
    return elm("span", { className: "primitive" }, String(obj));
  } else if (Array.isArray(obj)) {
    // Array value
    const container = elm("div", { className: "array-container" });
    obj.forEach((item, index) => {
      container.append(
        elm(
          "div",
          { className: "array-item" },
          elm("span", { className: "array-index" }, `[${index}]: `),
          ObjectViewer(item)
        )
      );
    });
    return container;
  } else {
    // Object value, requires expansion
    let expanded = false;

    const container = elm("div", { className: "object-viewer" });

    const toggleButton = elm(
      "span",
      {
        className: "toggle-button",
        onclick: () => {
          expanded = !expanded;
          updateView();
        },
      },
      "[+]"
    );

    const objectHeader = elm("span", { className: "object-header" }, "{...}");
    const contentContainer = elm("div", { className: "content" });

    function updateView() {
      if (expanded) {
        toggleButton.innerText = "[-]";
        contentContainer.innerHTML = "";

        Object.entries(obj).forEach(([key, value]) => {
          contentContainer.append(
            elm(
              "div",
              { className: "object-property" },
              elm("span", { className: "property-key" }, `${key}: `),
              ObjectViewer(value)
            )
          );
        });
      } else {
        toggleButton.innerText = "[+]";
        contentContainer.innerHTML = "";
      }
    }

    updateView();

    container.append(toggleButton, objectHeader, contentContainer);
    return container;
  }
}

export default function Viewer() {
  const ref = useRef<HTMLDivElement>();

  ReaderManager.objectSet.subscribe(() => {
    ref.current!.innerHTML = "";
    ref.current!.appendChild(ObjectViewer(ReaderManager.object));
  });

  return elm("div", { className: "viewer", ref });
}
