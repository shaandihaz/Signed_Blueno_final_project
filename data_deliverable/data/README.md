# Data Spec

The data for both BBA and Dear Blueno both have the same format, as described below.

## Processed Data
The processed data is also in JSON format, with an array of objects at the top level. Each object has the following fields, which are required unless otherwise specified:

* `date`: an ISO8601-formatted date, the date/time the post was added to the Facebook page (not submitted)
* `id`: an integer, representing the number of the post. May not be unique since verified and unverified posts both started at 1.
* `topics`: an array of strings. If the post is formatted as `topics: a, b, c\n.\n.\n.[etc]\n.post content`, `topics` will be `["a", "b", "c"]`. Only present on Dear Blueno posts. Posts without a `topics:` or `cw:` tag will have a `null` value for `topics`
* `verified`: a boolean representing whether the post was submitted to Dear Blueno's verified form, which was introduced in early November 2019 and requires the submitter to be logged in with a Brown email address. Always `false` for BBA posts.
* `content`: a string containing the actual content of the post, ideally as the OP submitted it.
* `updated`: if the post was edited by the mods at any point, this holds the date of the most recent edit in ISO8601 format.

Each object can be uniquely identified using a combination of the `id` and `verified` fields. There are no foreign keys.


## Raw Data
The raw data is in a JSON format, with an array of objects at the top level.

Each object has the following required keys:

* `content`: a string containing the full text of the Facebook post
* `date`: a string containing the post's date, as formatted by Facebook. Example: `Mar 19, 2020, 11:03 AM`

The raw data is extracted from the HTML files provided by Facebook's data-download too by running the following script in the browser's developer tools while the downloaded HTML page is open:

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

