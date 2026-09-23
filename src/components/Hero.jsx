import CONFIG from "../config.js";
import { heroDate, lunarOf } from "../lib/date.js";
import { Heart } from "../lib/icons.jsx";
import { Lines } from "./common.jsx";
import { DateBlock, Lunar } from "./DateBlock.jsx";

/* 1. Save the date */
export function Hero() {
  const { groom, bride, party, heroPhoto } = CONFIG;
  return (
    <section className="hero">
      <div className="hero-text">
        <p className="save">Save the Date</p>
        <h1 className="names">
          <span>{groom.name}</span> &amp; <span>{bride.name}</span>
        </h1>
        <p className="hero-date">
          <span>{heroDate(party)}</span>
        </p>
        <p className="hero-lunar">{lunarOf(party)}</p>
        <p className="hero-intro">Trân trọng kính mời bạn đến chung vui cùng gia đình chúng tôi.</p>
      </div>
      <div className={"photo" + (heroPhoto ? "" : " ph")} data-ph="Ảnh cưới chính">
        {heroPhoto && <img src={heroPhoto} alt={groom.name + " & " + bride.name} />}
        <span className="ring" />
      </div>
    </section>
  );
}

function Person({ who, label, side }) {
  return (
    <div className={"person rv " + side}>
      {who.photo && (
        <div className="avatar">
          <img src={who.photo} alt={who.name} />
        </div>
      )}
      <p className="eyebrow">{label}</p>
      <h2 className="name">{who.name}</h2>
    </div>
  );
}

/* 2. Cặp đôi */
export function Couple() {
  return (
    <section id="couple">
      <div className="couple">
        <Person who={CONFIG.groom} label="Chú rể" side="from-left" />
        <div className="amp rv" aria-hidden="true">
          &amp;
        </div>
        <Person who={CONFIG.bride} label="Cô dâu" side="right from-right" />
      </div>
    </section>
  );
}

/* 3. Gia đình + ngày cưới */
export function Family() {
  const { groom, bride, ceremony } = CONFIG;
  return (
    <section>
      <div className="parents rv">
        <div className="fam">
          <b>Nhà trai</b>
          <span>
            <Lines text={groom.parents} />
          </span>
        </div>
        <div className="fam">
          <b>Nhà gái</b>
          <span>
            <Lines text={bride.parents} />
          </span>
        </div>
      </div>
      <div className="center rv">
        <span className="heart" aria-hidden="true">
          <Heart />
        </span>
      </div>
      <p className="ceremony rv">
        Hôn lễ được cử hành
        <br />
        vào lúc
      </p>
      <DateBlock iso={ceremony} className="rv" />
      <Lunar iso={ceremony} className="lunar rv" />
    </section>
  );
}
