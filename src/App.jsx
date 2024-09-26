/* eslint-disable react/prop-types */
import { useState } from "react";
import "./App.css";
import { evaluate } from "mathjs";

export default function App() {
  const [output, setOutput] = useState("0");
  const [currentExp, setCurrentExp] = useState("0");
  const [result, setResult] = useState(null);

  const symbolRegex = /[+\-x\/]/gm;
  const decimalRegex = /[.]/gm;
  const endsWithSymbolRegex = /[+\-*\/]$/;
  const endsWithSingleSymbolRegex = /([0-9])([+\-*\/])$/;
  const endsWithTwoSymbolsRegex = /([0-9])([+\-*\/])([+\-*\/])$/;

  const haveSymbol = symbolRegex.test(output);
  const haveDecimal = decimalRegex.test(output);
  const endsWithSymbol = endsWithSymbolRegex.test(currentExp);
  const lastChar = currentExp.slice(currentExp.length - 1, currentExp.length);
  const endsWithSingleSymbol = endsWithSingleSymbolRegex.test(currentExp);
  const endsWithTwoSymbols = endsWithTwoSymbolsRegex.test(currentExp);
  const oneToNine = /[1-9]/;

  function inputNumber(char) {
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

  function inputZero() {
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

  function inputDot() {
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

  function inputSymbol(char) {
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

  function inputAC() {
    setOutput("0");
    setCurrentExp("0");
    setResult(null);
  }

  function inputEquals() {
    const currentResult = evaluate(currentExp);
    setOutput(currentResult);
    setCurrentExp(currentExp.concat("=", currentResult));
    setResult(currentResult);
  }

  function maxChars() {
    if (output.length > 30 || currentExp.length > 30) {
      setOutput("error");
      setCurrentExp("error");
    }
    if (output === "error") {
      setOutput("0");
      setCurrentExp("");
    }
  }

  function handleClick(e) {
    let input = e.target.value;
    let inputType = e.target.className;
    if (oneToNine.test(input)) {
      inputNumber(input);
    } else if (input === "0") {
      inputZero();
    } else if (input === ".") {
      inputDot();
    } else if (inputType === "symbol") {
      inputSymbol(input);
    } else if (input === "AC") {
      inputAC();
    } else if (input === "=") {
      inputEquals();
    }
    maxChars();
  }

  return (
    <div id="main">
      <Calculator
        output={output}
        currentExp={currentExp}
        handleClick={handleClick}
      />
    </div>
  );
}

function Calculator({ output, currentExp, handleClick }) {
  return (
    <div id="calculator">
      <div id="display-wrapper">
        <Display output={output} currentExp={currentExp} />
      </div>
      <div id="num-pad">
        <NumPad handleClick={handleClick} />
      </div>
    </div>
  );
}

function Display({ output, currentExp }) {
  return (
    <>
      <div id="result">{currentExp}</div>
      <div id="display">{output}</div>
    </>
  );
}

function NumPad({ handleClick }) {
  return (
    <>
      <button id="equals" value="=" onClick={(e) => handleClick(e)}>
        =
      </button>
      <button
        className="number"
        id="zero"
        value="0"
        onClick={(e) => handleClick(e)}
      >
        0
      </button>
      <button
        className="number"
        id="one"
        value="1"
        onClick={(e) => handleClick(e)}
      >
        1
      </button>
      <button
        className="number"
        id="two"
        value="2"
        onClick={(e) => handleClick(e)}
      >
        2
      </button>
      <button
        className="number"
        id="three"
        value="3"
        onClick={(e) => handleClick(e)}
      >
        3
      </button>
      <button
        className="number"
        id="four"
        value="4"
        onClick={(e) => handleClick(e)}
      >
        4
      </button>
      <button
        className="number"
        id="five"
        value="5"
        onClick={(e) => handleClick(e)}
      >
        5
      </button>
      <button
        className="number"
        id="six"
        value="6"
        onClick={(e) => handleClick(e)}
      >
        6
      </button>
      <button
        className="number"
        id="seven"
        value="7"
        onClick={(e) => handleClick(e)}
      >
        7
      </button>
      <button
        className="number"
        id="eight"
        value="8"
        onClick={(e) => handleClick(e)}
      >
        8
      </button>
      <button
        className="number"
        id="nine"
        value="9"
        onClick={(e) => handleClick(e)}
      >
        9
      </button>
      <button
        className="symbol"
        id="add"
        value="+"
        onClick={(e) => handleClick(e)}
      >
        +
      </button>
      <button
        className="symbol"
        id="subtract"
        value="-"
        onClick={(e) => handleClick(e)}
      >
        -
      </button>
      <button
        className="symbol"
        id="multiply"
        value="x"
        onClick={(e) => handleClick(e)}
      >
        x
      </button>
      <button
        className="symbol"
        id="divide"
        value="/"
        onClick={(e) => handleClick(e)}
      >
        /
      </button>
      <button
        className="number"
        id="decimal"
        value="."
        onClick={(e) => handleClick(e)}
      >
        .
      </button>
      <button id="clear" value="AC" onClick={(e) => handleClick(e)}>
        AC
      </button>
    </>
  );
}

