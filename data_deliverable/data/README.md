# Data Spec

The data for both BBA and Dear Blueno both have a similar format, as described below.

## Links to Full Data

All data is stored in the repository.

Dear Blueno Posts, processed (csv format): `data_deliverable/data/processed/dear-blueno.csv`

BBA Posts, processed (csv format): `data_deliverable/data/processed/bba.csv`

The raw data is in `data_deliverable/data/raw`.


## Processed Data
The processed data is in CSV format. Each row has the following columns, which are required unless otherwise specified:

* `date`: an ISO8601-formatted date, the date/time the post was added to the Facebook page (not submitted)
* `id`: an integer, representing the number of the post. May not be unique since verified and unverified posts both started at 1.
* `topics`: an array of strings (represented as a comma-delimited string). If the post is formatted as `topics: a, b, c\n.\n.\n.[etc]\n.post content`, `topics` will be `a,b,c`. Posts without a `topics:` or `cw:` tag will have an empty value for `topics`
* `verified`: a boolean (`true` or `false`) representing whether the post was submitted to Dear Blueno's verified form, which was introduced in early November 2019 and requires the submitter to be logged in with a Brown email address. This column is not present in the `bba.csv` file because BBA does not have a verified form.
* `content`: a string containing the actual content of the post, as the OP submitted it.
* `updated`: if the post was edited by the mods at any point, this holds the date of the most recent edit in ISO8601 format.

Each row can be uniquely identified using a combination of the `id` and `verified` columns for `dear-blueno.csv`, and just by the `id` column for `bba.csv`.


## Raw Data
The raw data is in a JSON format, with an array of objects at the top level.

Each object has the following required keys:

* `content`: a string containing the full text of the Facebook post
* `date`: a string containing the post's date, as formatted by Facebook. Example: `Mar 19, 2020, 11:03 AM`

The raw data is extracted from the HTML files provided by Facebook's data-download tool by running the following script in the browser's developer tools while the downloaded HTML page is open:

```js
$$('.uiBoxWhite > ._2let > div')
  // .slice(0, -3) // uncomment on the last page page of Dear Blueno data to remove stuff at end
  .map(d => {
    const firstText = d.firstChild.innerText;
    const type = d.parentNode.parentNode.firstChild.innerText;
    const content =
      d.children.length === 1
        ? d.innerText
        : firstText.startsWith('From ') /* event */ ||
          firstText === '' /* ??? */ ||
          firstText.startsWith('Poll: ') /* poll */ ||
          firstText.trim().endsWith('facebook.com') /* sharing things */ ||
          type.includes('shared a group') ||
          type.includes('published a note')
        ? d.children[1].innerText
        : null;
    return content
      ? { content, date: d.parentNode.parentNode.lastChild.innerText }
      : console.log(d);
  })
  .filter(Boolean)
```

## Scraping/Cleaning

The raw data was scraped from the provided HTML pages using the above script. Further cleaning and processing of the data into a CSV format was carried out using two [Observable](https://observablehq.com) notebooks ([what does this mean?](https://observablehq.com/@observablehq/a-taste-of-observable?collection=@observablehq/introduction)).

The notebooks have been downloaded into the `notebooks` directory in case Observable's servers go down but it would be a much better experience to view them online:

- The [BBA Notebook](https://observablehq.com/d/56f0e983c79d6743) can be viewed through Observable's website or by running a local server on the extracted contents of `notebooks/bba.tar.zip`. Upload `data/raw/bba-1.json` and `data/raw/bba-2.json` to the two file inputs to see it working.
- The [Dear Blueno notebook](https://observablehq.com/d/be11c5ffccca1383) can be viewed through Observable's website or by running a local server on the extracted contents of `notebooks/dear-blueno.tar.zip`. This notebook should work without having to upload `data/raw/dear-blueno-1.json` and `data/raw/dear-blueno-2.json`, although it is still possible to manually upload those files if the default links stop working.
