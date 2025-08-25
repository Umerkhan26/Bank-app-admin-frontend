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
    const unsubscribePromise = onForegroundMessage((payload) => {
      console.log("Foreground message received:", payload);
      toast.info(
        <div>
          <h5>{payload.notification?.title}</h5>
          <p>{payload.notification?.body}</p>
        </div>
      );
    });

    return () => {
      unsubscribePromise.then((unsubscribe) => {
        if (typeof unsubscribe === "function") {
          unsubscribe();
        }
      });
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
