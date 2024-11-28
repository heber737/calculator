/* eslint-disable react/prop-types */
export default function CalcButton({
  type,
  buttonId,
  content,
  handleNumpadClick,
}) {
  return (
    <button
      className={type}
      id={buttonId}
      value={content}
      onClick={(e) => handleNumpadClick(e)}
    >
      {content}
    </button>
  );
}
