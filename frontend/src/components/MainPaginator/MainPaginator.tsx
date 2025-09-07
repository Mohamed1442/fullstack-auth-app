import useFilter from "@hooks/useFilter";
import { cn } from "@utils/cn";
import { getLocalStorageItem } from "@utils/localStorage";
import { ELOCALSTORAGEKEYS } from "@constants/keys";
import { useEffect, useState, type FC } from "react";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi2";

interface MainPaginatorProps {
  total?: number;
}

const MainPaginator: FC<MainPaginatorProps> = function ({ total }) {
  const { searchParams: filter, updateFilter } = useFilter();

  const size = Number(getLocalStorageItem(ELOCALSTORAGEKEYS.TAKE)) || 10;
  const [lastKnownPages, setLastKnownPages] = useState<number | undefined>(
    total
  );

  const totalDataPage = total ?? lastKnownPages ?? 0;
  const Page: number = +(filter.get("page") ?? 1);

  const handlePageChange = (_Page: number): void => {
    if (_Page < 1 || _Page > totalDataPage) return;
    updateFilter("page", _Page.toString());
  };

  const getPaginationNumbers = () => {
    if (totalDataPage <= 1) return [];
    if (totalDataPage <= 10) return [...Array(totalDataPage).keys()];

    let start = Math.max(0, Page - 3);
    let end = Math.min(totalDataPage, Page + 2);

    if (Page <= 2) end = 5;
    if (Page >= totalDataPage - 2) start = totalDataPage - 5;

    return [...Array(end - start).keys()]
      .map((i) => i + start)
      .filter((page) => page + 1 !== Page - 2 && page + 1 !== Page + 2);
  };

  useEffect(() => {
    if (!filter.get("take") || filter.get("take") !== size.toString()) {
      updateFilter("take", size.toString());
    }

    if (!filter.get("page") || filter.get("page") !== "1") {
      updateFilter("page", "1");
    }

    localStorage.setItem(ELOCALSTORAGEKEYS.TAKE, size.toString());
  }, [size, updateFilter]);

  useEffect(() => {
    if (total && total !== lastKnownPages) setLastKnownPages(total);
  }, [total]);

  useEffect(() => {
    if (filter.get("page") !== Page.toString()) {
      updateFilter("page", Page.toString());
    }
  }, [Page, updateFilter]);

  return (
    <div className="flex justify-between">
      {totalDataPage > 1 && (
        <div
          aria-label="table navigation buttons"
          className="flex justify-center"
        >
          <div className="flex flex-wrap items-center gap-1">
            <button
              title="Previous Page"
              className="p-2"
              disabled={Page === 1}
              onClick={() => handlePageChange(Page - 1)}
            >
              <HiOutlineChevronLeft
                size={16}
                className={cn("text-primary", {
                  "text-[#A1A1A1]": Page === 1,
                })}
              />
            </button>
            <button
              className={cn("rounded-md px-3 py-2 text-sm duration-200", {
                "bg-white text-primary hover:bg-primary/10 active:bg-primary/30":
                  Page !== 1,
                "pointer-events-none bg-primary text-white": Page === 1,
              })}
              disabled={Page === 1}
              onClick={() => handlePageChange(1)}
            >
              1
            </button>
            {Page > 3 && totalDataPage > 10 && <span className="p-2">...</span>}
            {getPaginationNumbers().map((_Page) =>
              _Page === 0 || _Page === totalDataPage - 1 ? null : (
                <button
                  className={cn("rounded-md px-3 py-2 text-sm duration-200", {
                    "bg-white text-primary hover:bg-primary/10 active:bg-primary/30":
                      _Page + 1 !== Page,
                    "pointer-events-none bg-primary text-white":
                      _Page + 1 === Page,
                  })}
                  key={_Page}
                  onClick={() => handlePageChange(_Page + 1)}
                >
                  {_Page + 1}
                </button>
              )
            )}
            {Page < totalDataPage - 2 && totalDataPage > 10 && (
              <span className="p-2">...</span>
            )}
            <button
              className={cn("rounded-md px-3 py-2 text-sm duration-200", {
                "bg-white text-primary hover:bg-primary/10 active:bg-primary/30":
                  Page < totalDataPage,
                "pointer-events-none bg-primary text-white":
                  Page === totalDataPage,
              })}
              disabled={Page >= totalDataPage}
              onClick={() => handlePageChange(totalDataPage)}
            >
              {totalDataPage}
            </button>
            <button
              title="Next Page"
              className="p-2"
              disabled={Page >= totalDataPage}
              onClick={() => handlePageChange(Page + 1)}
            >
              <HiOutlineChevronRight
                className={cn("text-primary", {
                  "text-[#A1A1A1]": Page >= totalDataPage,
                })}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainPaginator;
