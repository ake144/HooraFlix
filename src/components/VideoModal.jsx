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
      className="modal-overlay"
      onMouseDown={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${video.title} player`}
    >
      <section
        className="modal-content player-content"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close player"
        >
          <FiX />
        </button>
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
          <p>{video.genre || "Official trailer"}</p>
        </div>
      </section>
    </div>
  );
};
export default VideoModal;
