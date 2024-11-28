/* eslint-disable react/prop-types */
export default function CalcButton({
  type,
  content,
  handleNumpadClick,
}) {
  return (
    <button
      className={type}
      value={content}
      onClick={(e) => handleNumpadClick(e)}
    >
      {content}
    </button>
  );
}
