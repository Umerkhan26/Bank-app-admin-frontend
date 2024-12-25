// StyledComponents.js
import styled from "styled-components";
import { Link } from "react-router-dom";

export const AdminPanel = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

export const Navbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8f9fa;
  padding: 10px 20px;
  color: #0c313f;
`;

export const NavbarLogo = styled(Link)`
  display: flex;
  align-items: center;

  img {
    height: 40px;
  }
`;

export const NavbarList = styled.div`
  display: flex;
`;

export const NavbarItem = styled(Link)`
  color: #0c313f;
  text-decoration: none;
  margin: 0 15px;

  &:hover {
    color: #007bff;
  }
`;

export const AuthButtons = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

export const AdminName = styled.span`
  margin-left: 5px;
  color: #0c313f;
  font-weight: light;
  cursor: pointer;
`;

export const Dropdown = styled.div`
  position: absolute;
  top: 50px;
  background-color: white;
  border: 1px solid #ccc;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: ${(props) => (props.show ? "block" : "none")};
  z-index: 100;
`;

export const DropdownItem = styled.div`
  padding: 10px;
  cursor: pointer;

  &:hover {
    background-color: #f1f1f1;
  }
`;

export const AdminLayoutContainer = styled.div`
  display: flex;
  flex: 1;
  background: #fff;
`;

export const Sidebar = styled.nav`
  width: ${({ width }) => width || "250px"};
  height: 480px;
  background-color: white;
  color: black;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
`;

export const SidebarList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

export const SidebarItem = styled.li`
  margin: 10px 0;
`;

export const SidebarLink = styled(Link)`
  text-decoration: none;
  // color: #007bff;
  color: #1a8797;
  padding: 10px;
  font-weight: 600;
  display: block;
  transition: background-color 0.3s;

  &:hover {
    color: #1a8797;
    // background-color: rgba(0, 123, 255, 0.1);
    background-color: rgb(236, 236, 236);
  }
`;

export const AdminContent = styled.main`
  flex: 1;
  padding: 20px;
`;

export const ProfilePic = styled.img`
  height: 40px;
  border-radius: 50%;
  font-size:"20px"
  margin-left: 80px;
  cursor: pointer;
`;

export const NotificationIcon = styled.span`
  cursor: pointer;
  margin-right: 10px;
  position: relative;
  right: -310px;
  font-size: 22px;
  bottom: -4px;
  color: #1a8797;
`;

export const DropdownIcon = styled.span`
  margin-left: 5px;
  position: relative;
  top: -6px;
  cursor: pointer;
  font-size: 44px;
`;

interface HeadingProps {
  isDashboard?: boolean; // Define the prop
}

export const Heading = styled.h1<HeadingProps>`
  @apply text-4xl font-extrabold text-center mt-8 mb-4 tracking-tight;

  /* Conditional Background */
  background: ${(props) => (props.isDashboard ? "#333333" : "#3b82f6")};
  -webkit-background-clip: text;
  color: transparent;

  /* Conditional Text Shadow */
  text-shadow: ${(props) =>
    props.isDashboard
      ? "0 4px 6px rgba(255, 255, 255, 0.2)"
      : "0 4px 6px rgba(0, 0, 0, 0.1)"};
`;
