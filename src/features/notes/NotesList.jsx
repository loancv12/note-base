import { useGetNotesQuery } from "./notesApiSlice";
import Note from "./Note";
import useAuth from "../../hooks/useAuth";
import { PulseLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faFileImport } from "@fortawesome/free-solid-svg-icons";
import exportSheet from "../../utils/exportSheet";
import importSheet from "../../utils/importSheet";
import { useState } from "react";
import getSomeField from "../../utils/getSomeField";
import { useNavigate } from "react-router-dom";

const NotesList = () => {
  const { username, isManager, isAdmin } = useAuth();
  const navigate = useNavigate();

  const {
    data: notes,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetNotesQuery("notesList", {
    pollingInterval: 15000, //15s
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let content;

  if (isLoading) content = <PulseLoader color="#fff" />;

  if (isError) {
    content = (
      <p className="errmsg">
        Error: {error?.data?.message || "Something wrong"}
      </p>
    );
  }

  if (isSuccess) {
    const { ids, entities } = notes;

    // filter based on roles
    let filteredIds;
    if (isManager || isAdmin) {
      filteredIds = [...ids];
    } else {
      filteredIds = ids.filter(
        (nodeId) => username === entities[nodeId].username
      );
    }

    const onExportSheetNotes = async () => {
      if (ids?.length) {
        // get notes with specify fields
        const notesArray = Object.values(entities);
        const fields = ["title", "text", "completed", "username"];
        const withSomeFieldsNotes = getSomeField(notesArray, fields);

        const sheetName = "Userslist";
        try {
          await exportSheet(withSomeFieldsNotes, sheetName);
        } catch (error) {
          console.log(error);
          alert("export failed, try again in few minute");
        }
      }
    };
    let exportButton = (
      <button title="Export notes" onClick={onExportSheetNotes}>
        Export
        <FontAwesomeIcon icon={faArrowDown} />
      </button>
    );

    let importButton = (
      <button title="Import notes" onClick={() => navigate("import")}>
        Import
        <FontAwesomeIcon icon={faFileImport} />
      </button>
    );

    const tableContent =
      ids?.length &&
      filteredIds.map((noteId) => <Note key={noteId} noteId={noteId} />);

    content = (
      <>
        <table className="table table--notes">
          <thead className="table__thead">
            <tr>
              <th scope="col" className="table__th note__status">
                Status
              </th>
              <th scope="col" className="table__th note__created">
                Created
              </th>
              <th scope="col" className="table__th note__updated">
                Updated
              </th>
              <th scope="col" className="table__th note__title">
                Title
              </th>
              <th scope="col" className="table__th note__username">
                Owner
              </th>
              <th scope="col" className="table__th note__edit">
                Edit
              </th>
            </tr>
          </thead>
          <tbody>{tableContent}</tbody>
        </table>
        <br />
        {ids?.length && exportButton}
        <span> </span>
        {importButton}
      </>
    );
  }

  return content;
};
export default NotesList;
