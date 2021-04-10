import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
import datetime
from datetime import date
from dateutil.parser import parse

def main():
    with open("bba_all_weeks.csv", 'rb') as f1:
        bba = pd.read_csv(f1)

    with open("db_all_weeks.csv", 'rb') as f2:
        db = pd.read_csv(f2)

    bba["Start-Date"] = bba["Start-Date"].apply(lambda x: parse(x).date())

    start_date2 = date(2018, 11, 18)
    end_date2 = start_date2 + datetime.timedelta(6)

    bba_df = pd.DataFrame(columns = ["Start-Date", "End-Date", "Avg-Sentiment"])

    print(bba)
    while start_date2 <= date(2020, 3, 19):
        #print(start_date2)
        mask = (bba["Start-Date"] > start_date2) & (bba["Start-Date"] <= end_date2)
        print(mask)
        subdf = bba.loc[mask]
        print(subdf)
        sum = subdf["Freq"].sum()
        #print(sum)
        bba_df = bba_df.append({"Start-Date": start_date2, "End-Date": end_date2, "Freq": sum}, ignore_index=True)
        start_date2 = end_date2 + datetime.timedelta(1)
        end_date2 = start_date2 + datetime.timedelta(6)


    X = bba_df["Freq"].to_numpy().reshape(-1, 1)
    Y = db["Avg-Sentiment"].to_numpy()

    #print(X)
    #print(Y)

    # model = LinearRegression()
    # model.fit(X, Y)
    # r_sq = model.score(X, Y)
    # print(r_sq)
    #
    # plt.scatter(X, Y)
    # plt.show()

if __name__ == '__main__':
    main()
