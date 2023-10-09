import React, { useCallback } from "react";
import { useGetUsersQuery } from "../users/usersApiSlice";
import User from "./User";
import exportSheet from "../../utils/exportSheet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";

const UsersList = () => {
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery("usersList", {
    pollingInterval: 60000, //60s
    // refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let content;

  if (isLoading) content = <p>Loading ...</p>;
  if (error) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }
  if (isSuccess) {
    const { ids } = users;

    const tableContent =
      ids?.length && ids.map((userId) => <User key={userId} userId={userId} />);

    const onExportSheetUsers = () => {
      if (users) {
        // exportSheet(users);
      }
    };
    let exportButton = (
      <button title="Export users" onClick={onExportSheetUsers}>
        <FontAwesomeIcon icon={faArrowDown} />
      </button>
    );

    content = (
      <div>
        {exportButton}
        <table className="table table--users">
          <thead className="table__thead">
            <tr>
              <th scope="col" className="table__th user__username">
                Username
              </th>
              <th scope="col" className="table__th user__roles">
                Roles
              </th>
              <th scope="col" className="table__th user__edit">
                Edit
              </th>
            </tr>
          </thead>
          <tbody>{tableContent}</tbody>
        </table>
      </div>
    );
  }
  return content;
};

export default UsersList;
