import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import TagPill from "./TagPill";
import MaterialIcon from "./visiontag/MaterialIcon";

const ImageCard = ({
  imageUrl,
  imageAlt,
  confidence,
  tags,
  date,
  time,
  detailsTo = "#",
  onDelete,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (detailsTo && detailsTo !== "#") {
      navigate(detailsTo);
    }
  };

  return (
    <article
      onClick={handleCardClick}
      className="group overflow-hidden rounded-vt-lg border border-vt-outline-variant bg-vt-surface-container-lowest transition-all duration-300 hover:border-vt-primary/30 hover:shadow-md"
      style={{ cursor: detailsTo && detailsTo !== "#" ? "pointer" : "default" }}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={imageUrl}
          alt={imageAlt}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-vt-sm right-vt-sm flex items-center gap-1 rounded-full bg-vt-on-background/60 px-vt-sm py-1 text-[10px] font-medium text-white backdrop-blur-md">
          <MaterialIcon
            name="check_circle"
            className="text-[12px]"
            style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}
          />
          {confidence}% Conf.
        </div>
        {onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete();
            }}
            aria-label="Delete this analysis"
            className="absolute top-vt-sm left-vt-sm flex h-8 w-8 items-center justify-center rounded-full bg-vt-on-background/60 text-white opacity-0 backdrop-blur-md transition-opacity hover:bg-red-600 group-hover:opacity-100 focus:opacity-100"
          >
            <MaterialIcon name="delete" className="text-[16px]" />
          </button>
        )}
      </div>

      <div className="p-vt-md">
        <div className="mb-vt-md flex flex-wrap gap-vt-xs">
          {tags.map((tag) => (
            <TagPill key={tag} label={tag} />
          ))}
        </div>

        <div className="flex items-end justify-between gap-vt-sm">
          <div className="flex flex-col">
            <span className="text-vt-label-sm text-vt-on-surface-variant">{date}</span>
            <span className="text-[12px] text-vt-outline-variant">{time}</span>
          </div>
          <span className="flex shrink-0 items-center gap-1 text-vt-label-md font-semibold text-vt-primary">
            View Details
            <MaterialIcon name="arrow_forward" className="text-vt-body-md" />
          </span>
        </div>
      </div>
    </article>
  );
};

ImageCard.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  imageAlt: PropTypes.string.isRequired,
  confidence: PropTypes.number.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  date: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  detailsTo: PropTypes.string,
  onDelete: PropTypes.func,
};

export default ImageCard;
