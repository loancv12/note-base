import { memo } from "react";

const NotePreview = ({ note }) => {
  if (note) {
    console.log("completed" in note);
    return (
      <tr className="table__row">
        {"completed" in note && (
          <td className="table__cell note__status">
            {note.completed ? (
              <span className="note__status--completed">Completed</span>
            ) : (
              <span className="note__status--open">Open</span>
            )}
          </td>
        )}
        <td className="table__cell note__title ">{note.title}</td>
        <td className="table__cell note__text">{note.text}</td>
        <td className="table__cell note__username">{note.username}</td>
      </tr>
    );
  } else return null;
};

const memoizedNote = memo(NotePreview);

export default memoizedNote;
