import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import UserList from "../pages/UserList";
import ProtectedRoute from "../components/ProtectedRoute";
import UserForm from "../components/UserForm";
import * as yup from "yup";
import { createUser, updateUser } from "../api/userApi";

const userSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid").required("Email is required"),
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  role: yup.string().oneOf(["user", "admin"]).required("Role is required"),
  password: yup.string().min(6),
});

export default function AppRoutes() {
  const navigate = useNavigate();
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<UserList />} />
        <Route path="users" element={<UserList />} />
        <Route
          path="users/new"
          element={
            <UserForm
              schema={userSchema}
              onSubmit={async (data) => {
                const result = await createUser(data);
                if (result) {
                  navigate("/dashboard");
                }
              }}
            />
          }
        />
        <Route
          path="users/:id"
          element={
            <UserForm
              schema={userSchema}
              isEdit
              onSubmit={async (data) => {
                const result = await updateUser(data.id, data);
                if (result) {
                  navigate("/dashboard");
                }
              }}
            />
          }
        />
      </Route>

      <Route path="*" element={<h2>404 Not Found</h2>} />
    </Routes>
  );
}
