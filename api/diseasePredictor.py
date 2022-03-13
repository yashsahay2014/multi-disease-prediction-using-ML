import requests
import nltk
import operator
import math
import json
import numpy as np
import pandas as pd
from time import time
from bs4 import BeautifulSoup
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import RegexpTokenizer
from nltk.corpus import wordnet
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_recall_fscore_support
from sklearn.model_selection import train_test_split, cross_val_score
from itertools import combinations
from collections import Counter
from statistics import mean
from treatment import diseaseDetail

class DiseasePredictor:
    def __init__(self):
        # nltk.download('all')

        self.stop_words = stopwords.words('english')

        # Load Dataset scraped from NHP (https://www.nhp.gov.in/disease-a-z) & Wikipedia
        # Scrapping and creation of dataset csv is done in a separate program
        self.df_comb = pd.read_csv("./dataset/dis_sym_dataset_comb.csv") # Disease combination
        self.df_norm = pd.read_csv("./dataset/dis_sym_dataset_norm.csv") # Individual Disease

        self.X = self.df_comb.iloc[:, 1:]
        self.Y = self.df_comb.iloc[:, 0:1]

        # Using Logistic Regression (LR) Classifier as it gives better accuracy compared to other
        # classification models as observed in the comparison of model accuracies in Model_latest.py
        # Cross validation is done on dataset with cv = 5
        self.lr = LogisticRegression()
        self.lr = self.lr.fit(self.X, self.Y)
        self.scores = cross_val_score(self.lr, self.X, self.Y, cv=5)

        # List of symptoms
        self.dataset_symptoms = list(self.X.columns)

        # Preprocess
        self.lemmatizer = WordNetLemmatizer()
        self.splitter = RegexpTokenizer(r'\w+')


    # returns the list of synonyms of the input word from thesaurus.com (https://www.thesaurus.com/) 
    # and wordnet (https://www.nltk.org/howto/wordnet.html)
    def synonyms(self, term):
        synonyms = []
        response = requests.get('https://www.thesaurus.com/browse/{}'.format(term))
        soup = BeautifulSoup(response.content,  "html.parser")
        try:
            container=soup.find('section', {'class': 'MainContentContainer'}) 
            row=container.find('div',{'class':'css-191l5o0-ClassicContentCard'})
            row = row.find_all('li')
            for x in row:
                synonyms.append(x.get_text())
        except:
            None
        for syn in wordnet.synsets(term):
            synonyms+=syn.lemma_names()
        return set(synonyms)

    def setInitialSymptoms(self, initial_symptoms):    
        # Taking symptoms from user as input str(input("Please enter symptoms separated by comma(,):\n"))
        self.user_symptoms = initial_symptoms.lower().split(',')
        # Preprocessing the input symptoms
        self.processed_user_symptoms=[]
        for sym in self.user_symptoms:
            sym=sym.strip()
            sym=sym.replace('-',' ')
            sym=sym.replace("'",'')
            sym = ' '.join([self.lemmatizer.lemmatize(word) for word in self.splitter.tokenize(sym)])
            self.processed_user_symptoms.append(sym)

        # Taking each user symptom and finding all its synonyms and appending it to the pre-processed symptom string
        user_symptoms = []
        for user_sym in self.processed_user_symptoms:
            user_sym = user_sym.split()
            str_sym = set()
            for comb in range(1, len(user_sym)+1):
                for subset in combinations(user_sym, comb):
                    subset=' '.join(subset)
                    subset = self.synonyms(subset) 
                    str_sym.update(subset)
            str_sym.add(' '.join(user_sym))
            user_symptoms.append(' '.join(str_sym).replace('_',' '))

        # Loop over all the symptoms in dataset and check its similarity score to the synonym string of the user-input 
        # symptoms. If similarity>0.5, add the symptom to the final list
        found_symptoms = set()
        for idx, data_sym in enumerate(self.dataset_symptoms):
            data_sym_split=data_sym.split()
            for user_sym in user_symptoms:
                count=0
                for symp in data_sym_split:
                    if symp in user_sym.split():
                        count+=1
                if count/len(data_sym_split)>0.5:
                    found_symptoms.add(data_sym)
        found_symptoms = list(found_symptoms)
            
        # Show the related symptoms found in the dataset and ask user to select among them
        # select_list = input("\nPlease select the relevant symptoms. Enter indices (separated-space):\n").split()

        # Find other relevant symptoms from the dataset based on user symptoms based on the highest co-occurance with the
        # ones that is input by the user
        dis_list = set()
        self.final_symp = [] 
        counter_list = []
        for idx, itm in enumerate(found_symptoms):
            symp=found_symptoms[idx]
            self.final_symp.append(symp)
            dis_list.update(set(self.df_norm[self.df_norm[symp]==1]['label_dis']))
        
        for dis in dis_list:
            row = self.df_norm.loc[self.df_norm['label_dis'] == dis].values.tolist()
            row[0].pop(0)
            for idx,val in enumerate(row[0]):
                if val!=0 and self.dataset_symptoms[idx] not in self.final_symp:
                    counter_list.append(self.dataset_symptoms[idx])
        
        # Symptoms that co-occur with the ones selected by user              
        dict_symp = dict(Counter(counter_list))
        self.dict_symp_tup = sorted(dict_symp.items(), key=operator.itemgetter(1),reverse=True)
        return found_symptoms


    def getRelatedSymptoms(self):
        found_symptoms=[]
        for tup in self.dict_symp_tup:
            found_symptoms.append(tup[0])
        return found_symptoms

    def addSymptom(self, symptom):
        self.final_symp.append(symptom)
        return self.final_symp

    def removeSymptom(self, symptom):
        if symptom in self.final_symp:
            self.final_symp.remove(symptom)
        return self.final_symp

    def predict(self):
        # Create query vector based on symptoms selected by the user
        sample_x = [0 for x in range(0,len(self.dataset_symptoms))]
        for val in self.final_symp:
            sample_x[self.dataset_symptoms.index(val)]=1
        
        # Predict disease
        lr = LogisticRegression()
        lr = lr.fit(self.X, self.Y)
        prediction = lr.predict_proba([sample_x])

        k = 10
        diseases = list(set(self.Y['label_dis']))
        diseases.sort()
        topk = prediction[0].argsort()[-k:][::-1]

        topk_dict = {}
        # Show top 10 highly probable disease to the user.
        for idx,t in  enumerate(topk):
            match_sym=set()
            row = self.df_norm.loc[self.df_norm['label_dis'] == diseases[t]].values.tolist()
            row[0].pop(0)

            for idx,val in enumerate(row[0]):
                if val!=0:
                    match_sym.add(self.dataset_symptoms[idx])
            prob = (len(match_sym.intersection(set(self.final_symp)))+1)/(len(set(self.final_symp))+1)
            prob *= mean(self.scores)
            topk_dict[t] = prob

        topk_sorted = dict(sorted(topk_dict.items(), key=lambda kv: kv[1], reverse=True))

        diseaseNames = []
        diseaseProbabilities = []

        for key in topk_sorted:
            prob = topk_sorted[key]*100
            diseaseNames.append(diseases[key])
            diseaseProbabilities.append(round(prob, 2))

        predictions = [{"name": d, "probability": p} for d, p in zip(diseaseNames, diseaseProbabilities)]
        return predictions

