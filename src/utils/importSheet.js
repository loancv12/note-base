import { read, utils } from "xlsx";
import lowercaseKeyObj from "./lowerCaseKey";
import fileToArrayBuffer from "./fileToArrayBuffer";

const importSheet = async (file) => {
  /* Check file type file */
  // TODO: check file type

  // get file sheet data
  const dataBuffer = await fileToArrayBuffer(file);
  // parse the array buffer
  const wb = read(dataBuffer);
  /* parse and load first worksheet */
  const ws = wb.Sheets[wb.SheetNames[0]];
  const data = utils.sheet_to_json(ws);
  // tranform data: make each key  lowercase
  const tranformData = data.map((note) => lowercaseKeyObj(note));

  return { tranformData, ws };
};

export default importSheet;
