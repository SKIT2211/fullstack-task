import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getUserById } from "../api/userApi";
import { useParams } from "react-router-dom";

export default function UserForm({
  schema,
  defaultValues = {},
  onSubmit,
  isEdit = false,
}) {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const params = useParams();
  const handleGetUser = async () => {
    const resp = await getUserById(params.id);
    reset(resp);
  };

  useEffect(() => {
    reset(defaultValues);
    if (params?.id) {
      handleGetUser();
    }
  }, []);

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit({ ...data, id: params.id }))}
      className="space-y-4"
    >
      <div>
        <label className="block">Name</label>
        <input {...register("name")} className="w-full border px-2 py-1" />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block">Email</label>
        <input
          {...register("email")}
          className="w-full border px-2 py-1"
          disabled={isEdit}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block">Phone</label>
        <input
          {...register("phone")}
          className="w-full border px-2 py-1"
          disabled={isEdit}
        />
        {errors.phone && (
          <p className="text-red-500 text-sm">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label className="block">Role</label>
        <select
          {...register("role")}
          className="w-full border px-2 py-1"
          disabled={isEdit}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        {errors.role && (
          <p className="text-red-500 text-sm">{errors.role.message}</p>
        )}
      </div>

      {!isEdit && (
        <div>
          <label className="block">Password</label>
          <input
            type="password"
            {...register("password")}
            className="w-full border px-2 py-1"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>
      )}

      <div>
        <label className="block">Profile Picture</label>
        <img
          src={`${
            import.meta.env.VITE_API_BASE_URL || "http://localhost:9000"
          }${getValues("profilePicPath")}`}
          alt="pic"
          className="h-12 w-12 m-4 object-cover rounded-full"
        />
        <input
          type="file"
          accept="image/*"
          {...register("profilePic")}
          className="w-full border border-gray-300 px-2 py-1 rounded focus:border-blue-500 focus:outline-none"
        />
        {errors.profilePic && (
          <p className="text-red-500 text-sm">{errors.profilePic.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {isEdit ? "Update" : "Create"}
      </button>
    </form>
  );
}
