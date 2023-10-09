const getSomeField = (arr, fields) => {
  const withSomeFields = arr.map((i) =>
    Object.fromEntries(fields.map((f) => [f, i[f]]))
  );
  return withSomeFields;
};

export default getSomeField;
