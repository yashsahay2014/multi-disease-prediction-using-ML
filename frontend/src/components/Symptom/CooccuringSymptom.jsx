

import React, { Component } from "react";

import "./Symptom.css";

class Symptom extends Component {
    constructor(props) {
        super(props);

        this.state = {
            Symptoms: ['test'],
            searched: '',
            user_symptoms: [],
        };

        fetch('http://127.0.0.1:5000/co-occuring-symptoms', {
            method: 'GET',
        })
        .then(response => response.json())
        .then(cooccuringSymptom => {
            this.setState({
                Symptoms: cooccuringSymptom.suggestedSymptoms,
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

    keyDownEvent = (e) => {
        const re = new RegExp(e.target.value.split("").join("\\w*").replace(/\W/, ""), "i");

        const symps = this.state.Symptoms.filter((each) => {
            return each.match(re);
        });
        if (e.key === "Enter") {
            // eslint-disable-next-line array-callback-return
            return symps.map((key) => {
                if (!this.state.user_symptoms.includes(key) && e.target.value.toLowerCase() === key.toLowerCase()) {
                    return this.setState(
                    {
                        user_symptoms: [...this.state.user_symptoms, key],
                    });
                } else if (!this.state.user_symptoms.includes(e.target.value)) {
                    for (let i = 0; i < symps.length; i++) {
                    if (!this.state.user_symptoms.includes(symps[i])) {
                        this.setState(
                        {
                            user_symptoms: [...this.state.user_symptoms, symps[i]],
                        });
                        break;
                    }
                    }
                }
            });
        }
    };

    getValue = (key) => {
        return key;
    }

    showContent = () => {
        const symps = this.state.Symptoms.filter((each) => {
            return each.toLowerCase().includes(this.state.searched.toLowerCase());
        });

        symps.push(this.state.searched.toLowerCase());
        return (
            <>
                <h3>Cooccuring symptoms</h3>
                <div id="#Symptoms" className="grid-row width-full">
                    
                <div className="col-12 tablet:grid-col-5">
                    <input
                    class="usa-input searchSymptomsInput"
                    onKeyDown={this.keyDownEvent}
                    onChange={this.getInputSymptoms}
                    placeholder="Search Symptoms"
                    id="input-type-text"
                    name="input-type-text"
                    type="text"
                    />
                    <ul className="symtomsListBox padding-top-2">
                    {symps
                        // .filter((item) => !this.state.Symptoms.includes(item))
                        .map((key, id) => {
                        return (
                            <li key={id}>
                            <button onClick={this.addSymptomButtonEvent.bind(this)} value={key}>
                                {key}
                            </button>
                            </li>
                        )
                        })}
                    </ul>
                </div>
                <div className="col-12 tablet:grid-col-7 padding-top-2 UserSymptoms">
                    <ul>
                    {this.state.user_symptoms.map((key, id) => (
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

export default Symptom;
        