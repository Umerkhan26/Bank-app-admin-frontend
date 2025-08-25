import styled from "styled-components";
import { Link } from "react-router-dom";

interface DropdownProps {
  show: boolean;
}

interface SidebarProps {
  width?: string;
  bgColor?: string;
}

export const AdminPanel = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

export const AdminLayoutContainer = styled.div`
  display: flex;
  flex: 1;
`;

export const Sidebar = styled.nav<SidebarProps>`
  width: ${({ width }) => width || "270px"};
  background-color: ${({ bgColor }) => bgColor || "#2a3042"};
  color: #ffffff;
  padding: 20px 0;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  position: fixed;
  height: 100vh;
  top: 0;
  left: 0;
`;

export const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #ffffff;
  padding: 10px 20px;
  border-bottom: 1px solid #3b4b66;
`;

export const SidebarList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-top: 20px;
`;

export const Navbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  padding: 10px 20px;
  color: #2a3042;
  width: calc(100% - 270px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 270px;
  z-index: 1000;
`;

export const SearchBar = styled.input`
  padding: 5px 10px;
  margin: 0 20px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  background-color: #ffffff;
  color: #2a3042;
`;

export const NavbarList = styled.div`
  display: flex;
`;

export const NavbarItem = styled(Link)`
  color: #2a3042;
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
  margin-left: 10px;
  color: #2a3042;
  font-weight: 500;
  cursor: pointer;
`;

export const Dropdown = styled.div<DropdownProps>`
  position: absolute;
  top: 40px;
  right: 0;
  background-color: #ffffff;
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

export const AdminContent = styled.main`
  flex: 1;
  padding: 20px;
  margin-left: 270px;
  margin-top: 60px; /* Adjust to prevent overlap with navbar */
  width: calc(100% - 270px);
  overflow: hidden; /* Prevent unwanted scroll on the entire content */
`;

export const ProfilePic = styled.img`
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
`;

export const NotificationIcon = styled.span`
  cursor: pointer;
  font-size: 22px;
  color: #2a3042;
`;

export const DropdownIcon = styled.span`
  margin-left: 5px;
  cursor: pointer;
  font-size: 24px;
  color: #2a3042;
`;

interface HeadingProps {
  isDashboard?: boolean;
}

export const Heading = styled.h1<HeadingProps>`
  font-size: 24px;
  font-weight: bold;
  color: #2a3042;
  margin-bottom: 20px;
`;

export const SidebarHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

export const SidebarText = styled.span`
  flex-grow: 1;
  font-size: 14px;
`;

export const SidebarBadge = styled.span`
  background-color: #0acf97;
  color: #ffffff;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 6px;
  border-radius: 10px;
  margin-left: 10px;
`;

export const SidebarScrollWrapper = styled.div`
  height: calc(100vh - 70px);
  overflow-y: auto;
  padding-bottom: 20px;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

// Update these existing components for tighter spacing:
export const SidebarItem = styled.li`
  margin: 4px 0;
`;

export const SidebarIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-right: 10px;
  font-size: 16px;
  opacity: 0.8;
`;

export const SidebarDivider = styled.div`
  height: 1px;
  background-color: rgba(255, 255, 255, 0.1);
  margin: 10px 20px;
`;

export const SidebarSectionTitle = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 8px 20px;
  margin-top: 5px;
`;

export const SidebarLink = styled(Link)`
  text-decoration: none;
  color: #ffffff;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  font-weight: 400;
  transition: all 0.3s ease;
  border-radius: 4px;
  margin: 0 10px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: #fff;

    ${SidebarIcon} {
      opacity: 1;
    }
  }

  &.active {
    background-color: rgba(255, 255, 255, 0.15);
    font-weight: 500;

    ${SidebarIcon} {
      opacity: 1;
    }
  }
`;

export const SidebarDisabled = styled.div`
  text-decoration: none;
  color: #aaa;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  font-weight: 400;
  border-radius: 4px;
  margin: 0 10px;
  cursor: not-allowed;
  opacity: 0.6;
`;
