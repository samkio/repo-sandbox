import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { ExampleType } from "shared";

function App() {
  // Very basic dependency to verify depenent local packages are built.
  const value: ExampleType = {
    numberField: 123,
    stringField: "exampleValue",
  };

  console.log({
    ...value,
    environmentVariable: process.env.REACT_APP_ENVIRONMENT_VARIABLE,
  });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
