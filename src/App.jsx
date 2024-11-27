/* eslint-disable react/prop-types */
import { useState } from "react";
import "./App.css";
import { evaluate } from "mathjs";

export default function App() {
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

  function numberInput(char) {
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

  function zeroInput() {
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

  function dotInput() {
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

  function symbolInput(char) {
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

  function acInput() {
    setOutput("0");
    setCurrentExp("0");
    setResult(null);
  }

  function equalsInput() {
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
      numberInput(input);
    } else if (input === "0") {
      zeroInput();
    } else if (input === ".") {
      dotInput();
    } else if (inputType === "symbol") {
      symbolInput(input);
    } else if (input === "AC") {
      acInput();
    } else if (input === "=") {
      equalsInput();
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
      <div id="numpad-wrapper">
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
  const buttonSequence = [
    { type: null, buttonId: "equals", content: "=" },
    { type: "number", buttonId: "zero", content: "0" },
    { type: "number", buttonId: "one", content: "1" },
    { type: "number", buttonId: "two", content: "2" },
    { type: "number", buttonId: "three", content: "3" },
    { type: "number", buttonId: "four", content: "4" },
    { type: "number", buttonId: "five", content: "5" },
    { type: "number", buttonId: "six", content: "6" },
    { type: "number", buttonId: "seven", content: "7" },
    { type: "number", buttonId: "eight", content: "8" },
    { type: "number", buttonId: "nine", content: "9" },
    { type: "symbol", buttonId: "add", content: "+" },
    { type: "symbol", buttonId: "subtract", content: "-" },
    { type: "symbol", buttonId: "multiply", content: "x" },
    { type: "symbol", buttonId: "divbuttonIde", content: "/" },
    { type: "number", buttonId: "decimal", content: "." },
    { type: null, buttonId: "clear", content: "AC" },
  ];
  return (
    <ul id="numpad">
      {buttonSequence.map(({ type, buttonId, content }) => {
        return (
          <li className={type} id={buttonId} key={buttonId}>
            <CalcButton
              type={type}
              buttonId={buttonId}
              content={content}
              handleClick={handleClick}
            />
          </li>
        );
      })}
    </ul>
  );
}

function CalcButton({ type, buttonId, content, handleClick }) {
  return (
    <button
      className={type}
      id={buttonId}
      value={content}
      onClick={(e) => handleClick(e)}
    >
      {content}
    </button>
  );
}
