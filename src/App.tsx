// import AppRoutes from "./routes/AppRoutes";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "react-toastify/dist/ReactToastify.css";
// import { ToastContainer } from "react-toastify";
// import { BrowserRouter as Router } from "react-router-dom";
// import axios from "axios";
// import { logout } from "./utils/authUtils";
// axios.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       logout();
//     }
//     return Promise.reject(error);
//   }
// );

// function App() {
//   return (
//     <Router>
//       <AppRoutes />
//       <ToastContainer position="top-right" autoClose={3000} />
//     </Router>
//   );
// }

// export default App;

import AppRoutes from "./routes/AppRoutes";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { BrowserRouter as Router } from "react-router-dom";
import axios from "axios";
import { logout } from "./utils/authUtils";
import { onForegroundMessage } from "./utils/firebase";
import { useEffect } from "react";

// Axios response interceptor
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      logout();
    }
    return Promise.reject(error);
  }
);

function App() {
  useEffect(() => {
    // Handle foreground messages
    const unsubscribe = onForegroundMessage((payload) => {
      console.log("Foreground message received:", payload);

      // Display notification using toast
      toast.info(
        <div>
          <h5>{payload.notification?.title}</h5>
          <p>{payload.notification?.body}</p>
        </div>,
        {
          position: "top-right",
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true,
        }
      );

      // Handle custom data payload
      if (payload.data) {
        console.log("Notification data:", payload.data);
        // Add custom logic here based on payload.data
      }
    });

    return () => {
      // Cleanup if needed
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

  return (
    <Router>
      <AppRoutes />
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
