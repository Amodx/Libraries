import "./index.css";
import "@amodx-elms/flow";
import { FlowNodeRegister } from "@amodx-elms/flow/FlowNodeRegister";
import { FlowGraph } from "@amodx/flow/Graph/FlowGraph";

const nodeRegister = new FlowNodeRegister();

nodeRegister.registerNode({
  type: "BODY_TEST",
  renderBody(container, parent) {
    const text = document.createElement("p");
    text.innerText = "BODY CONTENT";
    const button = document.createElement("button");
    button.innerText = "Press Me";
    button.onclick = () => alert("clicked");
    container.append(text, button);
  },
});

nodeRegister.registerNodeIO({
  type: "number",
  color: "red",
});

const graphEditor = document.createElement("flow-graph");
graphEditor.flowNodeRegister = nodeRegister;
graphEditor.addEventListener("graph-clicked", (event) => {
  console.log("GRAPH EVENT:", event.type, event.data);
});
graphEditor.addEventListener("node-added", (event) => {
  console.log("GRAPH EVENT:", event.type, event.data);
});
graphEditor.addEventListener("node-clicked", (event) => {
  console.log("GRAPH EVENT:", event.type, event.data);
});
graphEditor.addEventListener("node-deleted", (event) => {
  console.log("GRAPH EVENT:", event.type, event.data);
});
graphEditor.addEventListener("connection-added", (event) => {
  console.log("GRAPH EVENT:", event.type, event.data);
});
graphEditor.addEventListener("connection-clicked", (event) => {
  console.log("GRAPH EVENT:", event.type, event.data);
});
graphEditor.addEventListener("connection-deleted", (event) => {
  console.log("GRAPH EVENT:", event.type, event.data);
});

graphEditor.flowGraph = new FlowGraph({
  editorData: {
    locations: [],
    x: 0,
    y: 0,
    zoom: 1,
  },
  type: "",
  outputNodeId: 0,
  nodes: [],
});
document.body.append(graphEditor);
graphEditor.addNode(
  0,
  0,
  FlowGraph.CreateNode({
    type: "BODY_TEST",
    name: "BODY",
    inputs: [
      {
        name: "input",
        value: 0,
        valueType: "number",
      },
    ],
    outputs: [
      {
        name: "output",
        value: 0,
        valueType: "number",
      },
    ],
  })
);
graphEditor.addNode(
  300,
  0,
  FlowGraph.CreateNode({
    type: "TEST",
    name: "TEST 2",
    inputs: [
      {
        name: "input",
        value: 0,
        valueType: "number",
      },
    ],
    outputs: [
      {
        name: "output",
        value: 0,
        valueType: "number",
      },
    ],
  })
);
