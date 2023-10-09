export default function isSubArr(parentArray, subArray) {
  const isSubArr = subArray.every((e) => parentArray.includes(e));
  return isSubArr;
}
