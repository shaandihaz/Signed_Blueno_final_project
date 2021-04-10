import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
import datetime
from datetime import date
from dateutil.parser import parse

stress_periods = [(date(2018, 9, 9), date(2018, 9, 20)), (date(2018, 12, 9), date(2018, 12, 21)),\
                    (date(2019, 1, 20), date(2019, 2, 5)), (date(2019, 4, 26), date(2019, 5, 12)),\
                    (date(2019, 9, 1), date(2019, 9, 17)), (date(2019, 12, 8), date(2019, 12, 22)),\
                    (date(2020, 1, 19), date(2020, 2, 4)), (date(2020, 4, 19), date(2020, 5, 15)),\
                    (date(2020, 9, 6), date(2020, 9, 22)), (date(2020, 11, 29), date(2020, 12, 11)),\
                    (date(2021, 1, 17), date(2021, 2, 2))]

def main():
    with open("bba_all_weeks.csv", 'rb') as f1:
        bba = pd.read_csv(f1)

    with open("db_all_weeks.csv", 'rb') as f2:
        db = pd.read_csv(f2)

    ########### T-TESTING
    bba_t = bba.copy()
    bba_stress = pd.DataFrame(columns = ["Start-Date", "Freq"])
    bba_t["Start-Date"] = bba_t["Start-Date"].apply(lambda x: parse(x).date())

    for sp in stress_periods:
        mask = (bba_t["Start-Date"] >= sp[0]) & ((bba_t["Start-Date"] <= sp[1]))
        sub = bba_t.loc[mask]
        bba_stress = pd.concat([bba_stress, sub])

    bba_non_stress = pd.concat([bba_t, bba_stress]).drop_duplicates(keep=False)

    db_t = db.copy()
    del db_t['End-Date']

    db_stress = pd.DataFrame(columns = ["Start-Date", "Avg-Sentiment"])
    db_t["Start-Date"] = db_t["Start-Date"].apply(lambda x: parse(x).date())

    for sp in stress_periods:
        mask = (db_t["Start-Date"] >= sp[0]) & ((db_t["Start-Date"] <= sp[1]))
        sub = db_t.loc[mask]
        db_stress = pd.concat([db_stress, sub])

    db_non_stress = pd.concat([db_t, db_stress]).drop_duplicates(keep=False)

    bba_stress.to_csv("bba_stress.csv", index=False)
    bba_non_stress.to_csv("bba_non_stress.csv", index=False)
    db_stress.to_csv("db_stress.csv", index=False)
    db_non_stress.to_csv("db_non_stress.csv", index=False)


    ########### LINEAR REGRESSION
    # bba = bba.loc[(bba["Start-Date"] >= "2018-11-18") & (bba["Start-Date"] <= "2020-03-15")]
    #
    # X = bba["Freq"].to_numpy().reshape(-1, 1)
    # Y = db["Avg-Sentiment"].to_numpy()
    #
    # model = LinearRegression()
    # model.fit(X, Y)
    # r_sq = model.score(X, Y)
    # print("R-Squared ", r_sq)
    # print("Intercept ", model.intercept_)
    # print("Slope ", model.coef_)
    #
    # plt.plot(X, Y, "o")
    #
    # plt.plot([0, 500], [model.intercept_, model.coef_ * 500 + model.intercept_])
    # plt.show()

if __name__ == '__main__':
    main()
