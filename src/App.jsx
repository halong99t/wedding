import { useEffect, useRef, useState } from "react";
import CONFIG from "./config.js";
import { useReveal } from "./hooks/useReveal.js";
import { useMusic } from "./hooks/useMusic.js";
import { Cover } from "./components/Cover.jsx";
import { Hero, Couple, Family } from "./components/Hero.jsx";
import { Gallery } from "./components/Gallery.jsx";
import { Party, Timeline } from "./components/Party.jsx";
import { Rsvp, Wishes } from "./components/Forms.jsx";
import { Gifts, Thanks } from "./components/Gifts.jsx";
import { Gate } from "./components/Gate.jsx";
import { Hearts, Confetti, MusicControl } from "./components/Extras.jsx";

/* Thiệp chung, không chia link riêng cho từng khách */
const GUEST = "Quý khách";

export default function App() {
  /* Mỗi lần tải lại trang đều mở bằng phong bì */
  const [opened, setOpened] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const cardRef = useRef(null);
  const music = useMusic(CONFIG.music);

  /* mưa tim chúc mừng vài giây sau khi thiệp mở */
  useEffect(() => {
    if (!celebrate) return;
    const t = setTimeout(() => setCelebrate(false), 5000);
    return () => clearTimeout(t);
  }, [celebrate]);

  function onGateDone() {
    setOpened(true);
    setCelebrate(true);
  }

  useEffect(() => {
    document.title = CONFIG.groom.name + " & " + CONFIG.bride.name;
  }, []);

  /* khoá cuộn khi phong bì còn đóng */
  useEffect(() => {
    document.body.classList.toggle("locked", !opened);
    return () => document.body.classList.remove("locked");
  }, [opened]);

  /* hiện dần các mục sau khi thiệp mở */
  useReveal(cardRef, opened);

  return (
    <>
      <div className={"card" + (opened ? " enter" : "")} ref={cardRef}>
        <Cover guest={GUEST} />
        <main className="content">
          <Hero />
          <Couple />
          <Family />
          <Gallery />
          <Party guest={GUEST} />
          <Timeline />
          <div className="pair">
            <Rsvp />
            <Wishes />
          </div>
          <Gifts />
          <Thanks />
        </main>
      </div>

      {!opened && <Gate guest={GUEST} onOpen={music.play} onDone={onGateDone} />}

      <Hearts />
      {celebrate && <Confetti />}
      <MusicControl music={music} />
    </>
  );
}
