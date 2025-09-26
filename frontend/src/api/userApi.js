import api from "./axiosClient.js";

export async function createUser(data) {
  try {
    const formData = new FormData();

    for (const key in data) {
      if (key === "profilePic" && data[key]?.[0]) {
        formData.append("profilePic", data[key][0]);
      } else {
        formData.append(key, data[key]);
      }
    }

    const response = await api.post("/users", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (err) {
    console.error("Create user error", err);
  }
}

export async function getUserById(id) {
  try {
    const response = await api.get(`/users/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (err) {
    console.error("get user error", err);
  }
}
export async function updateUser(id, data) {
  try {
    delete data.id;
    const formData = new FormData();

    for (const key in data) {
      if (key === "profilePic" && data[key]?.[0]) {
        formData.append("profilePic", data[key][0]);
      } else {
        formData.append(key, data[key]);
      }
    }

    const response = await api.put(`/users/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (err) {
    console.error("Update user error", err);
  }
}
