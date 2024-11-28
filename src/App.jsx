/* eslint-disable react/prop-types */
import { useState } from "react";
import { evaluate } from "mathjs";
import "./App.css";
import Display from "./components/Display";
import NumPad from "./components/NumPad";

export default function App() {
  // VARIABLE DEFINITIONS

  const [output, setOutput] = useState("0");
  const [currentExp, setCurrentExp] = useState("0");
  const [result, setResult] = useState(null);

  const symbolRegex = /[+\-x/]/gm;
  const decimalRegex = /[.]/gm;
  const endsWithSymbolRegex = /[+\-*/]$/;
  const endsWithSingleSymbolRegex = /([0-9])([+\-*/])$/;
  const endsWithTwoSymbolsRegex = /([0-9])([+\-*/])([+\-*/])$/;

  const haveSymbol = symbolRegex.test(output);
  const haveDecimal = decimalRegex.test(output);
  const endsWithSymbol = endsWithSymbolRegex.test(currentExp);
  const lastChar = currentExp.slice(currentExp.length - 1, currentExp.length);
  const endsWithSingleSymbol = endsWithSingleSymbolRegex.test(currentExp);
  const endsWithTwoSymbols = endsWithTwoSymbolsRegex.test(currentExp);
  const oneToNine = /[1-9]/;

  // HANDLERS

  function handleNumberInput(char) {
    if (result == null) {
      if (output === "0") {
        setOutput(char);
        setCurrentExp(char);
      }
      if (output !== "0") {
        if (haveSymbol === false) {
          setOutput(output.concat(char));
        } else {
          setOutput(char);
        }
        setCurrentExp(currentExp.concat(char));
      }
    } else {
      setOutput(char);
      setCurrentExp(char);
      setResult(null);
    }
  }

  function handleZeroInput() {
    if (result == null) {
      if (output === "0") {
        setCurrentExp("0");
      }
      if (output !== "0") {
        if (haveSymbol === false) {
          setOutput(output.concat("0"));
          setCurrentExp(currentExp.concat("0"));
        }
        if (haveSymbol === true) {
          setOutput("0");
        }
      }
    } else {
      setOutput("0");
      setCurrentExp("0");
      setResult(null);
    }
  }

  function handleDotInput() {
    if (result == null) {
      if (output === "0" && endsWithSymbol === false) {
        setOutput("0.");
        setCurrentExp("0.");
      }
      if (output === "0" && endsWithSymbol === true) {
        setOutput("0.");
        setCurrentExp(currentExp.concat("0."));
      }
      if (output !== "0") {
        if (haveSymbol === true) {
          setOutput("0.");
          setCurrentExp(currentExp.concat("0."));
        }
        if (haveSymbol === false) {
          if (haveDecimal === true) {
            return;
          } else {
            setOutput(output.concat("."));
            setCurrentExp(currentExp.concat("."));
          }
        }
      }
    } else {
      setOutput("0.");
      setCurrentExp("0.");
      setResult(null);
    }
  }

  function handleSymbolInput(char) {
    if (result == null) {
      if (
        currentExp === "" ||
        currentExp === "+" ||
        currentExp === "-" ||
        currentExp === "*" ||
        currentExp === "/"
      ) {
        if (char === "x") {
          setOutput("*");
          setCurrentExp("*");
        } else {
          setOutput(char);
          setCurrentExp(char);
        }
      } else {
        if (endsWithSingleSymbol === true) {
          if (char === "+" || char === "/") {
            setOutput(char);
            setCurrentExp(currentExp.slice(0, currentExp.length - 1) + char);
          }
          if (char === "x") {
            setOutput("*");
            setCurrentExp(currentExp.slice(0, currentExp.length - 1) + "*");
          }
          if (char === "-") {
            setOutput(char);
            setCurrentExp(currentExp.concat("-"));
          }
        } else if (endsWithTwoSymbols === true) {
          if (lastChar === "-") {
            if (char === "-") {
              return;
            }
            if (char === "+" || char === "/") {
              setOutput(char);
              setCurrentExp(currentExp.slice(0, currentExp.length - 2) + char);
            }
            if (char === "x") {
              setOutput("*");
              setCurrentExp(currentExp.slice(0, currentExp.length - 2) + "*");
            }
          }
        } else {
          if (char === "+" || char === "-" || char === "/") {
            setOutput(char);
            setCurrentExp(currentExp.concat(char));
          }
          if (char === "x") {
            setOutput("*");
            setCurrentExp(currentExp.concat("*"));
          }
        }
      }
    } else {
      if (char === "x") {
        setOutput(char);
        setCurrentExp(result + "*");
        setResult(null);
      } else {
        setOutput(char);
        setCurrentExp(result + char);
        setResult(null);
      }
    }
  }

  function handleAcInput() {
    setOutput("0");
    setCurrentExp("0");
    setResult(null);
  }

  function handleEqualsInput() {
    const currentResult = evaluate(currentExp);
    setOutput(currentResult);
    setCurrentExp(currentExp.concat("=", currentResult));
    setResult(currentResult);
  }

  function handleNumpadClick(e) {
    let input = e.target.value;
    let inputType = e.target.className;
    function maxChars() {
      if (output.length > 25) {
        setOutput("error");
        setCurrentExp("error");
      }
      if (output === "error") {
        setOutput("0");
        setCurrentExp("");
      }
    }
    if (oneToNine.test(input)) {
      handleNumberInput(input);
    } else if (input === "0") {
      handleZeroInput();
    } else if (input === ".") {
      handleDotInput();
    } else if (inputType === "symbol") {
      handleSymbolInput(input);
    } else if (input === "AC") {
      handleAcInput();
    } else if (input === "=") {
      handleEqualsInput();
    }
    maxChars();
  }

  return (
    <div id="calculator">
      <div id="display-wrapper">
        <Display output={output} currentExp={currentExp} />
      </div>
      <div id="numpad-wrapper">
        <NumPad handleNumpadClick={handleNumpadClick} />
      </div>
    </div>
  );
}
