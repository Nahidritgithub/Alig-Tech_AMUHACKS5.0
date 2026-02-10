import numpy as np
from sklearn.linear_model import LogisticRegression
import joblib
import os

PATH = "placement.pkl"

def train():
    X = np.array([
        [9,8,8,3,2],
        [8,7,7,2,1],
        [7,6,6,1,0],
        [6,5,5,0,0],
        [8.5,9,8,3,1]
    ])
    y = [1,1,0,0,1]

    m = LogisticRegression()
    m.fit(X,y)
    joblib.dump(m, PATH)

def load_model():
    if not os.path.exists(PATH):
        train()
    return joblib.load(PATH)
