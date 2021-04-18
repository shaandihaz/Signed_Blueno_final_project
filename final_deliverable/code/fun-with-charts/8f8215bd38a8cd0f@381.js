// https://observablehq.com/@j-f1/dear-blueno-analysis@381
import define1 from "./8d5ef3030dfd3bad@261.js";
import define2 from "./dc13673d7b6884c8@217.js";
import define3 from "./e93997d5089d7165@2303.js";
import define4 from "./d229a22b4a9fdc4b@148.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["dear-blueno.csv",new URL("./files/57d06b26b0405a30215b74e59ebcf9fc6cf35810580a6bd5efbeaff433cfdd8b61affc9d13932f474227356adfea7d7f1f259f5a30d2bff6603af8ff228ef93a",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# Dear Blueno Analysis

Cursory analysis of the archive provided by the [Dear Blueno](https://www.facebook.com/dearblueno) Facebook page, a confessions page for Brown University.
`
)});
  main.variable(observer()).define(["html","Generators","DOM","MutationObserver"], function(html,Generators,DOM,MutationObserver){return(
navigator.appVersion.includes('Safari')
  ? html`<hr>`
  : Generators.observe(notify => {
      let headings = [];

      function observed() {
        const h = Array.from(document.querySelectorAll('h2,h3,h4,h5,h6'));
        if (
          h.length !== headings.length ||
          h.some((h, i) => headings[i] !== h)
        ) {
          notify(
            html`<b>Table of Contents</b><ul>${Array.from((headings = h), h => {
              const level = parseInt(h.tagName.slice(1)) - 1;
              return Object.assign(
                html`${
                  level > 1 ? '<ul>'.repeat(level - 1) + '<li>' : '<li>'
                }<a href=#${h.id}>${DOM.text(h.textContent)}`,
                {
                  onclick: e => (
                    e.preventDefault(),
                    document.getElementById(h.id).scrollIntoView()
                  )
                }
              );
            })}`
          );
        }
      }

      const observer = new MutationObserver(observed);
      observer.observe(document.body, { childList: true, subtree: true });
      observed();
      return () => observer.disconnect();
    })
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Number of Posts by Day of Week`
)});
  main.variable(observer()).define(["md","d3","histogramBins"], function(md,d3,histogramBins){return(
md`Median posts per week: **${d3.median(histogramBins, d => d.length)}**.`
)});
  main.variable(observer()).define(["html","daysOfTheWeekData","weekdayNames","d3"], function(html,daysOfTheWeekData,weekdayNames,d3){return(
html`<table>
<thead><tr><th>Day</th><th>Number of posts</th></tr></thead>
<tbody>
${daysOfTheWeekData.map(
  ([day, count]) =>
    `<tr><td>${
      weekdayNames[day]
    }</td><td class="with-bar" style="--width: ${Math.round(
      (count / d3.max(daysOfTheWeekData, d => d[1])) * 100
    )}%">${count}</td></tr>\n`
)}
</tbody>
</table>`
)});
  main.variable(observer()).define(["collapsedCSS"], function(collapsedCSS){return(
collapsedCSS`
td.with-bar {
  position: relative;
  padding-left: 0.5em;
  color: white;
}
td.with-bar::before {
  content: '';
  position: absolute;
  height: calc(100% + 1px);
  width: var(--width);
  background: steelblue;
  z-index: -1;
  left: 0;
  top: 0;
}
`
)});
  main.variable(observer("daysOfTheWeekData")).define("daysOfTheWeekData", ["d3","histogramData"], function(d3,histogramData){return(
[...d3.group(histogramData, d => d.getDay())]
  .map(([day, items]) => [day, items.length])
  .sort(([day1], [day2]) => day1 - day2)
)});
  main.variable(observer("weekdayNames")).define("weekdayNames", function(){return(
[
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
]
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Number of Posts per Week`
)});
  main.variable(observer()).define(["histogram"], function(histogram){return(
histogram
)});
  const child1 = runtime.module(define1).derive([{name: "histogramData", alias: "data"},{name: "histogramX", alias: "x"}], main);
  main.import("chart", "histogram", child1);
  main.import("margin", "histogramMargin", child1);
  main.import("bins", "histogramBins", child1);
  main.variable(observer("histogramData")).define("histogramData", ["data"], function(data){return(
Object.assign(data.map(d => d.date), {
  y: "Number of posts per week"
})
)});
  main.variable(observer("histogramX")).define("histogramX", ["d3","histogramData","histogramMargin","width"], function(d3,histogramData,histogramMargin,width){return(
d3
  .scaleTime()
  .domain(d3.extent(histogramData))
  .nice(d3.timeWeek, 1)
  .range([histogramMargin.left, width - histogramMargin.right])
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Most popular topics

(added by mods to hide post content)  
(it’s a word cloud. don’t @ me)`
)});
  main.variable(observer("viewof showCovid")).define("viewof showCovid", ["checkbox"], function(checkbox){return(
checkbox({
  options: [{ label: 'Show coronavirus topic', value: 'true' }],
  value: 'true'
})
)});
  main.variable(observer("showCovid")).define("showCovid", ["Generators", "viewof showCovid"], (G, _) => G.input(_));
  main.variable(observer()).define(["topicCloudChart"], function(topicCloudChart){return(
topicCloudChart
)});
  main.variable(observer()).define(["md","topicCounts"], function(md,topicCounts){return(
md`${topicCounts
  .filter(t => t.value >= 20)
  .map(t => `- ${t.text} **${t.value}**\n`)}`
)});
  main.variable(observer("topicFontScale")).define("topicFontScale", function(){return(
7
)});
  const child2 = runtime.module(define2).derive([{name: "topics", alias: "words"},{name: "topicFontScale", alias: "fontScale"},{name: "topicCounts", alias: "data"}], main);
  main.import("chart", "topicCloudChart", child2);
  main.variable(observer("topicLookup")).define("topicLookup", function(){return(
{
  corona: 'coronavirus',
  'corona discourse': 'coronavirus',
  'dem nom': 'democratic nomination',
  'corona questions': 'coronavirus',
  antisemitism: 'anti-semitism',
  sw: 'spring weekend',
  'spring weekend lineup': 'spring weekend',
  reslife: 'housing questions',
  'suicidal ideation': 'suicide',
  'game of thrones spoilers': 'game of thrones',
  'game of thrones ending': 'game of thrones',
  'got spoiler': 'game of thrones',
  'transgender issues': 'trans issues',
  'israel-palestine': 'israel/palestine',
  israel: 'israel/palestine'
}
)});
  main.variable(observer("topics")).define("topics", ["data","topicLookup","showCovid"], function(data,topicLookup,showCovid){return(
data
  .flatMap(p =>
    p.topics.map(t =>
      t
        .toLowerCase()
        .replace(' discourse', '')
        .replace(' mention', '')
        .replace('mention of ', '')
        .replace('mentions of ', '')
        .trim()
    )
  )
  .map(t => topicLookup[t] || t)
  .map(t => (t.includes('kink') ? '(all kinks)' : t))
  .filter(t => (showCovid ? t : t !== 'coronavirus'))
)});
  main.variable(observer("topicCounts")).define("topicCounts", ["d3","topics"], function(d3,topics){return(
d3
  .rollups(topics, group => group.length, w => w)
  .filter(([, count]) => count >= 5)
  .sort(([, a], [, b]) => d3.descending(a, b))
  .slice(0, 250)
  .map(([text, value]) => ({ text, value }))
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Word cloud`
)});
  main.variable(observer()).define(["wordCloudChart"], function(wordCloudChart){return(
wordCloudChart
)});
  main.variable(observer("fontScale")).define("fontScale", function(){return(
1
)});
  const child3 = runtime.module(define2).derive([{name: "wordCloudData", alias: "source"},"fontScale"], main);
  main.import("chart", "wordCloudChart", child3);
  main.variable(observer("wordCloudData")).define("wordCloudData", ["data"], function(data){return(
data.reduce(
  (combined, { content }) => combined + ' ' + content,
  ''
)
)});
  main.variable(observer("data")).define("data", ["FileAttachment","d3"], function(FileAttachment,d3){return(
FileAttachment("dear-blueno.csv")
  .text()
  .then(text =>
    d3.csvParse(text, ({ date, id, topics, verified, content, updated }) => ({
      date: new Date(date),
      updated: updated ? new Date(updated) : false,
      id: +id,
      topics: topics ? topics.split(',') : [],
      verified: verified === 'true',
      content
    }))
  )
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require('d3@5', 'd3-array@2')
)});
  const child4 = runtime.module(define3);
  main.import("checkbox", child4);
  const child5 = runtime.module(define4);
  main.import("collapsedCSS", child5);
  return main;
}
