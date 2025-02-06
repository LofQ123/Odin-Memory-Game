import PropTypes from "prop-types";
import cardBack from "/public/259e49dc4d980310ccf0e9656ab0cd42.jpg";

Card.propTypes = {
  id: PropTypes.string,
  url: PropTypes.string,
  isFlipped: PropTypes.bool,
  onClick: PropTypes.func,
  imageReady: PropTypes.func,
};

export default function Card({ id, url, isFlipped, onClick, imageReady }) {
  return (
    <div
      className={`card ${isFlipped ? "flip" : ""}`}
      id={id}
      onClick={onClick}
    >
      {url ? (
        <>
          <div className="card-Face">
            <img
              src={url}
              alt="Card content"
              onLoad={() => imageReady()}
              onError={() => imageReady()}
            />
          </div>
          <div className="card-Back">
            <img
              src={cardBack}
              alt="Back of the card"
            />
          </div>
        </>
      ) : (
        <div className="card-error">Failed to load</div>
      )}
    </div>
  );
}
