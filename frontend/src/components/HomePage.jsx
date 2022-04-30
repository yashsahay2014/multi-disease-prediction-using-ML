import React, { Component } from "react";
import Navbar from "./Navbar";
import "./HomePage.css";
import Symptom from "./Symptom/Symptom";
import MatchingSymptom from './Symptom/MatchingSymptom';
import CooccuringSymptom from './Symptom/CooccuringSymptom';
import PredictedDisease from './Symptom/PredictedDisease';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current_page: "Symptom", // Name of the current component
      tab_name: "Welcome",
      tab_progress: 25,
      button_is_disabled: false, // Next button disabled if not agreed to terms
      home_button_checked: true, //Check if terms are agreed
      age: "18", //Patient Default Age
      button_name: "Next", //Button name retry or next
      gender: "Male", //Default gender
      male: true, // patient checkbox
      female: false, // patient checkbox
      home_nav_icon: <p>1</p>,
      patient_nav_icon: <p>2</p>,
      symptom_nav_icon: <p>3</p>,
      disease_nav_icon: <p>4</p>,
      patient_question: [],
      patient_2_next_button_disabled: "",
      home_nav_value: false,
      patient_nav_value: false,
      symptom_nav_value: false,
      disease_nav_value: false,
      disease_possibility: [],
      user_symptoms: [],
      user_symptom_length: "",
      matchingSymptoms: [],
      cooccuringSymptoms: [],
    };
    this.symptomPage = React.createRef();
    this.setSymptom = this.setSymptom.bind(this);
    this.addCooccuringSymptom = this.addCooccuringSymptom.bind(this);
    this.setMatchingSymptoms = this.setMatchingSymptoms.bind(this);
    this.getFinalSymptoms = this.getFinalSymptoms.bind(this);
  }

  home_button_check_event = (e) => {
    if (e.target.checked === true) {
      return this.setState({ button_is_disabled: false, home_button_checked: true, home_nav_value: true, patient_nav_value: true });
    } else if (e.target.checked === false) {
      return this.setState({ button_is_disabled: true, home_button_checked: false, home_nav_value: false, patient_nav_value: false });
    }
  };

  get_next_page = (e) => {
    switch (this.state.current_page) {
      case "Symptom":
        let symptomsToSend = "";
        this.state.user_symptoms.forEach(symptom => {
          symptomsToSend = symptomsToSend + ", "+ symptom;
        })
        
        symptomsToSend = symptomsToSend.slice(2, symptomsToSend.length);
        
        let formData = new FormData();
        formData.append('initial-symptoms', symptomsToSend);
        fetch('http://127.0.0.1:5000/initial-symptoms', {
          method: 'POST',
          body: formData,
        })
        .then(response => response.json())
        .then(matchingSymptoms => {
           this.setState({
            current_page: "MatchingSymptom",
            button_name: "Next",
            tab_progress: 33,
            matchingSymptoms: matchingSymptoms.matchingSymptoms,
            symptom_nav_value: true,
            disease_nav_value: true,
          });
        });
        return;

      case "MatchingSymptom":
        return this.setState({
          current_page: "CooccuringSymptom",
          button_name: "Next",
          tab_progress: 66,
          symptom_nav_value: true,
          disease_nav_value: true,
        });
      case "CooccuringSymptom":
        return this.setState({
          current_page: "PredictedDisease",
          button_name: "Next",
          tab_progress: 100,
        });
    }
  };
  get_gender = (e) => {
    if (e.target.value === "male") {
      this.setState({
        male: true,
        female: false,
        gender: "Male",
      });
    } else if (e.target.value === "female") {
      this.setState({
        male: false,
        female: true,
        gender: "Female",
      });
    }
  };
  get_age_event = (e) => {
    this.setState({ age: e.target.value });
  };
  symptomInfoCallback = (data, data2) => {
    this.setState({
      disease_possibility: data,
      user_symptoms: data2,
      user_symptom_length: data2.length,
    });
  };

  patient_2_callback = (data) => {
    let d = data.filter((key) => {
      return key.answer !== "";
    });
    let avl = data.length !== d.length;
    this.setState({
      patient_question: data,
      patient_2_next_button_disabled: avl,
      symptom_nav_value: true,
    });
  };
  home_button_check_event = (e) => {
    if (e.target.checked === true) {
      return this.setState({ button_is_disabled: false, home_button_checked: true, home_nav_value: true, patient_nav_value: true });
    } else if (e.target.checked === false) {
      return this.setState({ button_is_disabled: true, home_button_checked: false, home_nav_value: false, patient_nav_value: false });
    }
  };
  handleResetClick = () => {};
  get_previous_page = (e) => {
    // eslint-disable-next-line default-case
    switch (this.state.current_page) {
      case "Disease":
        return this.setState({
          current_page: "Symptom",
          button_name: "Finish",
          tab_progress: 75,
          disease_nav_value: false,
          user_symptom_length: this.state.user_symptoms.length,
        });
      case "Symptom":
        return this.setState({
          current_page: "Patient-2",
          symptom_page_button: "",
          tab_progress: 50,
          button_name: "Next",
          patient_nav_value: false,
          patient_2_next_button_disabled: false,
          disease_possibility: [],
          user_symptoms: [],
        });
    }
  };
  setSymptom(symptoms) {
    this.setState({user_symptoms: symptoms});
  }

  addCooccuringSymptom(symptoms) {
    console.log(symptoms);
    this.setState({cooccuringSymptoms: symptoms});
  }

  setMatchingSymptoms(symptoms) {
    console.log(symptoms);
    console.log(this.state.matchingSymptoms);
    this.setState({matchingSymptoms: symptoms});
  }

  getFinalSymptoms() {
    console.log([...this.state.matchingSymptoms, ...this.state.cooccuringSymptoms]);
    return [...this.state.matchingSymptoms, ...this.state.cooccuringSymptoms];
  }

  showPage = (e) => {
    const { current_page, home_button_checked, age, male, female } = this.state;
    switch (current_page) {
      case "Symptom":
        return (
          <Symptom
            ref={this.symptomPage}
            userSymptoms={this.state.user_symptoms}
            setSymptom={this.setSymptom}
            diseasePossibility={this.state.disease_possibility}
            getPossibleDisease={this.symptomInfoCallback}
            pageCallback={this.symptom_page_button_callback}
          />
        );
      case "MatchingSymptom":
        return (
          <MatchingSymptom 
            matchingSymptoms={this.state.matchingSymptoms}
            setMatchingSymptoms={this.setMatchingSymptoms}
          />
        );
      case "CooccuringSymptom":
        return (
          <CooccuringSymptom 
            addCooccuringSymptom={this.addCooccuringSymptom}
          />
        );
      case "PredictedDisease":
        return (
          <PredictedDisease 
            symptomList={this.getFinalSymptoms}
          />
        );
    }
  };
  renderResetButton = () => {
    return (
      <button className="usa-button usa-button--secondary" onClick={this.symptomPage.current}>
        Reset
      </button>
    );
  };
  render() {
    const { tab_progress, button_is_disabled, patient_2_next_button_disabled, user_symptom_length, current_page } = this.state;
    return (
      <React.Fragment>
        <Navbar />
        <main id="main-content">
          <div className="grid-container padding-bottom-4">
            <div className="grid-row padding-4">
              <div className="desktop:grid-col-2">
                <ul className="side-menu-list padding-left-2">
				  <li id="progressbar"><div className={`${tab_progress === 25 && "progressbardiv25"} ${tab_progress === 50 && "progressbardiv50"} ${tab_progress === 75 && "progressbardiv75"} ${tab_progress === 100 && "progressbardiv100"}`}></div></li>
                  <li className={`${tab_progress === 33 && "active"} ${tab_progress < 33 && "list"} ${tab_progress > 50 && "done"}`}>Symptom</li>
                  <li className={`${tab_progress === 100 && "active"} ${tab_progress < 100 && "list"} ${tab_progress > 100 && "done"}`}>Disease</li>
                </ul>
              </div>
              <div className="desktop:grid-col-10" id="ContentDiv padding-bottom-3">
                <div className="grid-row padding-bottom-4 shoPageSection">{this.showPage()}</div>
              </div>
              <div className="desktop:grid-col-12">
                <div id="buttonsSection" className="grid-row display-flex padding-left-2 padding-right-2 padding-top-2">
                  <button disabled={this.state.current_page === "Home"} onClick={this.get_previous_page} className="usa-button usa-button--outline back">
                    Back
                  </button>
                  {/* {current_page === "Symptom" ? this.renderResetButton() : ""} */}
                  <button
                    className={`usa-button ${button_is_disabled || patient_2_next_button_disabled || user_symptom_length === 0 ? "" : "next"}`}
                    disabled={ user_symptom_length === 0}
                    type="submit"
                    onClick={this.get_next_page}
                  >
                    {this.state.button_name}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </React.Fragment>
    );
  }
}

export default HomePage;
