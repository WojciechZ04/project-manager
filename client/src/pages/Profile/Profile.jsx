import React, { useEffect, useState } from "react";
import EditModal from "./components/EditModal";
import DeleteModal from "./components/DeleteModal";
import Button from "@mui/material/Button";
import "./Profile.css";
import { BASE_URL } from "../../config";

export default function Profile() {
  const [profile, setProfile] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editType, setEditType] = useState("");
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = () => {
    const token = localStorage.getItem("token");
    fetch(`${BASE_URL}/api/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProfile(data[0]);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleEditClick = (type, value) => {
    setEditType(type);
    setEditValue(value)
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleSave = (type, newValue) => {
    const updatedProfile = {
      ...profile,
      [type]: newValue,
    };

    const token = localStorage.getItem("token");
    fetch(`${BASE_URL}/api/profile/${profile.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedProfile),
    })
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setIsEditModalOpen(false);
      })
      .catch((error) => {
        console.error("Error updating data:", error);
      });
  };

  const handleDelete = () => {
    const token = localStorage.getItem("token");
    fetch(`${BASE_URL}/api/profile/${profile.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      if (res.ok) {
        window.location.href = "/login";
      } else {
        return res.json().then((data) => {
          throw new Error(data.message);
        });
      }
    })
    .catch((error) => {
      console.error("Error deleting profile:", error);
    });
    };

  return (
    <div className="container profile">
      <div className="profile-image-container">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png"
          alt="Profile"
          className="profile-image"
        />
        <i className="material-icons edit-icon">edit</i>
      </div>
      <div className="profile-data">
        <div className="inline">
          <p>Username: </p>
          <p>{profile.username}</p>
          <i
            className="material-icons profile-icon"
            onClick={() => handleEditClick("username", profile.username)}
          >
            edit
          </i>
        </div>
        <div className="inline">
          <p>Email: </p>
          <p>{profile.email}</p>
          <i
            className="material-icons profile-icon"
            onClick={() => handleEditClick("email", profile.email)}
          >
            edit
          </i>
        </div>
        <div className="inline">
          <p>Password: </p>
          <p>****************</p>
          <i
            className="material-icons profile-icon"
            onClick={() => handleEditClick("password")}
          >
            edit
          </i>
        </div>
      </div>
      <Button className="delete" onClick={handleDeleteClick}>
        DELETE ACCOUNT
      </Button>

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        editType={editType}
        editValue={editValue}
        onSave={handleSave}
      />
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDelete}
      />
    </div>
  );
}
