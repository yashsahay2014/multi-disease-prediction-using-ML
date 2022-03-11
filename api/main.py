from flask import Flask

import warnings
import numpy as np
import pandas as pd
from sklearn.metrics import accuracy_score, precision_recall_fscore_support
from sklearn.model_selection import train_test_split, cross_val_score
from statistics import mean
from nltk.corpus import wordnet 
import requests
from bs4 import BeautifulSoup
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import RegexpTokenizer
from itertools import combinations
from time import time
from collections import Counter
import operator
# from xgboost import XGBClassifier
import math
# from Treatment import diseaseDetail
from sklearn.linear_model import LogisticRegression
import nltk

app = Flask(__name__)

@app.route("/")
def home():
    return "Hello, World!"
    
if __name__ == "__main__":
    app.run(debug=True)
