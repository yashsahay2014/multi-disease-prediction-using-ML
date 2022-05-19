# importing required libraries
from sklearn.metrics import classification_report
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.metrics import confusion_matrix
import warnings
from decimal import Decimal
import pandas as pd
from sklearn.metrics import confusion_matrix
from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.model_selection import GridSearchCV
from sklearn.naive_bayes import MultinomialNB
from sklearn.ensemble import RandomForestClassifier
from sklearn.neural_network import MLPClassifier
# from xgboost import XGBClassifier
import matplotlib.pyplot as plt
import seaborn as sn
warnings.simplefilter("ignore")

# reading dataset as dataframe 'df'
df_comb = pd.read_csv("Dataset/dis_sym_dataset_comb.csv")
# df = pd.DataFrame(data,columns=['A','B','C'])

# obtaining Correlation matrix
# corrMatrix = df.corr()
# # print (corrMatrix)
# sn.heatmap(corrMatrix, annot=True)
# plt.show()

# creation of features and label for training the models
X = df_comb.iloc[:, 1:]
Y = df_comb.iloc[:, 0:1]

# """*Train Test Split*"""

# splitting data for training the classifiers and testing
x_train, x_test, y_train, y_test = train_test_split(
    X, Y, test_size=0.20, random_state=1)


# using LR Classifier
lr = LogisticRegression()
lr = lr.fit(x_train, y_train)
# prediction of labels for the test data
y_pred = lr.predict(x_test)
acc_lr = round(Decimal(accuracy_score(y_test, y_pred) * 100), 2)
print(f"Accuracy (LR) : {acc_lr}%")

# obtaining confusion matrix
confusion = confusion_matrix(y_test, y_pred)
print('Confusion Matrix\n')
print(confusion)


# obtaining accuracy_score, precision_score, recall_score, f1_score
print('\nAccuracy: {:.2f}\n'.format(accuracy_score(y_test, y_pred)))

print('Micro Precision: {:.2f}'.format(
    precision_score(y_test, y_pred, average='micro')))
print('Micro Recall: {:.2f}'.format(
    recall_score(y_test, y_pred, average='micro')))
print(
    'Micro F1-score: {:.2f}\n'.format(f1_score(y_test, y_pred, average='micro')))

print('Macro Precision: {:.2f}'.format(
    precision_score(y_test, y_pred, average='macro')))
print('Macro Recall: {:.2f}'.format(
    recall_score(y_test, y_pred, average='macro')))
print(
    'Macro F1-score: {:.2f}\n'.format(f1_score(y_test, y_pred, average='macro')))

print('Weighted Precision: {:.2f}'.format(
    precision_score(y_test, y_pred, average='weighted')))
print('Weighted Recall: {:.2f}'.format(
    recall_score(y_test, y_pred, average='weighted')))
print(
    'Weighted F1-score: {:.2f}'.format(f1_score(y_test, y_pred, average='weighted')))
