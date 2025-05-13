import classNames from "classnames/bind";
import { useState, useEffect, useRef } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import HeadlessTippy from "@tippyjs/react/headless";
import Tippy from "@tippyjs/react";

import * as searchServices from "~/apiServices/searchServices";
import { Wrapper as PopperWrapper } from "~/components/Popper";
import AccountItem from "~/components/AccountItem";
import styles from "./Search.module.scss";
import { SearchIcon } from "~/components/Icons";
import { useDebounce } from "~/hooks";

const cx = classNames.bind(styles);

function Search() {
  const [searchResult, setSearchResult] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [showResult, setShowResult] = useState(true);
  const [loading, setLoading] = useState(false);

  const debounced = useDebounce(searchValue, 500);

  const inputRef = useRef();

  useEffect(() => {
    if (!debounced.trim()) {
      setSearchResult([]);
      return;
    }
    const fetchApi = async () => {
      setLoading(true);

      const result = await searchServices.search(debounced);
      setSearchResult(result);

      setLoading(false);
    };
    fetchApi();
  }, [debounced]);

  const handleClear = () => {
    setSearchValue("");
    setSearchResult([]);
    inputRef.current.focus();
  };

  const handleHideResult = () => {
    setShowResult(false);
  };

  return (
    <HeadlessTippy
      visible={showResult && searchResult.length > 0}
      interactive
      render={(attrs) => (
        <div className={cx("search-result")} tabIndex={-1} {...attrs}>
          <PopperWrapper>
            <h3 className={cx("search-title")}>Acounts</h3>
            {searchResult.map((result) => (
              <AccountItem key={result.id} data={result} />
            ))}
          </PopperWrapper>
        </div>
      )}
      onClickOutside={handleHideResult}
    >
      <div className={cx("search")}>
        <input
          ref={inputRef}
          value={searchValue}
          placeholder="Search acounts and videos"
          spellCheck={false}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => setShowResult(true)}
        />

        {!!searchValue && !loading && (
          <button className={cx("close")} onClick={handleClear}>
            <FontAwesomeIcon icon={faCircleXmark} />
          </button>
        )}

        {loading && (
          <FontAwesomeIcon className={cx("loading")} icon={faSpinner} />
        )}

        <Tippy content="Tìm kiếm" placement="right">
          <button className={cx("search-btn")}>
            <SearchIcon />
          </button>
        </Tippy>
      </div>
    </HeadlessTippy>
  );
}

export default Search;
