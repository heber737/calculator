/* eslint-disable react/prop-types */
export default function Display({ output, currentExp }) {
  return (
    <>
      <div id="result">{currentExp}</div>
      <div id="display">{output}</div>
    </>
  );
}
