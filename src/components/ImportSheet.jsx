import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import importSheet from "../utils/importSheet";
import getHeadersSheet from "../utils/getHeadersSheet";
import isSubArr from "../utils/checkSubArray";
import getSomeField from "../utils/getSomeField";
import NotePreview from "../components/NotePreview";
import { useAddManyNoteMutation } from "../features/notes/notesApiSlice";

function ImportSheet() {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [selectFile, setSelectFile] = useState(null);
  const [errMsg, setErrMsg] = useState("");
  const errRef = useRef();
  const inputRef = useRef();

  const [addManyNote, { isError, isLoading, error, isSuccess }] =
    useAddManyNoteMutation();

  const handleImport = async (e) => {
    const file = e.target.files[0];
    const { tranformData: data, ws } = await importSheet(file);

    // check have data
    if (!data?.length) {
      setErrMsg(
        "file import dont have any data or the file format is not suitable"
      );
      setSelectFile(null);
      errRef.current.focus();
      inputRef.current.value = "";
    } else {
      let headers = getHeadersSheet(ws);

      // check required field
      const requiredFields = ["title", "text", "username"];
      const dataOmitFieldIndex = data.findIndex(
        (noteObj) => !isSubArr(Object.keys(noteObj), requiredFields)
      );

      if (dataOmitFieldIndex !== -1) {
        setErrMsg(
          ` All Fields : title, text, username (exactly same) are required. Data number ${
            dataOmitFieldIndex + 1
          } have this error`
        );
        console.log(data);
        errRef.current.focus();
        setSelectFile(null);
        inputRef.current.value = "";
      } else {
        // get notes with specify fields
        let fields = null;
        if (headers.includes("completed")) {
          fields = ["title", "text", "username", "completed"];
        } else {
          fields = ["title", "text", "username"];
        }
        const withSomeFieldsNotes = getSomeField(data, fields);

        setHeaders(fields);
        setData(withSomeFieldsNotes);

        setErrMsg("");
        setSelectFile(file);
      }
    }
  };

  let canSubmit = [data, headers, selectFile].every(Boolean);

  const onSubmitNotes = async (e) => {
    e.preventDefault();
    if (data?.length && canSubmit) {
      if (data.length < 1000) {
        try {
          const res = await addManyNote(data).unwrap();
          console.log(res);
        } catch (error) {
          console.log(JSON.stringify(error));
          setErrMsg(`${error?.data?.message}. Detail error info:\n
          ${error?.data?.detail?.map(
            (detailObj) =>
              `data number ${detailObj?.noteErrorIndex + 1} have error: ${
                detailObj?.message?.message
              }\n`
          )}
          `);
        }
      } else {
        alert("My poor server cannot suffer from this traffic");
      }
    }
    inputRef.current.value = "";
  };

  const errClass = errMsg ? "errmsg" : "offscreen";

  let importButton = (
    <button title="Submit notes" onClick={onSubmitNotes} disabled={!canSubmit}>
      Submit
      <FontAwesomeIcon icon={faArrowUp} />
    </button>
  );

  let tableContent =
    data?.length && data.map((note, i) => <NotePreview key={i} note={note} />);

  return (
    <div>
      <h3>Import</h3>
      <p>
        Import instruction: data import must in the first sheet, sheet must have
        3 field: title, text, username (exactly same) and format as the image
        below
      </p>

      <p ref={errRef} className={errClass} aria-live="assertive">
        {errMsg}
      </p>

      <br />
      <input type="file" ref={inputRef} onChange={handleImport} />

      {/* Show HTML preview */}
      {selectFile && (
        <>
          <h3>Preview</h3>
          <table className={`table--preview column-${headers?.length} `}>
            <thead className="table__thead">
              <tr>
                {headers?.includes("completed") && (
                  <th scope="col" className="table__th note__status">
                    Status
                  </th>
                )}

                <th scope="col" className="table__th note__title">
                  Title
                </th>
                <th scope="col" className="table__th note__username">
                  Text
                </th>
                <th scope="col" className="table__th note__edit">
                  Username
                </th>
              </tr>
            </thead>
            <tbody>{tableContent}</tbody>
          </table>
          <br />
          {importButton}
        </>
      )}
    </div>
  );
}

export default ImportSheet;
