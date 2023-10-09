import { read, utils, writeFile } from "xlsx";

/* get state data and export to XLSX */
const exportSheet = async (data, sheetName) => {
  /* generate worksheet from state */
  const worksheet = utils.json_to_sheet(data);
  /* create workbook and append worksheet */
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "Data");
  /* export to XLSX */
  writeFile(workbook, `${sheetName}.xlsx`);
};

export default exportSheet;
