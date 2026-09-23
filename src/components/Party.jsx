import CONFIG from "../config.js";
import { Pin, TimelineIcon } from "../lib/icons.jsx";
import { SectionHead } from "./common.jsx";
import { Calendar, DateBlock, Lunar } from "./DateBlock.jsx";

function Venue({ v, index }) {
  const q = v.lat && v.lng ? v.lat + "," + v.lng : v.address;
  const dir = "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(q);
  const embed = "https://maps.google.com/maps?q=" + encodeURIComponent(q) + "&z=15&output=embed";
  const go = (
    <a className="go" href={dir} target="_blank" rel="noopener noreferrer">
      <Pin />
      Chỉ đường
    </a>
  );
  let map;
  if (CONFIG.embedMap) {
    map = (
      <div className="map">
        <iframe
          src={embed}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          title={"Bản đồ " + v.name}
        />
        {go}
      </div>
    );
  } else if (index === 0) {
    map = <div className="map static">{go}</div>;
  } else {
    map = (
      <p style={{ marginTop: ".6rem" }}>
        <a href={dir} target="_blank" rel="noopener noreferrer" style={{ color: "var(--wine)" }}>
          Chỉ đường →
        </a>
      </p>
    );
  }
  return (
    <div className="venue rv">
      <p className="vname">{v.name}</p>
      {v.time && <p className="vmeta">{v.time}</p>}
      <p className="vaddr">{v.address}</p>
      {map}
    </div>
  );
}

/* 5. Thông tin tiệc cưới */
export function Party({ guest }) {
  const { party, venues } = CONFIG;
  return (
    <section id="party">
      <SectionHead title="Thông tin tiệc cưới" />
      <div className="info-grid">
        <div className="invite rv">
          <p className="eyebrow ink">Trân trọng kính mời</p>
          <p className="to">{guest}</p>
          <p className="eyebrow ink">Tham dự tiệc cưới sẽ diễn ra vào lúc</p>
          <div className="when">
            <DateBlock iso={party} />
            <Lunar iso={party} className="lunar" />
          </div>
          <Calendar iso={party} />
        </div>
        <div className="venues">
          {venues.map((v, i) => (
            <Venue key={i} v={v} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* 6. Timeline */
export function Timeline() {
  return (
    <section>
      <SectionHead title="Timeline" />
      <div className="timeline rv">
        {CONFIG.timeline.map((t, i) => (
          <div className="tl" key={i}>
            <span className="ico">
              <TimelineIcon name={t.icon} />
            </span>
            <span className="dot" />
            <span className="time">{t.time}</span>
            <span className="lbl">{t.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
