from flask import Flask, jsonify, request
from diseasePredictor import DiseasePredictor
from treatment import diseaseDetail

import warnings
warnings.filterwarnings('ignore')

app = Flask(__name__)
diseasePredictor = DiseasePredictor()

@app.route('/')
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

@app.route('/add-symptom', methods = ['PUT'])
def addSymptom():
    symptom = request.form.get('symptom')
    return jsonify (
        symptoms = diseasePredictor.addSymptom(symptom)
    )
 
@app.route('/remove-symptom', methods = ['DELETE'])
def removeSymptom():
    symptom = request.form.get('symptom')
    return jsonify (
        symptoms = diseasePredictor.removeSymptom(symptom)
    )

@app.route('/predict-disease', methods = ['GET'])
def getDiseasePrediction():
    return jsonify (
        predictedDiseases = diseasePredictor.predict(),
    )

@app.route('/disease-details', methods=['GET'])
def getDiseaseDetail():
    disease = request.form.get('disease')
    return jsonify (
        details = diseaseDetail(disease)
    )

if __name__ == '__main__':
    app.run(debug=True)
