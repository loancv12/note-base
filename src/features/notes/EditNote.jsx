import { useParams } from "react-router-dom";
import { useGetNotesQuery } from "./notesApiSlice";
import { useGetUsersQuery } from "../users/usersApiSlice";
import EditNoteForm from "./EditNoteForm";
import useAuth from "../../hooks/useAuth";
import { PulseLoader } from "react-spinners";

const EditNote = () => {
  const { id } = useParams();
  const { username, isAdmin, isManager } = useAuth();

  const { note } = useGetNotesQuery("notesList", {
    selectFromResult: ({ data }) => {
      return { note: data?.entities[id] };
    },
  });
  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => {
      return {
        users: data?.ids.map((id) => data?.entities[id]),
      };
    },
  });

  if (!note || !users?.length) return <PulseLoader color="#fff" />;
  if (!isManager && !isAdmin) {
    if (note.username !== username) {
      return <p className="errmsg">No access</p>;
    }
  }
  const content = <EditNoteForm note={note} users={users} />;

  return content;
};
export default EditNote;
