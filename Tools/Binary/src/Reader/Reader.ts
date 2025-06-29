import { BinaryObject } from "@amodx/binary";
import "./Reader.css";
import { elm } from "@amodx/elm";
import { Compressor } from "@amodx/core/Compression/Compression";
import { ReaderManager } from "./ReaderManager";
import Viewer from "./Viewer";
export default function Reader() {
  let compressed = false;
  let fileBuffer: ArrayBufferLike;
  return elm(
    "div",
    {
      className: "reader",
    },
    elm("h1", {}, "Binary Object Reader"),
    elm(
      "div",
      "form-group",
      elm("label", "label", "Compresed"),
      elm("input", {
        className: "input",
        type: "checkbox",
        onchange(ev) {
          if ((ev.target as HTMLInputElement).checked) {
            compressed = true;
            return;
          }
          compressed = false;
        },
      })
    ),
    elm(
      "div",
      "form-group",
      elm("label", "label", "File"),
      elm("input", {
        className: "input",
        type: "file",
        onchange(ev) {
          const fileInput = ev.target as HTMLInputElement;
          const file = fileInput.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = () => {
              fileBuffer = reader.result as ArrayBuffer;
            };
            reader.readAsArrayBuffer(file);
          }
        },
      })
    ),
    elm(
      "button",
      {
        className: "read-file-button",
        async onclick(ev) {
          if (!fileBuffer) return alert("Must upload file");

          if (compressed) {
            fileBuffer = (
              await Compressor.core.decompressArrayBuffer(fileBuffer as any)
            ).buffer;
          }
          const binaryObject = BinaryObject.bufferToObject(fileBuffer);
          console.log("Loaded object:");
          console.log(binaryObject);
          ReaderManager.setObject(binaryObject);
        },
      },
      "Read File"
    ),
    Viewer()
  );
}
