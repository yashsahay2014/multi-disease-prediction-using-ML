

import React, { Component } from "react";

import "./Symptom.css";

class PredictedDisease extends Component {
    constructor(props) {
        super(props);

        this.state = {
            Symptoms: ['test'],
            searched: '',
            user_symptoms: [],
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
    }

    //Adds Symptoms to the UserSymptom state array

    addSymptomButtonEvent = (e) => {
    if (!this.state.user_symptoms.includes(e.target.value)) {
        let user_symptoms = [...this.state.user_symptoms, e.target.value];
        this.props.addCooccuringSymptom(user_symptoms);
        return this.setState({ user_symptoms: user_symptoms });
    }
    };
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
                
                <div className="col-12 tablet:grid-col-5">
                    <ul>
                        {Diseases.map((key, id) => (
                            <li key={id}>
                                {key}{" "}
                            <button onClick={this.deleteSymptomButtonEvent.bind(this)} key={id} value={key}>
                                X
                            </button>
                            </li>
                        ))}
                    </ul>

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
        