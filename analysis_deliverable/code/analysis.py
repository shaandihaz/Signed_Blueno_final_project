# Do sentiment analysis on every dear blueno post
# Group by date ranges

import nltk
import pandas as pd
import datetime
from datetime import date
from nltk.sentiment import SentimentIntensityAnalyzer
from dateutil.parser import parse

sia = SentimentIntensityAnalyzer()
path = "../../data_deliverable/data/processed/dear-blueno.csv"

start_dates = [date(2018, 11, 18), date(2018, 12, 8), date(2018, 12, 22), date(2019, 1, 23),\
                date(2019, 2, 6), date(2019, 4, 26), date(2019, 5, 18), date(2019, 9, 4),\
                date(2019, 9, 18), date(2019, 12, 8), date(2019, 12, 22), date(2020, 1, 22),\
                date(2020, 2, 5)]
end_dates = [date(2018, 12, 7), date(2018, 12, 21), date(2019, 1, 22),\
                date(2019, 2, 5), date(2019, 4, 25), date(2019, 5, 17), date(2019, 9, 3),\
                date(2019, 9, 17), date(2019, 12, 7), date(2019, 12, 21), date(2020, 1, 21),\
                date(2020, 2, 4), date(2020, 3, 19)]

def analyze_post(content):
    tok = nltk.sent_tokenize(content)
    avg = 0.0
    for s in tok:
        scores = sia.polarity_scores(s)
        avg += scores["compound"]
    avg /= len(tok)
    return avg

def main():
    with open(path, 'rb') as f:
        df = pd.read_csv(f)

    df["date"] = df["date"].apply(lambda x: parse(x).date())
    df["sentiment"] = df["content"].apply(lambda x: analyze_post(x))

    df2 = pd.DataFrame(columns = ["Start-Date", "End-Date", "Avg-Sentiment"])

    for i in range(len(start_dates)):
        start_date = start_dates[i]
        end_date = end_dates[i]
        mask = (df["date"] > start_date) & (df["date"] <= end_date)
        subdf = df.loc[mask]
        mean = subdf["sentiment"].mean()
        df2 = df2.append({"Start-Date": start_date, "End-Date": end_date, "Avg-Sentiment": mean}, ignore_index=True)
    print(df2)

    df3 = pd.DataFrame(columns = ["Start-Date", "End-Date", "Avg-Sentiment"])

    start_date2 = start_dates[0]
    end_date2 = start_date2 + datetime.timedelta(6)

    while start_date2 <= end_dates[-1]:
        print(start_date2)
        mask = (df["date"] > start_date2) & (df["date"] <= end_date2)
        subdf = df.loc[mask]
        mean = subdf["sentiment"].mean()
        df3 = df3.append({"Start-Date": start_date2, "End-Date": end_date2, "Avg-Sentiment": mean}, ignore_index=True)
        start_date2 = end_date2 + datetime.timedelta(1)
        end_date2 = start_date2 + datetime.timedelta(6)
    print(df3)

    df2.to_csv("stress_periods.csv", index=False)
    df3.to_csv("all_weeks.csv", index=False)

if __name__ == '__main__':
    main()





# print(sia.polarity_scores(str5))
# tok = nltk.sent_tokenize(str5)
# print(len(tok))
# for s in tok:
#     print(s)
# avg = 0.0
# for s in tok:
#     scores = sia.polarity_scores(s)
#     avg += scores["compound"]
#     #print(sia.polarity_scores(s))
# avg /= len(tok)
# print(avg)
# print(sia.polarity_scores(str5)["compound"])
# for c in str5:
#     print(c)
#
# print(sia.polarity_scores("😀"))
