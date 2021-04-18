// https://observablehq.com/@mbostock/file-input@161
export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["beastie-boys.jpg",new URL("./files/049d28b90a46079a7017946b2c23b9f8530d4e2d9cc49aa50c9b509067e24819af275341d5935584817c940946c5dea050d0826a9350a2aa657aa397a7581e42",import.meta.url)],["points.json",new URL("./files/bd9f1e7151bfd64d616ae6b7502a8d57b95f1d4b39e36185a0d9b1f31d1e45847b11bcbb6e3cab4bb766369d5e8926dbd686d4fb2a052330b39f0fc26dd47d86",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# File Input

This reusable input allows an image file to be specified either by URL or by choosing a file from disk. A JSON file input and a generic file input are also available below. To use them in your notebook:

\`\`\`js
import {fileInput} from "@mbostock/file-input"
\`\`\``
)});
  main.variable(observer("viewof image")).define("viewof image", ["imageInput","FileAttachment"], async function(imageInput,FileAttachment){return(
imageInput({
  crossOrigin: "anonymous",
  initialUrl: await FileAttachment("beastie-boys.jpg").url()
})
)});
  main.variable(observer("image")).define("image", ["Generators", "viewof image"], (G, _) => G.input(_));
  main.variable(observer()).define(["image"], function(image){return(
image
)});
  main.variable(observer("viewof data")).define("viewof data", ["jsonInput","FileAttachment"], async function(jsonInput,FileAttachment){return(
jsonInput({
  initialUrl: await FileAttachment("points.json").url()
})
)});
  main.variable(observer("data")).define("data", ["Generators", "viewof data"], (G, _) => G.input(_));
  main.variable(observer()).define(["data"], function(data){return(
data
)});
  main.variable(observer()).define(["md"], function(md){return(
md`---

## Implementation`
)});
  main.variable(observer("fileInput")).define("fileInput", ["html"], function(html){return(
function fileInput({
  initialUrl, // e.g., "https://example.com/file.txt"
  accept, // e.g., ".txt,.md"
  load = value => value // A function to specify which value is exposed.
}) {
  let file = null;
  const form = html`<form>
  ${Object.assign(html`<input name=url>`, {value: initialUrl})}
  <button>Submit</button>
  ${Object.assign(html`<input data-type=file name=file type=file>`, {accept})}
`;
  form.onsubmit = event => {
    form.value = load(form.url.value);
    form.dispatchEvent(new CustomEvent("input"));
    event.preventDefault();
  };
  form.url.oninput = event => {
    event.stopPropagation();
  };
  form.file.oninput = () => {
    if (file !== null) URL.revokeObjectURL(file);
    file = URL.createObjectURL(form.file.files[0]);
    form.value = load(form.url.value = file);
  };
  if (initialUrl !== undefined) {
    form.value = load(initialUrl);
  }
  return form;
}
)});
  main.variable(observer("imageInput")).define("imageInput", ["fileInput"], function(fileInput){return(
function imageInput({initialUrl, width, height, crossOrigin, accept = ".png,.jpg,.gif,.webp"}) {
  return fileInput({
    initialUrl,
    accept,
    load(url) {
      return new Promise((resolve, reject) => {
        const image = new Image;
        image.style.display = "block";
        if (width !== undefined) image.width = width;
        if (height !== undefined) image.height = height;
        if (crossOrigin !== undefined) image.crossOrigin = crossOrigin;
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = url;
      });
    }
  });
}
)});
  main.variable(observer("jsonInput")).define("jsonInput", ["fileInput"], function(fileInput){return(
function jsonInput({initialUrl, init, accept = ".json"}) {
  return fileInput({
    initialUrl,
    accept,
    load(url) {
      return fetch(url, init).then(response => {
        if (!response.ok) throw new Error(response.status + " " + response.statusText);
        return response.json();
      });
    }
  });
}
)});
  return main;
}
