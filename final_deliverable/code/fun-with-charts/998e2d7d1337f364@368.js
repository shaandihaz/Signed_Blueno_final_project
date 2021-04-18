import define1 from "./dea0d0ec849491a6@304.js";
import define2 from "./09403b146bada149@262.js";
import define3 from "./31ffe21a13ec2663@161.js";
import define4 from "./8f8215bd38a8cd0f@381.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["bba.csv",new URL("./files/d187af35f22dad8b31d38680bba4165acab79047b5d67b85cc8231e8c5518e9bd90947d800c5e9c6f2a56c92767c4c43f291e00c77e6232d2fbf58c25dc9b8ed",import.meta.url)],["db_all_weeks.csv",new URL("./files/5d3aa9f4883cc5839dd81c2cb006c0255d4becd04790c78976c8b364b4135587e42fa467d6876207ed5317ffdfe8ff6952fdb847e3b8a7be3ece2e8c80c222d6",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# BBA Frequency Analysis

<!-- - align semester better
- calculate weekly % of total posts for that semester -->`
)});
  main.variable(observer("semesters")).define("semesters", function(){return(
[
  {
    classes: { start: new Date("2018-09-05"), end: new Date("2018-12-21") },
    reading: { start: new Date("2018-12-08"), end: new Date("2018-12-12") },
    finals: { start: new Date("2018-12-13"), end: new Date("2018-12-21") }
  },
  {
    spring: { start: new Date("2019-03-23"), end: new Date("2019-03-31") },
    classes: { start: new Date("2019-01-23"), end: new Date("2019-05-17") },
    reading: { start: new Date("2019-04-26"), end: new Date("2019-05-07") },
    finals: { start: new Date("2019-05-08"), end: new Date("2019-05-17") }
  },
  {
    classes: { start: new Date("2019-09-04"), end: new Date("2019-12-21") },
    reading: { start: new Date("2019-12-08"), end: new Date("2019-12-12") },
    finals: { start: new Date("2019-12-13"), end: new Date("2019-12-21") }
  },
  {
    spring: { start: new Date("2020-03-21"), end: new Date("2020-03-29") },
    classes: { start: new Date("2020-01-22"), end: new Date("2020-05-15") },
    reading: { start: new Date("2020-04-24"), end: new Date("2020-05-05") },
    finals: { start: new Date("2020-05-06"), end: new Date("2020-05-15") }
  }
  // {
  //   classes: { start: new Date("2020-09-09"), end: new Date("2020-12-11") },
  //   reading: { start: new Date("2020-11-30"), end: new Date("2020-12-06") },
  //   finals: { start: new Date("2020-12-07"), end: new Date("2020-12-11") }
  // },
  // {
  //   spring: true,
  //   classes: { start: new Date("2021-01-20"), end: new Date("2021-04-23") },
  //   reading: { start: new Date("2021-04-12"), end: new Date("2021-04-18") },
  //   finals: { start: new Date("2021-04-19"), end: new Date("2021-04-23") }
  // }
]
)});
  main.variable(observer("data2")).define("data2", ["FileAttachment","d3"], function(FileAttachment,d3){return(
FileAttachment("db_all_weeks.csv")
  .text()
  // viewof data2 = fileInput({
  //   load(url) {
  //     return fetch(url)
  //       .then(response => {
  //         if (!response.ok)
  //           throw new Error(response.status + " " + response.statusText);
  //         return response.text();
  //       })
  .then(text =>
    d3.csvParse(text, ({ 'Start-Date': date, 'Avg-Sentiment': value }) => ({
      date: new Date(date).toISOString().split('T')[0],
      value: +value
    }))
  )
)});
  main.variable(observer("inRange")).define("inRange", function(){return(
(x, min, max) => x >= min && x <= max
)});
  main.variable(observer("bySemester")).define("bySemester", ["semesters","filtered","dateFns","inRange"], function(semesters,filtered,dateFns,inRange){return(
semesters.map(semester =>
  filtered
    .filter(
      d =>
        (dateFns.isWithinInterval(d.date, semester.classes) ||
          inRange(
            dateFns.differenceInDays(d.date, semester.classes.end),
            0,
            12
          )) &&
        (!semester.spring || !dateFns.isWithinInterval(d.date, semester.spring))
    )
    .map(d => {
      let offset = dateFns.differenceInDays(d.date, semester.classes.start);
      if (semester.spring && dateFns.isAfter(d.date, semester.spring.start))
        offset -= 7;
      return Object.assign({ offset }, d);
    })
)
)});
  main.variable(observer("byWeek")).define("byWeek", ["d3","data","dateFns"], function(d3,data,dateFns){return(
d3.group(
  data,
  d =>
    dateFns
      .startOfWeek(d.date)
      .toISOString()
      .split('T')[0]
)
)});
  main.variable(observer("semesterOffsets")).define("semesterOffsets", ["bySemester"], function(bySemester){return(
bySemester.flatMap(s =>
  s.map(d => Object.assign({ total: s.length }, d))
)
)});
  main.variable(observer("scatters")).define("scatters", ["data2","byWeek"], function(data2,byWeek){return(
data2.map(({ date, value }) => ({
  date,
  y: value,
  x: byWeek.get(date)?.length ?? 0
}))
)});
  main.variable(observer()).define(["scatterplot"], function(scatterplot){return(
scatterplot
)});
  const child1 = runtime.module(define1).derive([{name: "scatters", alias: "data"}], main);
  main.import("chart", "scatterplot", child1);
  main.variable(observer()).define(["d3","semesterOffsets"], function(d3,semesterOffsets){return(
d3.max(semesterOffsets)
)});
  main.variable(observer("histogramBins")).define("histogramBins", ["d3","semesterOffsets"], function(d3,semesterOffsets){return(
d3
  .bin()
  .thresholds(
    Array(Math.floor(d3.max(semesterOffsets, d => d.offset) / 7))
      .fill()
      .map((_, i) => i * 7)
  )
  .value(d => d.offset)(semesterOffsets)
  .map(bin => ({ name: bin[0].offset, value: d3.sum(bin, d => 1 / d.total) }))
)});
  main.variable(observer("readingOffsets")).define("readingOffsets", ["semesters","dateFns"], function(semesters,dateFns){return(
semesters.map(
  semester =>
    dateFns.differenceInDays(semester.reading.start, semester.classes.start) -
    (semester.spring ? 7 : 0)
)
)});
  main.variable(observer("finalOffsets")).define("finalOffsets", ["semesters","dateFns"], function(semesters,dateFns){return(
semesters.map(
  semester =>
    dateFns.differenceInDays(semester.finals.start, semester.classes.start) -
    (semester.spring ? 7 : 0)
)
)});
  main.variable(observer("finalEndOffsets")).define("finalEndOffsets", ["semesters","dateFns"], function(semesters,dateFns){return(
semesters.map(
  semester =>
    dateFns.differenceInDays(semester.finals.end, semester.classes.start) -
    (semester.spring ? 7 : 0)
)
)});
  const child2 = runtime.module(define2).derive([{name: "histogramBins", alias: "data"}], main);
  main.import("chart", child2);
  main.variable(observer()).define(["chart"], function(chart){return(
chart
)});
  main.variable(observer()).define(["histogram"], function(histogram){return(
histogram
)});
  main.variable(observer()).define(["histogram2"], function(histogram2){return(
histogram2
)});
  main.variable(observer("data")).define("data", ["FileAttachment","d3"], function(FileAttachment,d3){return(
FileAttachment("bba.csv")
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
  main.variable(observer()).define(["data"], function(data){return(
data[data.length - 1]
)});
  main.variable(observer("filtered")).define("filtered", ["data"], function(data){return(
data.filter(
  d =>
    d.date.getFullYear() <= 2019 ||
    (d.date.getFullYear() == 2020 && d.date.getMonth() < 2)
)
)});
  main.variable(observer("mapped")).define("mapped", ["data","dateFns"], function(data,dateFns){return(
data
  .filter(d => [2019, 2020].includes(d.date.getFullYear()))
  .map(d => ({
    ...d,
    date: dateFns.set(d.date, {
      year: 2020,
      month: d.date.getMonth() >= 7 ? d.date.getMonth() - 7 : null
    })
  }))
)});
  main.variable(observer()).define(["data"], function(data){return(
data
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require('d3@6')
)});
  main.variable(observer("dateFns")).define("dateFns", function(){return(
import('https://unpkg.com/date-fns@2.16.1/esm/index.js')
)});
  const child3 = runtime.module(define3);
  main.import("fileInput", child3);
  const child4 = runtime.module(define4).derive([{name: "mapped", alias: "data"}], main);
  main.import("histogram", child4);
  const child5 = runtime.module(define4).derive(["data"], main);
  main.import("histogram", "histogram2", child5);
  return main;
}
