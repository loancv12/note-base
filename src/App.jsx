import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import NotFound from "./components/NotFound";
import Public from "./components/Public";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import RequiredAuth from "./features/auth/RequiredAuth";
import Welcome from "./features/auth/WelCome";
import DashLayout from "./components/DashLayout";
import NotesList from "./features/notes/NotesList";
import UsersList from "./features/users/UsersList";
import EditNote from "./features/notes/EditNote";
import EditUser from "./features/users/EditUser";
import NewUserForm from "./features/users/NewUserForm";
import NewNoteForm from "./features/notes/NewNoteForm";
import Prefetch from "./features/auth/Prefetch";
import NewNote from "./features/notes/NewNote";
import PersistLogin from "./features/auth/PersistLogin";
import { ROLES } from "./config/roles";
import useTitle from "./hooks/useTitle";

const App = () => {
  useTitle("Dand repairs");
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* private routes */}

        <Route element={<PersistLogin />}>
          <Route
            element={<RequiredAuth allowedRoles={[...Object.values(ROLES)]} />}
          >
            <Route element={<Prefetch />}>
              <Route path="dash" element={<DashLayout />}>
                <Route index element={<Welcome />} />

                <Route path="notes">
                  <Route index element={<NotesList />} />
                  <Route path=":id" element={<EditNote />} />
                  <Route path="new" element={<NewNote />} />
                </Route>

                {/* routes for manager and admin */}
                <Route
                  element={
                    <RequiredAuth allowedRoles={[ROLES.Manager, ROLES.Admin]} />
                  }
                >
                  <Route path="users">
                    <Route index element={<UsersList />} />
                    <Route path=":id" element={<EditUser />} />
                    <Route path="new" element={<NewUserForm />} />
                  </Route>
                </Route>
              </Route>
            </Route>
          </Route>
        </Route>
        {/* End Dash */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
