import { Modal, Box, Button } from "@mui/material";
import "../../../components/Modal.css";
import { BASE_URL } from "../../../config";

export default function DeleteTaskModal({ showModal, setShowModal, task, fetchTasks }) {
	if (!showModal) return null;

	const handleDelete = async () => {
		try {
		  const response = await fetch(
			`${BASE_URL}/api/tasks/${task.project_id}/${task.id}`,
			{
			  method: "DELETE",
			  headers: {
				Authorization: "Bearer " + localStorage.getItem("token"),
				"Content-Type": "application/json",
			  },
			}
		  );
		  if (!response.ok) {
			throw new Error("Failed to delete task");
		  }
		  fetchTasks();
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
          <p id="modal-modal-description">Are you sure you want to delete this task?</p>
          <Button onClick={handleDelete}>Yes</Button>
          <Button onClick={() => setShowModal(false)}>No</Button>
        </Box>
      </Modal>
	  )
}