
import React, { Component } from "react";
import parse from 'html-react-parser';
import "./Symptom.css";

class PredictedDisease extends Component {
    constructor(props) {
        super(props);

        this.state = {
            Symptoms: [],
            searched: '',
            user_symptoms: [],
            wikiData: '',
        };

        fetch('http://127.0.0.1:5000/predict-disease', {
            method: 'GET',
        })
        .then(response => response.json())
        .then(predictedDisease => {
            this.setState({
                Symptoms: predictedDisease.predictedDiseases,
            });
        });

        this.getValue = this.getValue.bind(this);
        this.showWikiData = this.showWikiData.bind(this);
    }

    //Adds Symptoms to the UserSymptom state array
    
    showWikiData = (disease) => {
        let formData = new FormData();
        formData.append('disease', disease);
        fetch('http://127.0.0.1:5000/disease-details', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(wikiData => {
            this.setState({
                wikiData: wikiData.details,
            });
        });
    }

    //Deletes Symptoms to the UserSymptom state array
    deleteSymptomButtonEvent = (e) => {
        if (this.state.user_symptoms.includes(e.target.value)) {
            let user_symptoms = [...this.state.user_symptoms];
            user_symptoms = user_symptoms.filter((s) => s !== e.target.value);
            this.setState({ user_symptoms: user_symptoms });
            this.props.addCooccuringSymptom(user_symptoms);
        }
    };

    //Set the state "Searched" according to the input
    getInputSymptoms = (e) => {
        return this.setState({ searched: e.target.value });
    };

    //Set the symptom component

    on_click_reset_button = () => {
    return this.setState(
        {
        user_symptoms: [],
        disease_with_possibility: [],
        });
    };

    getValue = (key) => {
        return key;
    }

    showContent = () => {
        console.log('predicted disease', this.state.Symptoms);
        let Diseases = [];
        let Probabilities = [];
        this.state.Symptoms.forEach((disease, index) => {
            Diseases.push(disease.name);
            Probabilities.push(disease.probability);
        });
        return (
            <>
                <h3>Predicted Diseases</h3>
                    <div id="#Symptoms" className="grid-row width-full">
                        {Diseases.length === 0 
                        ? <p>Loading...</p>
                        : <div className="col-12 tablet:grid-col-5">
                            <ul className="symtomsListBox padding-top-2">
                                {Diseases.map((disease, index) => {
                                    return (
                                        <li key={index}>
                                            <button onClick={() => this.showWikiData(disease)} value={disease}>
                                                {`${disease} - ${Probabilities[index]}%`}
                                            </button>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>}
                        <div className="col-12 tablet:grid-col-5" style={{whiteSpace: "pre-wrap"}}>
                            {parse(this.state.wikiData)}
                        </div>
                    </div>
            </>
        );
    };

    render() {
        return <React.Fragment>{this.showContent()}</React.Fragment>;
    }
}

export default PredictedDisease;
        