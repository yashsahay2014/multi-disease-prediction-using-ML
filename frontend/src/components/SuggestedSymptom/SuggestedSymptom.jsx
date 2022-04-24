import React, { Component } from "react";
import "./Symptom.css";

class SuggestedSymptom extends Component {
  constructor(props) {
    super(props);
    this.Symptoms = props.user_symptoms;
    this.state = {
      suggestedSymptoms: ["Loading.."],
      user_symptoms: props.user_symptoms,
      dropdown_style: "dropdown-menu-on",
      searched: "",
    };
  }

  componentDidMount() {
    fetch("http://localhost:5000/co-occuring-symptoms")
      .then(
        (result) => {
          this.setState({
            suggestedSymptoms: result.suggestedSymptoms,
          });
      })
  }
  

  //Adds Symptoms to the UserSymptom state array
  addSymptomButtonEvent = (e) => {
    if (!this.state.user_symptoms.includes(e.target.value)) {
      let user_symptoms = [...this.state.user_symptoms, e.target.value];
      return this.setState({
        user_symptoms, 
      });
    }
  };
  
  //Deletes Symptoms to the UserSymptom state array
  deleteSymptomButtonEvent = (e) => {
    if (this.state.user_symptoms.includes(e.target.value)) {
      let user_symptoms = [...this.state.user_symptoms];
      user_symptoms = user_symptoms.filter((s) => s !== e.target.value);
      this.setState({
        user_symptoms,
      });
    }
  };

  /*Button Events*/
  //Set the state "Searched" according to the input
  getInputSymptoms = (e) => {
    return this.setState({ searched: e.target.value });
  };

  //Set the symptom component
  on_click_reset_button = () => {
  };

  keyDownEvent = (e) => {
    const re = new RegExp(e.target.value.split("").join("\\w*").replace(/\W/, ""), "i");

    const symps = this.Symptoms.filter((each) => {
      return each.match(re);
    });
    if (e.key === "Enter") {
      // eslint-disable-next-line array-callback-return
      return symps.map((key) => {
        if (!this.state.user_symptoms.includes(key) && e.target.value.toLowerCase() === key.toLowerCase()) {
          return this.setState({
              user_symptoms: [...this.state.user_symptoms, key],
          });
        } else if (!this.state.user_symptoms.includes(e.target.value)) {
          for (let i = 0; i < symps.length; i++) {
            if (!this.state.user_symptoms.includes(symps[i])) {
              this.setState({
                  user_symptoms: [...this.state.user_symptoms, symps[i]],
              });
              break;
            }
          }
        }
      });
    }
  };

  showContent = () => {
    // eslint-disable-next-line default-case
    const symps = this.Symptoms.filter((each) => {
      return each.toLowerCase().includes(this.state.searched.toLowerCase());
    });

    return (
      <div id="#Symptoms" className="grid-row width-full">
        <div className="col-12 tablet:grid-col-5">
          {/* <div className="grid-row"> */}
          <input
            class="usa-input searchSymptomsInput"
            onKeyDown={this.keyDownEvent}
            onChange={this.getInputSymptoms}
            placeholder="Search Symptoms"
            id="input-type-text"
            name="input-type-text"
            type="text"
          />
          {/* </div> */}
          {/* <div > */}
          <ul className="symtomsListBox padding-top-2">
            {symps
              .filter((item) => !this.state.user_symptoms.includes(item))
              .map((key, id) => {
                return (
                  <li key={id}>
                    {/* {console.log(key, "key")} */}
                    <button onClick={this.addSymptomButtonEvent.bind(this)} value={key}>
                      {key}
                    </button>
                  </li>
                );
              })}
          </ul>
          {/* </div> */}
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
        <div className="col-12 width-full display-flex flex-row flex-justify-start resetButton padding-left-2">
          <button onClick={this.on_click_reset_button} className="usa-button usa-button--secondary">
            Reset
          </button>
        </div>
      </div>
    );
  };

  render() {
    return <React.Fragment>{this.showContent()}</React.Fragment>;
  }
}

export default SuggestedSymptom;
