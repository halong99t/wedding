import { Heart } from "../lib/icons.jsx";

/* Chuỗi có "\n" → xuống dòng bằng <br> */
export function Lines({ text }) {
  const parts = String(text || "").split("\n");
  return parts.map((line, i) => (
    <span key={i}>
      {i > 0 && <br />}
      {line}
    </span>
  ));
}

export function SectionHead({ title, heart = true }) {
  return (
    <div className="sec-head rv">
      <h2 className="h-display">{title}</h2>
      {heart && (
        <span className="heart" aria-hidden="true">
          <Heart />
        </span>
      )}
    </div>
  );
}
