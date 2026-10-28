import { useState } from "react";
import PropTypes from "prop-types";
import MaterialIcon from "./MaterialIcon";

const filterOptions = [
  { value: "all", label: "All confidence levels" },
  { value: "high", label: "High confidence (≥ 90%)" },
  { value: "medium", label: "Medium confidence (80%–89%)" },
];

const sortOptions = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
];

const HistoryToolbar = ({
  searchQuery,
  onSearchChange,
  filterOption,
  sortOption,
  onFilterChange,
  onSortChange,
}) => {
  const [openMenu, setOpenMenu] = useState("");

  return (
    <div className="mb-vt-xl flex flex-col items-start justify-between gap-vt-md md:flex-row md:items-center">
      <div className="relative w-full md:w-96">
        <MaterialIcon
          name="search"
          className="absolute top-1/2 left-3 -translate-y-1/2 text-vt-outline"
        />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by tags or filename..."
          className="w-full rounded-vt-lg border border-vt-outline-variant bg-vt-surface py-vt-sm pr-vt-md pl-10 text-vt-body-sm text-vt-on-surface focus:border-vt-primary focus:ring-2 focus:ring-vt-primary focus:outline-none"
          aria-label="Search history"
        />
      </div>

      <div className="flex w-full gap-vt-sm sm:w-auto">
        <div className="relative w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setOpenMenu((prev) => (prev === "filter" ? "" : "filter"))}
            className="flex w-full items-center justify-center gap-vt-xs rounded-vt-lg border border-vt-outline-variant px-vt-md py-vt-sm text-vt-label-md font-semibold text-vt-on-surface-variant transition-colors hover:bg-vt-surface-container-low sm:w-auto"
          >
            <MaterialIcon name="filter_list" className="text-vt-body-md" />
            Filter
          </button>

          {openMenu === "filter" ? (
            <div className="absolute right-0 z-50 mt-2 w-full min-w-[220px] rounded-vt-lg border border-vt-outline-variant bg-vt-surface p-vt-sm shadow-lg sm:w-auto">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onFilterChange(option.value);
                    setOpenMenu("");
                  }}
                  className={`block w-full text-left px-vt-3 py-vt-2 text-vt-body-sm transition hover:bg-vt-surface-container-highest ${
                    filterOption === option.value
                      ? "font-semibold text-vt-primary"
                      : "text-vt-on-surface"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="relative w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setOpenMenu((prev) => (prev === "sort" ? "" : "sort"))}
            className="flex w-full items-center justify-center gap-vt-xs rounded-vt-lg border border-vt-outline-variant px-vt-md py-vt-sm text-vt-label-md font-semibold text-vt-on-surface-variant transition-colors hover:bg-vt-surface-container-low sm:w-auto"
          >
            <MaterialIcon name="calendar_today" className="text-vt-body-md" />
            Sort
          </button>

          {openMenu === "sort" ? (
            <div className="absolute right-0 z-50 mt-2 w-full min-w-[220px] rounded-vt-lg border border-vt-outline-variant bg-vt-surface p-vt-sm shadow-lg sm:w-auto">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onSortChange(option.value);
                    setOpenMenu("");
                  }}
                  className={`block w-full text-left px-vt-3 py-vt-2 text-vt-body-sm transition hover:bg-vt-surface-container-highest ${
                    sortOption === option.value
                      ? "font-semibold text-vt-primary"
                      : "text-vt-on-surface"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

HistoryToolbar.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  filterOption: PropTypes.string.isRequired,
  sortOption: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onSortChange: PropTypes.func.isRequired,
};

export default HistoryToolbar;
