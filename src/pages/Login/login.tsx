import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { toast } from "react-toastify";
import axios from "axios";
import {
  requestNotificationPermission,
  onForegroundMessage,
  refreshFcmToken,
} from "../../utils/firebase";
import { API_URL } from "../../services/brandService";
import { AddUserButton } from "../../components/users/User.Styles";

interface LoginResponse {
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    address: string;
    isVerified: boolean;
  };
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenFound, setTokenFound] = useState(false); // Track notification permission
  const [notification, setNotification] = useState({ title: "", body: "" }); // Store notification data

  // Request notification permission and handle foreground messages
  useEffect(() => {
    // Request FCM token
    requestNotificationPermission()
      .then((token) => {
        if (token) {
          setTokenFound(true);
          toast.success("Push notifications enabled!");
        } else {
          setTokenFound(false);
          toast.warn("Please enable notifications in your browser settings");
        }
      })
      .catch((error) => {
        console.error("Error requesting notification permission:", error);
        setTokenFound(false);
        toast.error("Failed to enable push notifications");
      });

    // Listen for foreground messages
    onForegroundMessage((payload) => {
      const { notification: { title, body } = {} } = payload;
      setNotification({ title: title || "New Notification", body: body || "" });
      toast.info(
        <div>
          <strong>{title || "New Notification"}</strong>
          <p>{body || ""}</p>
        </div>,
        {
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true,
        }
      );
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 1. Perform login
      const data: LoginResponse = await loginUser(email, password);

      if (!data?.user?._id) {
        throw new Error("Invalid user data received from server");
      }
      if ((data as any).user.userRole !== "admin") {
        throw new Error("Access denied! Only admins are allowed to log in.");
      }

      // 2. Store auth data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Login successful!");

      // 3. Handle FCM token
      await handleFcmToken(data.token, data.user._id, data.user.address);
      navigate("/users");
    } catch (err: any) {
      console.error("Login error:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFcmToken = async (
    token: string,
    userId: string,
    address: string
  ) => {
    try {
      const fcmToast = toast.loading("Setting up push notifications...");
      const fcmToken = await refreshFcmToken();

      if (!fcmToken) {
        toast.update(fcmToast, {
          render: "Notifications permission not granted",
          type: "warning",
          isLoading: false,
          autoClose: 3000,
        });
        throw new Error("Notification permission denied");
      }

      toast.update(fcmToast, {
        render: "Registering device for notifications...",
        type: "info",
        isLoading: true,
      });

      const response = await axios.put(
        `${API_URL}/user/${userId}/fcm-token`,
        { fcmToken, address },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      toast.update(fcmToast, {
        render: "Push notifications enabled!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to enable notifications";
      toast.error(errorMessage, { autoClose: 5000 });
      throw error;
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div
        className="card shadow-sm p-4"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <div className="card-body">
          <h2 className="text-center mb-4">Sign In</h2>

          {error && (
            <div className="alert alert-danger mb-3" role="alert">
              {error}
            </div>
          )}

          {notification.title && (
            <div className="alert alert-info mt-3">
              <strong>{notification.title}</strong>
              <p>{notification.body}</p>
            </div>
          )}

          {/* Display notification permission status */}
          <div className="text-center mb-3">
            {isTokenFound ? (
              <span className="text-success">
                {/* Notification permission enabled 👍 */}
              </span>
            ) : (
              <span className="text-warning">
                {/* Need notification permission ❗ */}
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="d-grid gap-2 mb-3">
              <AddUserButton
                type="submit"
                className="btn btn-success"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </AddUserButton>
            </div>

            <div className="text-center">
              <a href="/forgot-password" className="text-decoration-none">
                Forgot password?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
