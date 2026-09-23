export const HEART_PATH =
  "M12 21.5C7.2 17.7 2 13.9 2 8.8 2 5.9 4.3 3.5 7.1 3.5c2 0 3.8 1.1 4.9 2.9 1.1-1.8 2.9-2.9 4.9-2.9 2.8 0 5.1 2.4 5.1 5.3 0 5.1-5.2 8.9-10 12.7z";

export function Heart(props) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path d={HEART_PATH} />
    </svg>
  );
}

export function Pin() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M21.71 11.29l-9-9a.996.996 0 0 0-1.41 0l-9 9a.996.996 0 0 0 0 1.41l9 9c.39.39 1.02.39 1.41 0l9-9a.996.996 0 0 0 0-1.41zM14 14.5V12h-4v3H8v-4c0-.55.45-1 1-1h5V7.5l3.5 3.5-3.5 3.5z" />
    </svg>
  );
}

export function Copy() {
  return (
    <svg viewBox="0 0 24 24">
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V6a2 2 0 0 1 2-2h9" />
    </svg>
  );
}

export function Music() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
    </svg>
  );
}

const TIMELINE = {
  invite: (
    <svg viewBox="0 0 48 48">
      <path d="M8 18l16 11 16-11v20H8z" />
      <path d="M8 18l16-10 16 10" />
      <path d="M24 26c-2-4-8-3-6 2 1 2 6 5 6 5s5-3 6-5c2-5-4-6-6-2z" />
    </svg>
  ),
  rings: (
    <svg viewBox="0 0 48 48">
      <circle cx="19" cy="28" r="10" />
      <circle cx="30" cy="24" r="10" />
      <path d="M30 14l-3-5h6z" />
    </svg>
  ),
  party: (
    <svg viewBox="0 0 48 48">
      <path d="M14 40l6-18 12 12z" />
      <path d="M20 22c6-2 12 4 12 12" />
      <path d="M30 8v4M36 12l-3 3M40 20h-4" />
      <path d="M27 10l7-2-2 7" />
    </svg>
  ),
  cake: (
    <svg viewBox="0 0 48 48">
      <path d="M10 40h28V26H10z" />
      <path d="M14 26v-6h20v6" />
      <path d="M24 20v-6" />
      <path d="M24 9c-2 2-2 4 0 5 2-1 2-3 0-5z" />
      <path d="M10 32c4 3 8-3 12 0s8 3 12 0 2 0 4 0" />
    </svg>
  ),
  cheers: (
    <svg viewBox="0 0 48 48">
      <path d="M14 10h10l-2 14a5 5 0 0 1-6 0z" />
      <path d="M34 10H24l2 14a5 5 0 0 0 6 0z" />
      <path d="M19 24v14M29 24v14M14 38h10M24 38h10" />
    </svg>
  ),
};

export function TimelineIcon({ name }) {
  return TIMELINE[name] || TIMELINE.party;
}
