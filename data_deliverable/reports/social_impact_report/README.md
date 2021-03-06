# Socio-historical Context and Impact Report


## Socio-historical Context

Administrators and much of the older generation are generally wary of anonymous public confessions pages or websites. They can be concerned with the type of information shared on these sites, particularly the legal ramifications of the information that might potentially be shared. 

Our stakeholders in the project would include Brown students and community members, other college students, or those curious about sentiment on anonymous confessions pages. We do not believe anyone would be harmed by our findings, but it could be beneficial to learn more about the dynamics of such pages in times of stress.

We searched for existing research using the term “college confessions page” on Brown’s library search and found no relevant results. We believe there is no academic research on such pages, and it is incredibly unlikely that there is any research on Dear Blueno/BBA specifically.

## Ethical Considerations

> What kind of underlying historical or societal biases might your data contain? How can this bias be mitigated?

Since all data is from 2018 or later, there are unlikely to be historical biases. There may be biases in the kinds of people likely to submit to Dear Blueno/BBA since they are probably almost all Brown students, but we’re explicitly planning to study how Brown students are feeling so this is not an issue.

> What biases might exist in your interpretation of the data?

Because we are using natural language processing to conduct sentiment analysis, we have to be aware of the limitations it has to accurately interpret our data. VADER from NLTK, the NLP toolkit we are considering using, is specifically designed for social media posts. That being said, there is a lot of slang that is specific to Brown that VADER would likely have trouble recognizing, and as such, we have to be cognizant of the accuracy of its analysis. 

> Is data being used in a manner agreed to by the individuals who provided the data?

While nobody specifically consented to the use of their Dear Blueno/BBA post in a CS1951A final project, they did submit the post to be displayed publicly. Additionally, some users checked a checkbox labelled “I consent to have my message published by the Brown Daily Herald and other third parties.” when submitting their post, although we have no way of knowing which posts were submitted with this box checked. The moderators of Dear Blueno posted this data publically, and while we requested the data from BBA in a private message, we are not using any information contained within the content of those posts themselves. We are only interested the frequency and density of the BBA posts within our specific time frames. 

> Add your own: if there is an ethical or societal issue about your project you would like to discuss or explain further, feel free to do so.

We acknowledge that while doing the sentiment analysis, there is a small chance we may be able to figure out if some posts were written by the same person, just based on their writing style. We believe this to be a serious issue, and will do everything we can to make sure our code does not incidentally reflect that knowledge.  


## Works Cited

- https://www.insidehighered.com/news/2013/02/26/college-confession-and-makeout-pages-raise-privacy-anonymity-issues
- https://paloaltoonline.com/news/2020/03/06/anonymous-confessions-pages-are-surging-in-popularity-on-high-school-and-college-campuses-why
- https://www.codeproject.com/Articles/5269445/Using-Pre-trained-VADER-Models-for-NLTK-Sentiment#:~:text=Developed%20in%202014%2C%20VADER%20
