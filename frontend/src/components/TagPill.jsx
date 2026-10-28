import PropTypes from "prop-types";

const TagPill = ({ label }) => (
  <span className="inline-flex items-center gap-1 rounded-full bg-vt-secondary-container px-vt-sm py-1 text-[11px] font-medium text-vt-on-secondary-container">
    <span className="h-1.5 w-1.5 rounded-full bg-vt-on-secondary-container" aria-hidden="true" />
    {label}
  </span>
);

TagPill.propTypes = {
  label: PropTypes.string.isRequired,
};

export default TagPill;
