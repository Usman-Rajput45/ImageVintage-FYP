import PropTypes from "prop-types";
import MaterialIcon from "./MaterialIcon";

const HistoryPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pages = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1, 2, 3, "ellipsis", totalPages);
  }

  return (
    <nav
      className="mt-vt-xl flex flex-wrap items-center justify-center gap-vt-sm"
      aria-label="History pagination"
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="rounded-vt-lg border border-vt-outline-variant p-vt-sm transition-colors hover:bg-vt-surface-container-low disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Previous page"
      >
        <MaterialIcon name="chevron_left" />
      </button>

      {pages.map((page, index) =>
        page === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            className="px-1 text-vt-outline-variant"
            aria-hidden="true"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={[
              "flex h-10 w-10 items-center justify-center rounded-vt-lg text-vt-label-md font-semibold transition-colors",
              currentPage === page
                ? "bg-vt-primary text-vt-on-primary"
                : "border border-vt-outline-variant text-vt-on-surface hover:bg-vt-surface-container-low",
            ].join(" ")}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="rounded-vt-lg border border-vt-outline-variant p-vt-sm transition-colors hover:bg-vt-surface-container-low disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Next page"
      >
        <MaterialIcon name="chevron_right" />
      </button>
    </nav>
  );
};

HistoryPagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default HistoryPagination;
