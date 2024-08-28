import "./App.css";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import AuthOutlet from "@auth-kit/react-router/AuthOutlet";

import Home from "./pages/Home/Home";
import Login from "./pages/Sign/Login";
import Signup from "./pages/Sign/Signup";
import Projects from "./pages/Projects/Projects";
import ProjectDetails from "./pages/ProjectDetails/ProjectDetails";
import Tasks from "./pages/Tasks/Tasks";
import Navbar from "./components/Navbar/Navbar";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile/Profile";

function App() {
  function usePathname() {
    const location = useLocation();
    return location.pathname;
  }

  const Layout = () => {
    const pathname = usePathname();
    const showNavbar = pathname !== "/login" && pathname !== "/signup";

    return (
      <>
        {showNavbar && <Navbar />}
        <div id="main">
          <Routes>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/signup" element={<Signup />}></Route>
            <Route element={<AuthOutlet fallbackPath="/login" />}>
              <Route path="/profile" element={<Profile />}></Route>
              <Route path="/projects" element={<Projects />}></Route>
              <Route
                path="/projects/:projectId"
                element={<ProjectDetails />}
              ></Route>
              <Route path="/tasks" element={<Tasks />}></Route>
              <Route path="/" element={<Home />}></Route>
              <Route path="*" element={<NotFound />}></Route>
            </Route>
          </Routes>
        </div>
      </>
    );
  };

  return (
    <div className="App">
      <Router>
        <Layout />
      </Router>
    </div>
  );
}

export default App;
