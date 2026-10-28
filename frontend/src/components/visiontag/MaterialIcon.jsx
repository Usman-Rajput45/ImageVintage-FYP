import PropTypes from "prop-types";

/** Google Material Symbols (font icon) — used across VisionTag UI */
const MaterialIcon = ({ name, className = "", style }) => (
  <span
    className={`material-symbols-outlined ${className}`}
    style={style}
    aria-hidden="true"
  >
    {name}
  </span>
);

MaterialIcon.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default MaterialIcon;
