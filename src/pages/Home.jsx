import { useEffect, useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiFilm,
  FiMusic,
  FiPlay,
  FiRadio,
  FiTag,
  FiTv,
} from "react-icons/fi";
import LandingHeader from "../components/LandingHeader";
import Footer from "../components/Footer";
import VideoModal from "../components/VideoModal";
import "./Home.css";
import { heroes, movies, categories } from "../data/movie";

const launch = new Date("2026-11-07T12:00:00+03:00").getTime();

function Home() {
  const [heroIndex, setHeroIndex] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [remaining, setRemaining] = useState(
    Math.max(0, Math.floor((launch - Date.now()) / 1000)),
  );
  const [notice, setNotice] = useState("");
  const hero = heroes[heroIndex];
  useEffect(() => {
    const timer = setInterval(
      () => setRemaining(Math.max(0, Math.floor((launch - Date.now()) / 1000))),
      1000,
    );
    return () => clearInterval(timer);
  }, []);
  const parts = [
    ["Days", Math.floor(remaining / 86400)],
    ["Hours", Math.floor((remaining % 86400) / 3600)],
    ["Minutes", Math.floor((remaining % 3600) / 60)],
    ["Seconds", remaining % 60],
  ];
  const play = (item) => {
    if (item.video) setSelectedVideo(item);
    else {
      setNotice(`${item.title} does not have a trailer available yet.`);
      setTimeout(() => setNotice(""), 3400);
    }
  };
  const shiftHero = (step) =>
    setHeroIndex((heroIndex + step + heroes.length) % heroes.length);

  return (
    <div className="home-page">
      <LandingHeader />
      <main>
        <section className="home-hero" aria-label="Featured title">
          <video
            className="hero-video"
            src="/hero-loop.mp4"
            poster={hero.image}
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="hero-shade" />
          <div className="hero-content" key={hero.id}>
            <p className="hero-eyebrow">{hero.eyebrow}</p>
            <h1>{hero.title}</h1>
            <div className="hero-meta">
              <b>★ {hero.rating}</b>
              <i /> <span>{hero.year}</span>
              <i /> <span>{hero.duration}</span>
              <em>TV-MA</em>
            </div>
            <p className="hero-description">{hero.description}</p>
            <button className="home-play-button" onClick={() => play(hero)}>
              <FiPlay /> Play now
            </button>
            <div className="countdown-label">
              <b /> Premieres in
            </div>
            <div className="countdown">
              {parts.map(([label, value]) => (
                <div className="countdown-cell" key={label}>
                  <strong>{String(value).padStart(2, "0")}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-arrows">
            <button onClick={() => shiftHero(-1)} aria-label="Previous feature">
              <FiChevronLeft />
            </button>
            <button onClick={() => shiftHero(1)} aria-label="Next feature">
              <FiChevronRight />
            </button>
          </div>
        </section>
        <section className="home-browse" id="movies">
          <div className="category-list">
            {categories.map(([Icon, label]) => (
              <a href="#upcoming" key={label} className="category-card">
                <Icon />
                <span>{label}</span>
              </a>
            ))}
          </div>
          <div className="section-heading" id="upcoming">
            <div>
              <h2>Upcoming Movies</h2>
              <p>New Ethiopian features — watch the trailers now</p>
            </div>
            <a href="#all-upcoming">
              View all <FiChevronRight />
            </a>
          </div>
          <div className="poster-grid" id="all-upcoming">
            {movies.map((movie) => (
              <article
                className={`poster-card ${movie.video ? "has-trailer" : ""}`}
                key={movie.id}
              >
                <div className="poster-image">
                  <img src={movie.image} alt={`${movie.title} poster`} />
                  <span>Coming soon</span>
                  {movie.video && (
                    <button
                      onClick={() => play(movie)}
                      className="poster-play"
                      aria-label={`Play ${movie.title} trailer`}
                    >
                      <FiPlay />
                    </button>
                  )}
                  {movie.video && <span className="poster-quick-add">+</span>}
                </div>
                <div className="poster-copy">
                  <h3>{movie.title}</h3>
                  {movie.latin && <p className="latin">{movie.latin}</p>}
                  <p>{movie.credit}</p>
                  {movie.studio && <p>{movie.studio}</p>}
                  <small>{movie.genre}</small>
                  {movie.video && (
                    <button
                      className="trailer-link"
                      onClick={() => play(movie)}
                    >
                      <FiPlay /> Watch trailer
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      {notice && (
        <div className="home-toast" role="status">
          {notice}
        </div>
      )}
      <VideoModal
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
      <Footer />
    </div>
  );
}
export default Home;
