import axios from "axios";
import SearchPageCard from "../../components/SearchPageCard";
import SearchNavButtons from "../../components/SearchNavButtons";
import { useSortData } from "../../hooks/useSortData";
import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./search.css";

interface cardProp {
  _id: string;
  name: string;
  price: string;
  rating: number;
  image: Array<string>;
}
const numberOfCardsPerPage = 2;
let buttonLength = 1;
let resultArrLength: number;

const SearchPage = (): JSX.Element => {
  const [productsArr, setProductsArr] = useState<Array<cardProp>>([]);
  const [userSearch, setUserSearch] = useState<string | null>("");
  const [err, setErr] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const sortData = useSortData();

  const sortRef = useRef() as React.RefObject<HTMLDivElement>;

  useEffect((): void => {
    const qParams = new URLSearchParams(location.search);
    const sort = qParams.get("s");
    const search = qParams.get("q");
    const page = qParams.get("p");
    setUserSearch(search);
    axios
      .get(`/product/search/${search}`)
      .then(({ data }): void | null => {
        resultArrLength = data.length;
        setProductsArr(sortData(data, sort, page, numberOfCardsPerPage));
      })
      .catch(() => setErr(true));
  }, [location]);

  const handleShowSort = () => {
    if (sortRef.current) {
      if (sortRef.current.classList.contains("show-pop"))
        sortRef.current.classList.remove("show-pop");
      else sortRef.current.classList.add("show-pop");
    }
  };

  const handleSort = (sort: string): void => {
    const qParams = new URLSearchParams(location.search);
    qParams.set("s", sort);
    qParams.set("p", "1");
    navigate(`/search?${qParams.toString()}`);
    if (sortRef.current) sortRef.current.classList.remove("show-pop");
  };

  const handleActiveStyle = (option: string): string => {
    const qParams = new URLSearchParams(location.search);
    const sortState = qParams.get("s");
    return sortState === option ? "sort-style sort-active" : "sort-style";
  };

  const renderButton = (): Array<JSX.Element> => {
    const qParams = new URLSearchParams(location.search);
    const page = qParams.get("p");
    const sort = qParams.get("s");
    buttonLength = resultArrLength / numberOfCardsPerPage;
    let buttonArr = [];

    //if number of pages is under 5
    if (buttonLength < 5) {
      for (let i = 0; i < buttonLength; i++) {
        buttonArr.push(
          <SearchNavButtons
            key={"button" + i}
            index={i + 1}
            search={userSearch}
            sort={sort}
          />
        );
      }
    } else if (page) {
      let pageNumber = +page;
      //if number of pages is grater then 5 and we are on the first or second page
      if (pageNumber === 1 || pageNumber === 2) {
        buttonArr.push(
          <SearchNavButtons
            key={"button" + 1}
            index={1}
            search={userSearch}
            sort={sort}
          />
        );
        for (let i = pageNumber; i <= pageNumber + 2; i++) {
          buttonArr.push(
            <SearchNavButtons
              key={"button" + (i + 1)}
              index={pageNumber === 1 ? i + 1 : pageNumber === 2 ? i : i + 1}
              search={userSearch}
              sort={sort}
            />
          );
          if (i === pageNumber + 2) {
            buttonArr.push(
              <SearchNavButtons
                key={"last-button"}
                index={buttonLength || 0}
                search={userSearch}
                sort={sort}
              />
            );
          }
        }
      }
      //if number of pages is grater then 5 and we are on the last or second to last page
      else if (pageNumber + 1 === buttonLength || pageNumber === buttonLength) {
        for (
          let i = pageNumber === buttonLength ? pageNumber - 1 : pageNumber;
          i >= pageNumber - (pageNumber === buttonLength ? 3 : 2);
          i--
        ) {
          buttonArr.unshift(
            <SearchNavButtons
              key={"button" + (i - 1)}
              index={i}
              search={userSearch}
              sort={sort}
            />
          );
        }
        buttonArr.unshift(
          <SearchNavButtons
            key={"first-button"}
            index={1}
            search={userSearch}
            sort={sort}
          />
        );
        buttonArr.push(
          <SearchNavButtons
            key={"last-button"}
            index={buttonLength || 0}
            search={userSearch}
            sort={sort}
          />
        );
      }
      //if number of pages is grater then 5 and we are in the middle pages number
      else {
        buttonArr.push(
          <SearchNavButtons
            key={"button" + 1}
            index={1}
            search={userSearch}
            sort={sort}
          />
        );
        for (let i = pageNumber - 1; i < pageNumber + 2; i++) {
          buttonArr.push(
            <SearchNavButtons
              key={"button" + i}
              index={i}
              search={userSearch}
              sort={sort}
            />
          );
        }
        buttonArr.push(
          <SearchNavButtons
            key={"last-button"}
            index={buttonLength || 0}
            search={userSearch}
            sort={sort}
          />
        );
      }
    }
    return buttonArr;
  };

  const handleAddView = (id: string) => {
    axios.patch("/product/product/addview", { id });
  };

  return (
    <div style={{ marginTop: "7rem" }}>
      <h3 className="search-result">Search result for "{userSearch}":</h3>
      {!err ? (
        <div className="search-page-container">
          <div className="sort-container">
            <span className="sort-txt" onClick={handleShowSort}>
              Sort &#709;
            </span>
            <div className="sort-options" ref={sortRef}>
              <span
                className={handleActiveStyle("price")}
                onClick={(): void => handleSort("priceHTL")}
              >
                Price high to low
              </span>
              <span
                className={handleActiveStyle("price")}
                onClick={(): void => handleSort("priceLTH")}
              >
                Price low to high
              </span>
              <span
                className={handleActiveStyle("name")}
                onClick={(): void => handleSort("nameAZ")}
              >
                Name A-Z
              </span>
              <span
                className={handleActiveStyle("name")}
                onClick={(): void => handleSort("nameZA")}
              >
                Name Z-A
              </span>
            </div>
          </div>
          <div className="sort-rule"></div>
          {productsArr[0] && !err ? (
            productsArr.map((item: cardProp, index) => (
              <SearchPageCard
                key={item.name + index}
                id={item._id}
                name={item.name}
                price={item.price}
                rating={item.rating}
                image={item.image[0]}
                addView={handleAddView}
              />
            ))
          ) : (
            <div className="server-error">Product was not found</div>
          )}
        </div>
      ) : (
        <div className="server-error">Server Error Please Try Again Later!</div>
      )}
      {productsArr[0] && !err && (
        <div className="page-buttons">{renderButton()}</div>
      )}
    </div>
  );
};

export default SearchPage;
