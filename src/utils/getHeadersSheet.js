import { read, utils, writeFile } from "xlsx";
const getHeadersSheet = (worksheet) => {
  const rowObject = utils.sheet_to_json(worksheet, {
    header: 1,
    defval: "",
  });
  const headers = rowObject[0].map((val) => val.toString().toLowerCase());
  return headers;
};

export default getHeadersSheet;
