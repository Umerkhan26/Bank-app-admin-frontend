import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import adminPic from "../../assets/adminpic.jpeg";
import { BsFillAwardFill } from "react-icons/bs";
import {
  AdminPanel,
  Navbar,
  NavbarList,
  // NavbarItem,
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
  // NotificationIcon,
  DropdownIcon,
  ProfilePic,
  // SearchBar,
  Logo,
  SidebarHeader,
  SidebarIcon,
  SidebarText,
  SidebarScrollWrapper,
  SidebarDisabled,
} from "./Admin.styles";
import {
  MdBrandingWatermark,
  MdCampaign,
  MdOutlineArrowDropDown,
} from "react-icons/md";
import { RiBankLine } from "react-icons/ri";
import {
  FaFileInvoiceDollar,
  FaGift,
  FaLocationDot,
  FaQrcode,
  FaReceipt,
} from "react-icons/fa6";
import { IoNotifications } from "react-icons/io5";
import { FaRegListAlt, FaUsers } from "react-icons/fa";
import { AiOutlineDashboard } from "react-icons/ai";
import { checkAuth, logout } from "../../utils/authUtils";
import logo from "../../assets/BANKS CURVED LOGO-09.png";

const Admin: React.FC = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Initial auth check
  useEffect(() => {
    if (!checkAuth()) {
      logout();
    }
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleSignOut = () => {
    logout();
  };

  return (
    <AdminPanel>
      <AdminLayoutContainer>
        <Sidebar width="270px" bgColor="#2a3042">
          <SidebarHeader>
            <Logo>
              {" "}
              <img
                src={logo}
                alt="BankApp Logo"
                style={{
                  maxHeight: "90px",
                  width: "auto",
                  marginLeft: "17px",
                  cursor: "pointer",
                }}
              />
            </Logo>
          </SidebarHeader>

          <SidebarScrollWrapper>
            <SidebarList>
              <SidebarItem>
                <SidebarDisabled>
                  <SidebarIcon>
                    <AiOutlineDashboard />
                  </SidebarIcon>
                  <SidebarText>Dashboard</SidebarText>
                </SidebarDisabled>
              </SidebarItem>

              <SidebarItem>
                <SidebarLink to="/users">
                  <SidebarIcon>
                    <FaUsers />
                  </SidebarIcon>
                  <SidebarText>Users</SidebarText>
                </SidebarLink>
              </SidebarItem>
              <SidebarItem>
                <SidebarLink to="/usersRedeemDetails">
                  <SidebarIcon>
                    <FaRegListAlt />
                  </SidebarIcon>
                  <SidebarText>User Redeem Details</SidebarText>
                </SidebarLink>
              </SidebarItem>
              <SidebarItem>
                <SidebarLink to="/brand">
                  <SidebarIcon>
                    <MdBrandingWatermark />
                  </SidebarIcon>
                  <SidebarText>Brands</SidebarText>
                </SidebarLink>
              </SidebarItem>

              <SidebarItem>
                <SidebarLink to="/campaigns">
                  <SidebarIcon>
                    <MdCampaign />
                  </SidebarIcon>
                  <SidebarText>Campaigns</SidebarText>
                </SidebarLink>
              </SidebarItem>

              <SidebarItem>
                <SidebarLink to="/stores">
                  <SidebarIcon>
                    <FaLocationDot />
                  </SidebarIcon>
                  <SidebarText>Stores</SidebarText>
                </SidebarLink>
              </SidebarItem>

              <SidebarItem>
                <SidebarLink to="/promotions">
                  <SidebarIcon>
                    <BsFillAwardFill />
                  </SidebarIcon>
                  <SidebarText>Promotions</SidebarText>
                </SidebarLink>
              </SidebarItem>

              <SidebarItem>
                <SidebarLink to="/qrcodes">
                  <SidebarIcon>
                    <FaQrcode />
                  </SidebarIcon>
                  <SidebarText>QR Codes</SidebarText>
                </SidebarLink>
              </SidebarItem>

              <SidebarItem>
                <SidebarLink to="/notifications">
                  <SidebarIcon>
                    <IoNotifications />
                  </SidebarIcon>
                  <SidebarText>Notifications</SidebarText>
                </SidebarLink>
              </SidebarItem>

              <SidebarItem>
                <SidebarLink to="/bank-premium">
                  <SidebarIcon>
                    <AiOutlineDashboard />
                  </SidebarIcon>
                  <SidebarText>Bank Premium</SidebarText>
                </SidebarLink>
              </SidebarItem>
              <SidebarItem>
                <SidebarLink to="/bank-premium-redeem-details">
                  <SidebarIcon>
                    <FaFileInvoiceDollar />
                  </SidebarIcon>
                  <SidebarText>Bank Premium Redeem Details</SidebarText>
                </SidebarLink>
              </SidebarItem>

              <SidebarItem>
                <SidebarLink to="/additional-items">
                  <SidebarIcon>
                    <FaGift />
                  </SidebarIcon>
                  <SidebarText>Additional Items</SidebarText>
                </SidebarLink>
              </SidebarItem>

              <SidebarItem>
                <SidebarLink to="/additional-items-leaderboard">
                  <SidebarIcon>
                    <FaReceipt />
                  </SidebarIcon>
                  <SidebarText>Additional Items Radeem Details </SidebarText>
                </SidebarLink>
              </SidebarItem>

              <SidebarItem>
                <SidebarLink to="/bank-offer">
                  <SidebarIcon>
                    <RiBankLine />
                  </SidebarIcon>
                  <SidebarText>Bank Offer</SidebarText>
                </SidebarLink>
              </SidebarItem>
              {/* <SidebarItem>
                <SidebarIcon>
                  <AiOutlineDashboard />
                </SidebarIcon>
                <SidebarText>Settings </SidebarText>
              </SidebarItem> */}

              <SidebarItem>
                <SidebarLink to="/reports">
                  <SidebarIcon>
                    <AiOutlineDashboard />
                  </SidebarIcon>
                  <SidebarText>Reports</SidebarText>
                </SidebarLink>
              </SidebarItem>
            </SidebarList>
          </SidebarScrollWrapper>
        </Sidebar>

        <div>
          <Navbar>
            {/* <SearchBar type="text" placeholder="Search..." /> */}
            <NavbarList>
              {/* <NavbarItem to={"#"}>
                <NotificationIcon className="fas fa-bell" />
              </NavbarItem> */}
            </NavbarList>
            <AuthButtons>
              <ProfilePic src={adminPic} alt="Admin Profile" />
              <AdminName>{user.name}</AdminName>
              <DropdownIcon onClick={toggleDropdown}>
                <MdOutlineArrowDropDown />
              </DropdownIcon>
              <Dropdown show={dropdownVisible}>
                <DropdownItem onClick={handleSignOut}>Sign Out</DropdownItem>
              </Dropdown>
            </AuthButtons>
          </Navbar>

          <AdminContent>
            <Outlet />
          </AdminContent>
        </div>
      </AdminLayoutContainer>
    </AdminPanel>
  );
};

export default Admin;
