import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ImageCard from "../components/ImageCard";
import HistoryToolbar from "../components/visiontag/HistoryToolbar";
import HistoryPagination from "../components/visiontag/HistoryPagination";
import { HISTORY_ITEMS_PER_PAGE } from "../data/historyItems";
import { clearAnalysisHistory, deleteAnalysis, getAnalysisHistory } from "../services/analysisService";

const monthNames = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

const getItemTimestamp = (item) => {
  const dateStr = item?.date || "";
  const timeStr = item?.time || "";
  const [monthName, day, year] = dateStr.split(" ");
  const month = monthNames[monthName] ?? 0;
  const parsedDay = parseInt((day || "").replace(",", ""), 10) || 1;

  const timeParts = timeStr.split(":");
  let hour = parseInt(timeParts[0], 10) || 0;
  let minute = 0;
  let meridiem = "";

  if (timeParts[1]) {
    const [minutePart, ampm] = timeParts[1].split(" ");
    minute = parseInt(minutePart, 10) || 0;
    meridiem = ampm?.toUpperCase() || "";
  }

  if (hour <= 12 && meridiem === "PM" && hour !== 12) {
    hour += 12;
  }
  if (hour === 12 && meridiem === "AM") {
    hour = 0;
  }

  return new Date(year, month, parsedDay, hour, minute).getTime();
};

const HistoryPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOption, setFilterOption] = useState("all");
  const [sortOption, setSortOption] = useState("newest");
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const user = useSelector((state) => state.auth?.user);
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
  const isGuest = Boolean(user?.isGuest);

  // Debounce the search box so we don't hit the backend on every keystroke (FR-12 / UC-08)
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery((searchQuery || "").trim()), 350);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  useEffect(() => {
    const loadHistory = async () => {
      // Guests never had their analyses saved (FR-10), so there's nothing to fetch.
      if (isGuest || !isAuthenticated) {
        setHistoryItems([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setLoadError(null);
        const items = await getAnalysisHistory(debouncedQuery);
        setHistoryItems(Array.isArray(items) ? items : []);
      } catch (error) {
        setLoadError(error.response?.data?.message || error.message || "Could not load your history.");
        setHistoryItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [isAuthenticated, isGuest, debouncedQuery]);

  const handleDeleteEntry = async (itemId) => {
    const previous = historyItems;
    setHistoryItems((prev) => prev.filter((item) => item.id !== itemId));
    try {
      await deleteAnalysis(itemId);
    } catch (error) {
      // Roll back on failure so the UI never silently loses data
      setHistoryItems(previous);
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm("Delete your entire analysis history? This cannot be undone.")) return;
    try {
      await clearAnalysisHistory();
      setHistoryItems([]);
      setCurrentPage(1);
    } catch (error) {
      setLoadError(error.response?.data?.message || error.message || "Could not clear your history.");
    }
  };

  const filteredItems = useMemo(() => {
    return historyItems
      .filter((item) => {
        const confidence = item.confidence || 0;
        const matchesFilter =
          filterOption === "all" ||
          (filterOption === "high" && confidence >= 90) ||
          (filterOption === "medium" && confidence >= 80 && confidence < 90);

        return matchesFilter;
      })
      .sort((a, b) => {
        const timeA = getItemTimestamp(a) || 0;
        const timeB = getItemTimestamp(b) || 0;
        const diff = timeB - timeA;
        return sortOption === "newest" ? diff : -diff;
      });
  }, [historyItems, filterOption, sortOption]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredItems.length / HISTORY_ITEMS_PER_PAGE)
  );

  const paginatedItems = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages);
    const start = (safePage - 1) * HISTORY_ITEMS_PER_PAGE;
    return filteredItems.slice(start, start + HISTORY_ITEMS_PER_PAGE);
  }, [filteredItems, currentPage, totalPages]);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="custom-scrollbar flex min-h-screen flex-col bg-vt-surface font-sans text-vt-body-md text-vt-on-surface">
      <Navbar />

      <main className="mx-auto w-full max-w-vt-container flex-grow px-vt-gutter pt-24 pb-vt-xl sm:px-vt-lg sm:pt-28 md:pt-32">
        <header className="mb-vt-xl">
          <h1 className="mb-vt-sm text-vt-headline-lg-mobile font-bold text-vt-on-background sm:text-vt-headline-lg">
            Analysis History
          </h1>
          <p className="max-w-2xl text-vt-body-md text-vt-on-surface-variant sm:text-vt-body-md">
            Review your previous image analysis sessions. Track tags, confidence
            scores, and processing timestamps for all your visual data.
          </p>
        </header>

        {isGuest ? (
          <div className="rounded-vt-lg border border-dashed border-vt-outline-variant bg-vt-surface-container-lowest py-vt-xl text-center">
            <p className="text-vt-body-md text-vt-on-surface-variant">
              Guest results aren't saved. Create a free account to build up an analysis history.
            </p>
            <Link
              to="/signup"
              className="mt-4 inline-flex rounded-vt-lg bg-vt-primary px-vt-lg py-vt-sm text-vt-label-md font-semibold text-vt-on-primary hover:opacity-90"
            >
              Create an account
            </Link>
          </div>
        ) : (
          <>
            <HistoryToolbar
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              filterOption={filterOption}
              sortOption={sortOption}
              onFilterChange={(value) => {
                setFilterOption(value);
                setCurrentPage(1);
              }}
              onSortChange={(value) => {
                setSortOption(value);
                setCurrentPage(1);
              }}
            />

            {historyItems.length > 0 && (
              <div className="mb-vt-md flex justify-end">
                <button
                  type="button"
                  onClick={handleClearHistory}
                  className="rounded-vt-lg border border-red-200 px-vt-md py-vt-xs text-vt-label-md font-semibold text-red-600 hover:bg-red-50"
                >
                  Clear all history
                </button>
              </div>
            )}

            {loadError && (
              <p role="alert" className="mb-vt-md rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                {loadError}
              </p>
            )}

            {loading ? (
              <div className="rounded-vt-lg border border-dashed border-vt-outline-variant bg-vt-surface-container-lowest py-vt-xl text-center">
                <p className="text-vt-body-md text-vt-on-surface-variant">Loading your analysis history…</p>
              </div>
            ) : paginatedItems.length > 0 ? (
              <div className="grid grid-cols-1 gap-vt-lg sm:grid-cols-2 lg:grid-cols-3">
                {paginatedItems.map((item) => (
                  <ImageCard
                    key={item.id}
                    imageUrl={item.imageUrl}
                    imageAlt={item.imageAlt}
                    confidence={item.confidence}
                    tags={item.tags}
                    date={item.date}
                    time={item.time}
                    detailsTo={`/history/${item.id}`}
                    onDelete={() => handleDeleteEntry(item.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-vt-lg border border-dashed border-vt-outline-variant bg-vt-surface-container-lowest py-vt-xl text-center">
                <p className="text-vt-body-md text-vt-on-surface-variant">
                  {debouncedQuery ? "No analyses match your search." : "You haven't analyzed any images yet."}
                </p>
                <Link
                  to="/"
                  className="mt-4 inline-flex rounded-vt-lg bg-vt-primary px-vt-lg py-vt-sm text-vt-label-md font-semibold text-vt-on-primary hover:opacity-90"
                >
                  Analyze an image
                </Link>
              </div>
            )}

            {filteredItems.length > 0 && (
              <HistoryPagination
                currentPage={Math.min(currentPage, totalPages)}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default HistoryPage;
