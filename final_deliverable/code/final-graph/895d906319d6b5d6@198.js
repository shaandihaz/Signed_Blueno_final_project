import define1 from "./09403b146bada149@262.js";
import define2 from "./8d5ef3030dfd3bad@261.js";
import define3 from "./a2e58f97fd5e8d7c@568.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["db_stress.csv",new URL("./files/d672ee1e1ed3585c8fd8283f7e16f54f3caa156d4ec7e66178897fa536123129750f34158a860809eac000fabc69e983bf6b4a9aaae5b514200337fe8174a237",import.meta.url)],["db_non_stress.csv",new URL("./files/57a6ed811f42216c710aa8a22fcf1ddc797b561044f1ba565e44dd9b9821b319cc7611a0a3483c9b96619c7d7eb55893109774b787f50f6f6b66315c6fe80d66",import.meta.url)],["bba_stress.csv",new URL("./files/acea82283edd2f7544df1f8624ff07afd83503ff3eb7a94d20ec0b9776c1e4d7d9804564e3c5c8edac0e3595221572851b240be080fa713809166c1370859a8d",import.meta.url)],["bba_non_stress@1.csv",new URL("./files/8950735e1603d08488e2ba90b9ba9bfcc205e7be1ce5d99141b875d27445da6dbf1128349e1f5e4cdf3e4dbcb35a406db108c8bf9e1314c79e3668c7601b35f9",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# CSCI1951A visualizations`
)});
  main.variable(observer("viewof useDB")).define("viewof useDB", ["Toggle"], function(Toggle){return(
Toggle({ label: 'Dear Blueno' })
)});
  main.variable(observer("useDB")).define("useDB", ["Generators", "viewof useDB"], (G, _) => G.input(_));
  main.variable(observer("chart")).define("chart", ["d3","width","height","data","x","y","useDB","xAxis","yAxis","margin","legend"], function(d3,width,height,data,x,y,useDB,xAxis,yAxis,margin,legend)
{
  const svg = d3.create("svg").attr("viewBox", [0, 0, width, height]);

  svg
    .append("g")
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("x", (d, i) => x(i))
    .attr("y", d => (d.value >= 0 ? y(d.value) : y(0)))
    .attr("height", d => (d.value >= 0 ? y(0) - y(d.value) : y(d.value) - y(0)))
    .attr("width", x.bandwidth())
    .attr("fill", d => d.color);

  svg
    .append("text")
    .text(useDB ? 'Dear Blueno' : 'BBA')
    .attr("text-anchor", 'middle')
    .attr('font-family', 'sans-serif')
    .attr('font-weight', 'bold')
    .attr('x', width / 2)
    .attr('y', 20);

  svg
    .append("text")
    .text(useDB ? 'p = 0.36602348240324734' : 'p = 0.6598036253232517')
    .attr("text-anchor", 'middle')
    .attr('font-family', 'monospace')
    .attr('font-size', '12')
    .attr('x', width / 2)
    .attr('y', 45);

  svg
    .append("text")
    .text(useDB ? 'U = 517.0' : 'U = 1039.5')
    .attr("text-anchor", 'middle')
    .attr('font-family', 'monospace')
    .attr('font-size', '12')
    .attr('x', width / 2)
    .attr('y', 60);

  svg.append("g").call(xAxis);

  svg.append("g").call(yAxis);

  svg
    .append("g")
    .attr(
      "transform",
      `translate(${width - 250 - margin.right}, ${margin.top})`
    )
    .append(() => legend.node());

  return svg.node();
}
);
  main.variable(observer("xAxis")).define("xAxis", ["height","margin","d3","data","width"], function(height,margin,d3,data,width){return(
g =>
  g.attr("transform", `translate(0,${height - margin.bottom})`).call(
    d3
      .axisBottom(
        d3
          .scaleUtc()
          .domain(d3.extent(data, d => new Date(d.date)))
          .range([margin.left, width - margin.right])
      )
      .ticks(width / 60)
      .tickSizeOuter(0)
  )
)});
  main.variable(observer("dbData")).define("dbData", ["FileAttachment"], function(FileAttachment){return(
Promise.all([
  FileAttachment("db_non_stress.csv").csv(),
  FileAttachment("db_stress.csv").csv()
]).then(([non, stress]) =>
  non
    .map(d => ({ ...d, color: 'steelblue' }))
    .concat(stress.map(d => ({ ...d, color: 'red' })))
    .map(({ 'Start-Date': date, 'Avg-Sentiment': sentiment, color }) => ({
      date,
      value: +sentiment,
      color
    }))
)
)});
  main.variable(observer("bbaData")).define("bbaData", ["FileAttachment","d3"], function(FileAttachment,d3){return(
Promise.all([
  FileAttachment("bba_non_stress@1.csv").csv(),
  FileAttachment("bba_stress.csv").csv()
]).then(([non, stress]) =>
  non
    .map(d => ({ ...d, color: 'steelblue' }))
    .concat(stress.map(d => ({ ...d, color: 'red' })))
    .map(({ 'Start-Date': date, Freq: freq, color }) => ({
      date,
      value: +freq,
      color
    }))
    .concat(
      d3.csvParseRows(
        `2019-06-02,7
2019-06-09,7
2019-06-16,11
2019-06-23,17
2019-06-30,8
2019-07-07,14
2019-07-14,13
2019-07-21,9
2019-07-28,0
2019-08-04,0
2019-08-11,59
2019-08-18,25
2019-08-25,20
2020-06-07,79
2020-06-14,49
2020-06-21,71
2020-06-28,44
2020-07-05,66
2020-07-12,83
2020-07-26,46
2020-08-02,62
2020-08-09,57
2020-08-16,40
2020-08-23,23
2020-08-30,64`,
        ([date, value]) => ({ date, value: +value, color: 'lightgray' })
      )
    )
)
)});
  main.variable(observer("data")).define("data", ["d3","useDB","dbData","bbaData"], function(d3,useDB,dbData,bbaData){return(
Object.assign(d3.sort(useDB ? dbData : bbaData, d => d.date), {
  y: useDB ? "↑ Average sentiment score by week" : "↑ Number of posts per week"
})
)});
  main.variable(observer("y")).define("y", ["d3","useDB","data","height","margin"], function(d3,useDB,data,height,margin){return(
d3
  .scaleLinear()
  .domain(
    useDB ? d3.extent(data, d => d.value) : [0, d3.max(data, d => d.value)]
  )
  .nice()
  .range([height - margin.bottom, margin.top])
)});
  const child1 = runtime.module(define1).derive(["data","y","xAxis"], main);
  main.import("yAxis", child1);
  main.import("x", child1);
  main.import("d3", child1);
  main.import("height", child1);
  main.import("margin", child1);
  const child2 = runtime.module(define2).derive([{name: "histogramData", alias: "data"},{name: "histogramX", alias: "x"}], main);
  main.import("chart", "histogram", child2);
  main.import("margin", "histogramMargin", child2);
  main.import("bins", "histogramBins", child2);
  const child3 = runtime.module(define3);
  main.import("Toggle", child3);
  main.variable(observer("palette")).define("palette", ["useDB"], function(useDB){return(
useDB ? ["steelblue", "red"] : ["steelblue", "red", "lightgray"]
)});
  main.variable(observer("domains")).define("domains", ["useDB"], function(useDB){return(
useDB
  ? ["Normal", "Stress Periods"]
  : ["Normal", "Stress Periods", "Summer (not counted)"]
)});
  main.variable(observer("legend")).define("legend", ["d3","domains","palette"], function(d3,domains,palette)
{
  // Legend as a group
  const legend = d3.create("svg:g");

  const size = 20;
  const border_padding = 15;
  const item_padding = 5;
  const text_offset = 2;

  // Border
  legend
    .append('rect')
    .attr("width", 220)
    .attr("height", 100)
    .style("fill", "none");
  // .style("stroke-width", 1)
  // .style("stroke", "black");

  // Boxes
  legend
    .selectAll("boxes")
    .data(domains)
    .enter()
    .append("rect")
    .attr("x", border_padding)
    .attr("y", (d, i) => border_padding + i * (size + item_padding))
    .attr("width", size)
    .attr("height", size)
    .style("fill", (d, i) => palette[i]);

  // Labels
  legend
    .selectAll("labels")
    .data(domains)
    .enter()
    .append("text")
    .attr("x", border_padding + size + item_padding)
    .attr(
      "y",
      (d, i) =>
        border_padding + i * (size + item_padding) + size / 2 + text_offset
    )
    // .style("fill", (d) => color(d))
    .text(d => d)
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
    .style("font-family", "sans-serif");

  return legend;
}
);
  return main;
}
