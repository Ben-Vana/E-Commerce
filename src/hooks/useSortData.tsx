interface cardProp {
  _id: string;
  name: string;
  price: string;
  image: Array<string>;
}

export const useSortData = (): Function => {
  const sortData = (
    data: Array<cardProp>,
    sort: string | null,
    page: string | null,
    numPerPage: number
  ): Array<cardProp> => {
    if (sort) {
      switch (sort) {
        case "priceHTL":
          data.sort((a, b) => (parseInt(a.price) > parseInt(b.price) ? -1 : 1));
          break;
        case "priceLTH":
          data.sort((a, b) => (parseInt(a.price) > parseInt(b.price) ? 1 : -1));
          break;
        case "nameAZ":
          data.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "nameZA":
          data.sort((a, b) => b.name.localeCompare(a.name));
          break;
      }
    }
    if (page) {
      data = data.slice((+page - 1) * numPerPage, +page * numPerPage);
    }
    return data;
  };
  return sortData;
};
