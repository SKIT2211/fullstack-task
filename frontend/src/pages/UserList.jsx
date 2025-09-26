import React, { useEffect, useState } from "react";
import api from "../api/axiosClient";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const filterSchema = yup.object({
  name: yup.string().optional(),
  email: yup.string().optional(),
  role: yup.string().optional(),
  page: yup.number().integer().min(1).optional(),
  limit: yup.number().integer().min(1).optional(),
});

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({});
  const { logout } = useAuth();
  const { register, handleSubmit } = useForm({
    resolver: yupResolver(filterSchema),
    defaultValues: { page: 1, limit: 10 },
  });
  const navigate = useNavigate();
  const fetchUsers = async (filters) => {
    const cleanedFilters = Object.fromEntries(
      // eslint-disable-next-line no-unused-vars
      Object.entries(filters).filter(([_key, value]) => value !== "")
    );
    try {
      const resp = await api.get("/users", { params: cleanedFilters });
      setUsers(resp.data.data);
      setMeta(resp.data.meta);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        logout();
      }
      console.error("Fetch users error", err);
    }
  };

  useEffect(() => {
    fetchUsers({ page: 1, limit: 10 });
  }, []);

  const onFilter = (data) => {
    fetchUsers(data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`/users/${id}`);
      fetchUsers({ page: meta.page, limit: meta.limit });
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Users</h1>
        <Link
          to="/dashboard/users/new"
          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
        >
          Add User
        </Link>
      </div>

      <form
        onSubmit={handleSubmit(onFilter)}
        className="space-x-2 mb-4 flex items-end"
      >
        <div>
          <label>Name</label>
          <input {...register("name")} className="border px-2 py-1" />
        </div>
        <div>
          <label>Email</label>
          <input {...register("email")} className="border px-2 py-1" />
        </div>
        <div>
          <label>Role</label>
          <select {...register("role")} className="border px-2 py-1">
            <option value="">All</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Filter
          </button>
        </div>
      </form>

      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Role</th>
            <th className="px-4 py-2 border">Profile Pic</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id || u.id}>
              <td className="px-4 py-2 border">{u.name}</td>
              <td className="px-4 py-2 border">{u.email}</td>
              <td className="px-4 py-2 border">{u.role}</td>
              <td className="px-4 py-2 border">
                {u.profilePicPath ? (
                  <img
                    src={`${
                      import.meta.env.VITE_API_BASE_URL ||
                      "http://localhost:9000"
                    }${u.profilePicPath}`}
                    alt="pic"
                    className="h-12 w-12 object-cover rounded-full"
                  />
                ) : (
                  "-"
                )}
              </td>
              <td className="px-4 py-2 border space-x-2">
                <button
                  onClick={() => navigate(`/dashboard/users/${u._id || u.id}`)}
                  className="text-blue-500 border border-blue-500 px-2 py-1 rounded hover:bg-blue-600 hover:text-white"
                >
                  Edit
                </button>

                {u?.role !== "admin" && (
                  <button
                    onClick={() => handleDelete(u._id || u.id)}
                    className="text-red-500 border border-red-500 px-2 py-1 rounded hover:bg-red-600 hover:text-white"
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4">
        <button
          disabled={meta.page <= 1}
          onClick={() => fetchUsers({ page: meta.page - 1, limit: meta.limit })}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-3">{meta.page}</span>
        <button
          disabled={meta.page * meta.limit >= meta.total}
          onClick={() => fetchUsers({ page: meta.page + 1, limit: meta.limit })}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
