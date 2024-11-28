/* eslint-disable react/prop-types */
import CalcButton from "./CalcButton";

export default function NumPad({ handleNumpadClick }) {
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
              handleNumpadClick={handleNumpadClick}
            />
          </li>
        );
      })}
    </ul>
  );
}
