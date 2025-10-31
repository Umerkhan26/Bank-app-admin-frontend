import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../../services/brandService";

// Styled components
// Updated PageWrapper to remove any constraints
const PageWrapper = styled.div`
  padding: 20px;
  background-color: #fff;
  width: 77vw; // Use viewport width
  margin-left: -20px; // Counteract any parent padding
  margin-right: -20px;
`;

// Updated NotificationCard to be full width
const NotificationCard = styled.div`
  background-color: #fff;
  padding: 30px;
  border-radius: 12px;
  //   width: calc(100% + 20px); // Extend beyond container
  //   margin-left: -30px; // Counteract padding
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  //   position: relative; // For proper positioning
  //   left: -20px; // Pull to the left edge
`;

const NotificationTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #1f2d3d;
  margin-bottom: 25px;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-size: 15px;
  font-weight: 500;
  color: #333;
  margin-bottom: 6px;
  display: block;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 14px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  transition: border 0.3s ease;

  &:focus {
    border-color: #1a8797;
    outline: none;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px 14px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  resize: vertical;
  transition: border 0.3s ease;

  &:focus {
    border-color: #1a8797;
    outline: none;
  }
`;

const SendButton = styled.button`
  width: 100%;
  padding: 10px 0;
  background-color: #1a8797;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #156c7a;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const UserCountBadge = styled.span`
  display: inline-block;
  margin-top: 8px;
  padding: 4px 8px;
  background-color: #e6f7ff;
  color: #1890ff;
  border-radius: 10px;
  font-size: 12px;
`;

export const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const Title = styled.h2`
  margin: 0;
  color: black;
  font-size: 18px;
`;

export const UserCount = styled.span`
  color: #777;
  font-size: 14px;
`;

export const SearchInput = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 200px;
  margin-right: 10px;
`;

export const AddUserButton = styled.button`
  padding: 8px 10px;
  border: none;
  border-radius: 4px;
  background-color: #1a8797;
  color: white;
  cursor: pointer;
`;

const Notifications: React.FC = () => {
  const [city, setCity] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [userCount, setUserCount] = useState<number | null>(null);
  const [isFetchingCount, setIsFetchingCount] = useState(false);

  // Fetch user count when city changes (with debounce)
  useEffect(() => {
    const fetchUserCount = async () => {
      const trimmedCity = city.trim();
      if (!trimmedCity || trimmedCity.length === 0) {
        setUserCount(null);
        return;
      }

      setIsFetchingCount(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        // Updated to send address in the body
        const response = await axios.get(
          `${API_URL}/get-all-users-by-address`,
          {
            params: { address: trimmedCity },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUserCount(response.data.count);
      } catch (error) {
        console.error("Error fetching user count:", error);
        setUserCount(null);

        // Show user-friendly error message
        toast.error("Failed to fetch user count. Please try again.", {
          autoClose: 3000,
        });
      } finally {
        setIsFetchingCount(false);
      }
    };

    const debounceTimer = setTimeout(fetchUserCount, 500);
    return () => clearTimeout(debounceTimer);
  }, [city]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const notificationToast = toast.loading("Sending notification...");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Session expired. Please login again.");
      }

      const response = await axios.post(
        `${API_URL}/sendPushNotification`,
        { city: city.trim(), title, body },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.update(notificationToast, {
        render: response.data.message || "Notification sent successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      if (response.data.recipientsCount) {
        toast.info(`Delivered to ${response.data.recipientsCount} users`, {
          autoClose: 4000,
        });
      }

      // Reset form
      setCity("");
      setTitle("");
      setBody("");
      setUserCount(null);
    } catch (error: any) {
      console.error("Notification error:", error);
      let errorMessage = "Failed to send notification";

      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = error.response.data.error || "Invalid request data";
        } else if (error.response.status === 401) {
          errorMessage = "Please login again";
        } else if (error.response.status === 404) {
          errorMessage = "No users found in the specified location";
        } else if (error.response.data?.error) {
          errorMessage = error.response.data.error;
        }
      } else if (error.message.includes("Network Error")) {
        errorMessage = "Network error. Please check your connection.";
      }

      toast.update(notificationToast, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageWrapper>
        <HeaderSection>
          <div>
            <Title>Push Notification</Title>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <SearchInput type="text" placeholder="Search users..." />
            {/* <AddUserButton>Add User</AddUserButton> */}
          </div>
        </HeaderSection>
        <NotificationCard>
          <NotificationTitle>Send Push Notification</NotificationTitle>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>City</Label>
              <Input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city (e.g., Rawalpindi)"
                required
              />
              {isFetchingCount ? (
                <UserCountBadge>Checking users...</UserCountBadge>
              ) : userCount !== null ? (
                <UserCountBadge>
                  {userCount} users will receive this notification
                </UserCountBadge>
              ) : city.trim() ? (
                <UserCountBadge>No users found in this city</UserCountBadge>
              ) : null}
            </FormGroup>

            <FormGroup>
              <Label>Title</Label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter notification title"
                required
                maxLength={50}
              />
            </FormGroup>

            <FormGroup>
              <Label>Message</Label>
              <TextArea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Enter notification message"
                rows={4}
                required
                maxLength={200}
              />
            </FormGroup>

            <SendButton type="submit" disabled={loading || isFetchingCount}>
              {loading ? "Sending..." : "Send Notification"}
            </SendButton>
          </form>
        </NotificationCard>
      </PageWrapper>
    </div>
  );
};

export default Notifications;
