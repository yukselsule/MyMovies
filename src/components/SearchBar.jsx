import { useState, useCallback } from "react";
import { useSearchQuery } from "../contexts/SearchQueryContext";
import { useNavigate } from "react-router-dom";
import styles from "./SearchBar.module.scss";

const debounce = (callback, wait) => {
  let timeoutId = null;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback(...args);
    }, wait);
  };
};

function SearchBar() {
  const [inputValue, setInputValue] = useState("");
  const { setQuery, query } = useSearchQuery();
  const navigate = useNavigate();

  const debouncedSetQuery = useCallback(
    debounce((newQuery) => {
      setQuery(newQuery);
      navigate(`/search?query=${newQuery}`);
    }, 1000),
    [setQuery, navigate]
  );

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    debouncedSetQuery(e.target.value);
  };

  return (
    <div className={`${styles["search-box"]} ${query ? styles["top"] : ""}`}>
      <input
        placeholder="Search your movie"
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className={styles["search-box_input"]}
      />
    </div>
  );
}

export default SearchBar;
