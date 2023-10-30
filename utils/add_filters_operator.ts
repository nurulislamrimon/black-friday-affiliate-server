export const addFiltersSymbolToOperators = (filters: any) => {
  let filtersString = JSON.stringify(filters);
  filtersString = filtersString.replace(
    /gt|gte|lt|lte/g,
    (match) => `$${match}`
  );

  return JSON.parse(filtersString);
};
