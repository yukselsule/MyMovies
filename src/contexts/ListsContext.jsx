import { createContext, useContext, useEffect, useState } from "react";
import { useLocalStorageState } from "../hooks/useLocalStorageHook";
import { useMovies } from "./MoviesContext";

const ListsContext = createContext();

function ListsProvider({ children }) {
  const [listNames, setListNames] = useLocalStorageState([], "listNames");
  const [lists, setLists] = useLocalStorageState({}, "lists");
  const { getMovieDetails } = useMovies();
  const [summary, setSummary] = useState({
    totalRuntime: 0,
    allCountries: [],
    allGenres: [],
    allLanguages: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [movieDetails, setMovieDetails] = useState([]);
  const [topPicks, setTopPick] = useState({
    mostPopular: {},
    mostRuntime: {},
    mostBudget: {},
    oldest: {},
    newest: {},
  });

  useEffect(() => {
    const fetchMovieDetails = async function () {
      try {
        setIsLoading(true);
        const uniqueMovieIds = [
          ...new Set(
            Object.values(lists)
              .flat()
              .map((movie) => movie.id)
          ),
        ];
        const detailsPromises = uniqueMovieIds.map((id) => getMovieDetails(id));
        const details = await Promise.all(detailsPromises);
        setMovieDetails(details);
      } catch (err) {
        console.log(err);
      }
    };
    fetchMovieDetails();
  }, [lists, getMovieDetails]);

  useEffect(() => {
    const totalRuntime = movieDetails.reduce(
      (acc, movie) => (acc += movie.runtime),
      0
    );

    const allCountries = [
      ...new Set(
        movieDetails.flatMap((movie) =>
          movie.production_countries.map((country) => country.name)
        )
      ),
    ];
    const allGenres = [
      ...new Set(
        movieDetails.flatMap((movie) => movie.genres.map((genre) => genre.name))
      ),
    ];
    const allLanguages = [
      ...new Set(
        movieDetails.flatMap((movie) =>
          movie.spoken_languages.map((language) => language.english_name)
        )
      ),
    ];

    const mostPopular = movieDetails.reduce(
      (movie, curMovie) =>
        movie.popularity > curMovie.popularity ? movie : curMovie,
      movieDetails[0]
    );

    const mostRuntime = movieDetails.reduce(
      (movie, curMovie) =>
        movie.runtime > curMovie.runtime ? movie : curMovie,
      movieDetails[0]
    );

    const mostBudget = movieDetails.reduce(
      (movie, curMovie) => (movie.budget > curMovie.budget ? movie : curMovie),
      movieDetails[0]
    );

    const oldest = movieDetails.reduce(
      (movie, curMovie) =>
        new Date(movie.release_date) < new Date(curMovie.release_date)
          ? movie
          : curMovie,
      movieDetails[0]
    );

    const newest = movieDetails.reduce(
      (movie, curMovie) =>
        new Date(movie.release_date) > new Date(curMovie.release_date)
          ? movie
          : curMovie,
      movieDetails[0]
    );

    setSummary({ totalRuntime, allCountries, allGenres, allLanguages });
    setTopPick({ mostPopular, mostRuntime, mostBudget, oldest, newest });
    setIsLoading(false);
  }, [movieDetails]);

  function deleteList(listName) {
    const newLists = { ...lists };
    delete newLists[listName];
    setLists(newLists);
    setListNames(listNames.filter((name) => name !== listName));

    const remainingMovieIds = [
      ...new Set(
        Object.values(newLists)
          .flat()
          .map((movie) => movie.id)
      ),
    ];

    const remainingMovies = movieDetails.filter((movie) =>
      remainingMovieIds.includes(movie.id)
    );

    setMovieDetails(remainingMovies);
  }

  function deleteMovie(listName, movieId) {
    if (lists[listName].length === 1)
      return alert("this action will delete the list");
    const newLists = lists[listName].filter((movie) => movieId !== movie.id);
    setLists({ ...lists, [listName]: newLists });
  }

  return (
    <ListsContext.Provider
      value={{
        listNames,
        setListNames,
        lists,
        setLists,
        summary,
        isLoading,
        movieDetails,
        topPicks,
        deleteList,
        deleteMovie,
      }}
    >
      {children}
    </ListsContext.Provider>
  );
}

function useLists() {
  const context = useContext(ListsContext);
  return context;
}

export { ListsProvider, useLists };
