import axios from "axios";
import SearchPageCard from "../../components/SearchPageCard";
import SearchNavButtons from "../../components/SearchNavButtons";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./search.css";
import { useSelector } from "react-redux";

interface cardProp {
  _id: string;
  name: string;
  price: number;
  image: Array<string>;
}
const numberOfCardsPerPage = 10;
let buttonLength = 1;
let resultArrLength: number;

const SearchPage = (): JSX.Element => {
  const [productsArr, setProductsArr] = useState<Array<cardProp>>([]);
  const [userSearch, setUserSearch] = useState<string | null>("");
  const location = useLocation();

  const isAdmin = useSelector(
    (state: { authReducer: { userData: { admin: boolean } } }) =>
      state.authReducer.userData.admin
  );

  useEffect((): void => {
    const qParams = new URLSearchParams(location.search);
    const search = qParams.get("q");
    const page = qParams.get("p");
    setUserSearch(search);
    axios
      .get(`/product/${search}`)
      .then(({ data }): void | null => {
        resultArrLength = data.length;
        return page
          ? setProductsArr(
              data.slice(
                (+page - 1) * numberOfCardsPerPage,
                +page * numberOfCardsPerPage
              )
            )
          : null;
      })
      .catch((err): void => console.log(err));
  }, [location]);

  const renderButton = (): Array<JSX.Element> => {
    const qParams = new URLSearchParams(location.search);
    const page = qParams.get("p");
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
          />
        );
      }
    } else if (page) {
      let pageNumber = +page;
      //if number of pages is grater then 5 and we are on the first or second page
      if (pageNumber === 1 || pageNumber === 2) {
        buttonArr.push(
          <SearchNavButtons key={"button" + 1} index={1} search={userSearch} />
        );
        for (let i = pageNumber; i <= pageNumber + 2; i++) {
          buttonArr.push(
            <SearchNavButtons
              key={"button" + (i + 1)}
              index={pageNumber === 1 ? i + 1 : pageNumber === 2 ? i : i + 1}
              search={userSearch}
            />
          );
          if (i === pageNumber + 2) {
            buttonArr.push(
              <SearchNavButtons
                key={"last-button"}
                index={buttonLength || 0}
                search={userSearch}
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
            />
          );
        }
        buttonArr.unshift(
          <SearchNavButtons
            key={"first-button"}
            index={1}
            search={userSearch}
          />
        );
        buttonArr.push(
          <SearchNavButtons
            key={"last-button"}
            index={buttonLength || 0}
            search={userSearch}
          />
        );
      }
      //if number of pages is grater then 5 and we are in the middle pages number
      else {
        buttonArr.push(
          <SearchNavButtons key={"button" + 1} index={1} search={userSearch} />
        );
        for (let i = pageNumber - 1; i < pageNumber + 2; i++) {
          buttonArr.push(
            <SearchNavButtons
              key={"button" + i}
              index={i}
              search={userSearch}
            />
          );
        }
        buttonArr.push(
          <SearchNavButtons
            key={"last-button"}
            index={buttonLength || 0}
            search={userSearch}
          />
        );
      }
    }
    return buttonArr;
  };

  return (
    <div>
      <h3 className="search-result">Search result for "{userSearch}":</h3>
      <div className="search-page-container">
        {productsArr[0] ? (
          productsArr.map((item: cardProp, index) => (
            <SearchPageCard
              key={item.name + index}
              id={item._id}
              name={item.name}
              price={item.price}
              image={item.image[0]}
              admin={isAdmin}
            />
          ))
        ) : (
          <div>Wrong</div>
        )}
      </div>
      {productsArr[0] && <div className="page-buttons">{renderButton()}</div>}
    </div>
  );
};

export default SearchPage;
