import React from "react";
import NewNoteForm from "./NewNoteForm";
import { PulseLoader } from "react-spinners";
import { useGetUsersQuery } from "../users/usersApiSlice";

const NewNote = () => {
  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => {
      return {
        users: data?.ids.map((id) => data?.entities[id]),
      };
    },
  });

  if (!users?.length) return <PulseLoader color="#fff" />;
  const content = <NewNoteForm users={users} />;

  return content;
};

export default NewNote;
