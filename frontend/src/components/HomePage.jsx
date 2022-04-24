import React, { Component } from "react";
import Navbar from "./Navbar";
import "./HomePage.css";
import Home from "./Home/Home";
import Patient from "./Patient/Patient1";
import Patient2 from "./Patient/Patient2";
import Symptom from "./Symptom/Symptom";
import Disease from "./Disease/Disease";
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
    };
    this.symptomPage = React.createRef();
    this.setSymptom = this.setSymptom.bind(this);
  }

  home_button_check_event = (e) => {
    // console.log("Event Called");
    if (e.target.checked === true) {
      return this.setState({ button_is_disabled: false, home_button_checked: true, home_nav_value: true, patient_nav_value: true });
    } else if (e.target.checked === false) {
      return this.setState({ button_is_disabled: true, home_button_checked: false, home_nav_value: false, patient_nav_value: false });
    }
  };

  get_next_page = (e) => {
    // eslint-disable-next-line default-case
    switch (this.state.current_page) {
      case "Symptom":
        console.log(this.state.user_symptoms);
        let symptomsToSend = "";
        this.state.user_symptoms.forEach(symptom => {
          symptomsToSend = symptomsToSend + ", "+ symptom;
        })
        
        symptomsToSend = symptomsToSend.slice(2, symptomsToSend.length);
        
        console.log(symptomsToSend)
        
        let formData = new FormData();
        formData.append('initial-symptoms', symptomsToSend);
        fetch('http://127.0.0.1:5000/initial-symptoms', {
          method: 'POST',
          body: formData,
        });

        return this.setState({
          current_page: "Disease",
          button_name: "Retry",
          tab_progress: 100,
          // symptom_nav_icon: <CheckIcon className={"check-icon"} style={{ color: "white!important" }} />,
          // disease_nav_icon: <CheckIcon className={"check-icon"} style={{ color: "white!important" }} />,
          symptom_nav_value: true,
          disease_nav_value: true,
        });
      case "Disease":
        return this.setState({
          tab_progress: 25,
          current_page: "Home", // Name of the current component
          button_is_disabled: true, // Next button disabled if not agreed to terms
          home_button_checked: false, //Check if terms are agreed
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
        });
    }
  };
  get_gender = (e) => {
    // console.log("slf", e.target.value);
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
  showPage = (e) => {
    const { current_page, home_button_checked, age, male, female } = this.state;
    // eslint-disable-next-line default-case
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
      case "Disease":
        return <Disease patientInfo={this.state.patient_question} disease_with_possibility={this.state.disease_possibility} gender={this.state.gender} age={this.state.age} />;
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
