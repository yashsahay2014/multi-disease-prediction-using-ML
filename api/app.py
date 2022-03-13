from crypt import methods
from flask import Flask, jsonify, request
from utils import Utils

import warnings
warnings.filterwarnings('ignore')

app = Flask(__name__)
utils = Utils()

@app.route('/')
def home():
    return "Hello, World!"

# @app.route('/initialSymptoms', methods = ['POST'])
# def setInitialSymptoms():
#     symptoms = request.form.get('initial-symptoms', 'fever')

#     return jsonify(
#         matchingSymptoms = utils.setInitialSymptoms(symptoms)
#     )

# @app.route('/suggestions', methods = ['GET'])
# def getSuggestedSymptoms():
#     return jsonify(
#         suggestedSymptoms = utils.getSuggestedSymptoms()
#     )

if __name__ == '__main__':
    app.run(debug=True)
