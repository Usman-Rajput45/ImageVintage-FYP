import PropTypes from "prop-types";
import MaterialIcon from "./MaterialIcon";

const FeatureCard = ({ icon, title, description }) => (
  <div className="flex flex-col gap-vt-sm rounded-vt-lg border border-vt-outline-variant bg-vt-surface-container-lowest p-vt-lg">
    <MaterialIcon name={icon} className="text-vt-primary" />
    <h3 className="text-vt-label-md font-semibold text-vt-on-surface">{title}</h3>
    <p className="text-vt-body-sm text-vt-on-surface-variant">{description}</p>
  </div>
);

FeatureCard.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default FeatureCard;
