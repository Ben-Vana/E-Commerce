interface cardProp {
  _id: string;
  name: string;
  price: string;
  rating: number;
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
    for (let i = 0; i < data.length; i++) {
      data[i].rating = Math.round(data[i].rating);
    }
    return data;
  };
  return sortData;
};
