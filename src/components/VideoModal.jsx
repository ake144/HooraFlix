import { useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";
import "./VideoModal.css";
const VideoModal = ({ video, onClose }) => {
  const playerRef = useRef(null);
  useEffect(() => {
    if (!video) return;
    const escape = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", escape);
    document.body.style.overflow = "hidden";
    playerRef.current?.play().catch(() => {});
    return () => {
      document.removeEventListener("keydown", escape);
      document.body.style.overflow = "";
      playerRef.current?.pause();
    };
  }, [video, onClose]);
  if (!video) return null;
  return (
    <div
      className="video-modal-overlay"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={`${video.title} player`}
    >
      <section
        className="video-modal-content"
      >
        <video
          ref={playerRef}
          className="player-video"
          src={video.video}
          poster={video.image}
          controls
          playsInline
          autoPlay
        >
          Your browser does not support video playback.
        </video>
        <div className="player-details">
          <h2>{video.title}</h2>
          <div className="player-meta">
            {video.credit && <span>{video.credit}</span>}
            <span>{video.genre || "Official trailer"}</span>
          </div>
        </div>
      </section>
      <button
        className="video-modal-close"
        onClick={onClose}
        aria-label="Close player"
      >
        <FiX />
      </button>
    </div>
  );
};
export default VideoModal;
