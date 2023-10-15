import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

export interface response {
  test: string;
}

function App() {
  const [test2, setTest] = useState<response>();
  const [error, setError] = useState();

  useEffect(() => {
    fetch("/test")
      .then((res) => res.json() as Promise<response>)
      .then(
        (result) => {
          setTest(result);
        },
        (error) => {
          setError(error);
        }
      );
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        {test2?.test}
      </header>
    </div>
  );
}

export default App;
