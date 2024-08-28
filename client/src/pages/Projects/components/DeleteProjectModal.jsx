import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import "../../../components/Modal.css";
import { BASE_URL } from "../../../config";

export default function DeleteProjectModal({
  showModal,
  setShowModal,
  project,
}) {
  if (!showModal) return null;

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/projects/${project.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete task");
      }
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete task:", error);
    } finally {
      setShowModal(false);
    }
  };

  return (
    <Modal
      open={showModal}
      onClose={() => setShowModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="modal">
        <h2 id="modal-modal-title">Confirm Delete</h2>
        <p id="modal-modal-description">
          Are you sure you want to delete this task?
        </p>
        <Button onClick={handleDelete}>Yes</Button>
        <Button onClick={() => setShowModal(false)}>No</Button>
      </Box>
    </Modal>
  );
}
