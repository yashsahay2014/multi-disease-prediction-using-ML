from array import array
from crypt import methods
from flask import Flask, jsonify, request
from diseasePredictor import DiseasePredictor
from treatment import diseaseDetail
from flask_cors import CORS

import warnings
warnings.filterwarnings('ignore')

app = Flask(__name__)
cors = CORS(app, resources={r'/*': {'origins': '*'}})
diseasePredictor = DiseasePredictor()

@app.route('/', methods = ['GET'])
def home():
    return "Hello, World!"

@app.route('/initial-symptoms', methods = ['POST'])
def setInitialSymptoms():
    symptoms = request.form.get('initial-symptoms')

    return jsonify(
        matchingSymptoms = diseasePredictor.setInitialSymptoms(symptoms)
    )

@app.route('/co-occuring-symptoms', methods = ['GET'])
def getRelatedSymptoms():
    return jsonify(
        suggestedSymptoms = diseasePredictor.getRelatedSymptoms()
    )

@app.route('/set-symptom', methods = ['PUT'])
def setSymptom():
    symptom = request.form.get('symptom')
    array_of_symptoms = symptom.split(',')
    return jsonify (
        symptoms = diseasePredictor.setSymptom(array_of_symptoms)
    )

@app.route('/predict-disease', methods = ['GET'])
def getDiseasePrediction():
    return jsonify (
        predictedDiseases = diseasePredictor.predict(),
    )

@app.route('/disease-details', methods=['POST'])
def getDiseaseDetail():
    disease = request.form.get('disease')
    return jsonify (
        details = diseaseDetail(disease)
    )

if __name__ == '__main__':
    app.run(debug=True)
