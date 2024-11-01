import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../../config";

export default function ProjectDetails() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/projects/${projectId}`, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        });

        if (res.status === 403) {
          throw new Error("Forbidden");
        }

        const data = await res.json();
        setProject(data);
      } catch (error) {
        if (error.message.includes("Forbidden")) {
          window.location.href = "/projects";
          alert("You are not authorized to access these projects.");
        } else {
          console.error("Error fetching data:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    if (!hasFetched.current) {
      fetchProject();
      hasFetched.current = true;
    }
  }, [projectId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container centered">
      <div className="title">
        <h1>Oh no, you got me!</h1>
      </div>
      <p>Sorry, but I still work on this one!</p>
    </div>
  );
}
