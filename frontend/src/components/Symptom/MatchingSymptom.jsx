import React, { Component } from "react";
import { Symptoms } from "../../data/Symptoms";
import "./Symptom.css";

class Symptom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gender: this.props.gender,
      age: this.props.age,
      user_symptoms: this.props.matchingSymptoms,
      disease_with_possibility: this.props.diseasePossibility,
      dropdown_style: "dropdown-menu-on",
      searched: "",
    };
    this.getValue = this.getValue.bind(this);
  }

  //Adds Symptoms to the UserSymptom state array

  addSymptomButtonEvent = (e) => {
    if (!this.state.user_symptoms.includes(e.target.value)) {
      let user_symptoms = [...this.state.user_symptoms, e.target.value];
      this.props.setMatchingSymptoms(user_symptoms);
      return this.setState({ user_symptoms: user_symptoms });
    }
  };
  //Deletes Symptoms to the UserSymptom state array
  deleteSymptomButtonEvent = (e) => {
    if (this.state.user_symptoms.includes(e.target.value)) {
      let user_symptoms = [...this.state.user_symptoms];
      user_symptoms = user_symptoms.filter((s) => s !== e.target.value);
      this.setState({ user_symptoms: user_symptoms });
      this.props.setMatchingSymptoms(user_symptoms);
    }
  };


  /*Button Events*/

  //Set the state "Searched" according to the input
  getInputSymptoms = (e) => {
    return this.setState({ searched: e.target.value });
  };

  //Set the symptom component

  onClickSetSymptoms = () => {
    let formData = new FormData();
    const symptomsToSend = this.state.user_symptoms.toString();
    
    formData.append('symptom', symptomsToSend);
    fetch('http://127.0.0.1:5000/set-symptom', {
      method: 'PUT',
      body: formData,
    })
  };

  keyDownEvent = (e) => {
    const re = new RegExp(e.target.value.split("").join("\\w*").replace(/\W/, ""), "i");

    const symps = Symptoms.filter((each) => {
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
    // eslint-disable-next-line default-case
    const symps = Symptoms.filter((each) => {
      return each.toLowerCase().includes(this.state.searched.toLowerCase());
    });
    symps.push(this.state.searched.toLowerCase());
    return (
      <>
        <div id="#Symptoms" className="grid-row width-full">
          <h3>Matching Symptoms</h3>
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
        <button style={{height: 30}}onClick={this.onClickSetSymptoms}>Set matching symptoms</button>
      </>
    );
  };

  render() {
    return <React.Fragment>{this.showContent()}</React.Fragment>;
  }
}

export default Symptom;
