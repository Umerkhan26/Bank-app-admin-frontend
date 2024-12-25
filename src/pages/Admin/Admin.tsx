import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import adminPic from "../../assets/adminpic.jpeg";
import { BsFillAwardFill } from "react-icons/bs";
import "../../index.css";
import {
  AdminPanel,
  Navbar,
  NavbarList,
  NavbarItem,
  AuthButtons,
  AdminName,
  Dropdown,
  DropdownItem,
  AdminLayoutContainer,
  Sidebar,
  SidebarList,
  SidebarItem,
  SidebarLink,
  AdminContent,
  NotificationIcon,
  DropdownIcon,
  Heading,
  ProfilePic,
} from "./Admin.styles";
import { MdCampaign, MdOutlineArrowDropDown } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
import { AiOutlineDashboard } from "react-icons/ai";

const Admin: React.FC = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleSignOut = () => {
    console.log("Signed out");
  };

  return (
    <AdminPanel>
      <Navbar>
        {/* <NavbarLogo to="/">
          <img src="/src/assets/logo.png" alt="Legacy" />
        </NavbarLogo> */}
        <Heading isDashboard={true}>ADMIN DASHBOARD</Heading>
        <NavbarList>
          <NavbarItem to="/notifications">
            <NotificationIcon className="fas fa-bell" />
          </NavbarItem>
        </NavbarList>
        <AuthButtons>
          <ProfilePic src={adminPic} alt="Admin Profile" />
          <AdminName>Jane Smith</AdminName>
          {/* <DropdownIcon onClick={toggleDropdown}>▼</DropdownIcon>{" "} */}
          <DropdownIcon onClick={toggleDropdown}>
            <MdOutlineArrowDropDown />
          </DropdownIcon>{" "}
          {/* Angle down arrow */}
          <Dropdown show={dropdownVisible}>
            <DropdownItem onClick={handleSignOut}>Sign Out</DropdownItem>
          </Dropdown>
        </AuthButtons>
      </Navbar>
      <AdminLayoutContainer>
        <Sidebar width="270px" bgColor="#f8f9fa">
          <SidebarList>
            <SidebarItem>
              <SidebarLink
                to="/admin/dashboard"
                className="flex items-center space-x-2"
              >
                <AiOutlineDashboard
                  className="text-xl"
                  style={{
                    fontSize: "25px",
                    marginBottom: "-6px",
                    marginRight: "10px",
                  }}
                />
                <span
                  style={{
                    fontSize: "17px",
                    position: "relative",
                    top: "6px",
                  }}
                >
                  Dashboard
                </span>
              </SidebarLink>
            </SidebarItem>

            <div
              style={{ borderTop: "2px solid #6B7280", margin: "1rem 0" }}
            ></div>

            <SidebarItem>
              <SidebarLink to="/users">
                <div className="flex items-center text-lg">
                  <FaUsers
                    className="mr-2 text-xl"
                    style={{
                      fontSize: "25px",
                      marginBottom: "-6px",
                      marginRight: "10px",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "17px",
                      position: "relative",
                      top: "6px",
                    }}
                  >
                    Users
                  </span>
                </div>
              </SidebarLink>
            </SidebarItem>

            <SidebarItem>
              <SidebarLink to="/campaigns">
                <div className="flex items-center text-lg">
                  <MdCampaign
                    className="mr-2 text-xl"
                    style={{
                      fontSize: "31px",
                      marginBottom: "-6px",
                      marginRight: "5px",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "17px",
                      position: "relative",
                      top: "5px",
                    }}
                  >
                    Campaign
                  </span>
                </div>
              </SidebarLink>
            </SidebarItem>

            <SidebarItem>
              <SidebarLink to="/stores">
                <div className="flex items-center text-lg">
                  <FaLocationDot
                    className="mr-2 text-xl"
                    style={{
                      fontSize: "23px",
                      marginBottom: "-6px",
                      marginRight: "12px",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "17px",
                      position: "relative",
                      top: "5px",
                    }}
                  >
                    Stores
                  </span>
                </div>
              </SidebarLink>
            </SidebarItem>

            <SidebarItem>
              <SidebarLink to="/promotions">
                <div className="flex items-center text-lg">
                  <BsFillAwardFill
                    className="mr-2 text-xl"
                    style={{
                      fontSize: "23px",
                      marginBottom: "-6px",
                      marginRight: "12px",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "17px",
                      position: "relative",
                      top: "5px",
                    }}
                  >
                    Promotion
                  </span>
                </div>
              </SidebarLink>
            </SidebarItem>
          </SidebarList>
        </Sidebar>
        <AdminContent>
          <Outlet />
        </AdminContent>
      </AdminLayoutContainer>
    </AdminPanel>
  );
};

export default Admin;
