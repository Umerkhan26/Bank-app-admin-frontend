// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link, useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import {
//   Navbar,
//   NavbarLogo,
//   NavbarList,
//   NavbarItem,
//   AuthButtons,
//   AdminName,
//   Dropdown,
//   DropdownItem,
//   ProfilePic,
//   NotificationIcon,
//   DropdownIcon,
//   Heading,
//   MenuIcon,
// } from "../styles/Admin.styles";
// import { toggleRightSidebar } from "../../store/actions";
// import { MdOutlineArrowDropDown, MdNotifications } from "react-icons/md";
// import logo from "../../assets/logo.png";
// import adminPic from "../../assets/adminpic.jpeg";

// const NavbarComponent = ({ toggleMenuCallback }) => {
//   const { t } = useTranslation();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [dropdownVisible, setDropdownVisible] = useState(false);
//   const { layoutType } = useSelector((state) => state.Layout);

//   const toggleDropdown = () => {
//     setDropdownVisible(!dropdownVisible);
//   };

//   const toggleRightbar = () => {
//     dispatch(toggleRightSidebar());
//   };

//   const toggleFullscreen = () => {
//     if (
//       !document.fullscreenElement &&
//       !document.mozFullScreenElement &&
//       !document.webkitFullscreenElement
//     ) {
//       if (document.documentElement.requestFullscreen) {
//         document.documentElement.requestFullscreen();
//       } else if (document.documentElement.mozRequestFullScreen) {
//         document.documentElement.mozRequestFullScreen();
//       } else if (document.documentElement.webkitRequestFullscreen) {
//         document.documentElement.webkitRequestFullscreen(
//           Element.ALLOW_KEYBOARD_INPUT
//         );
//       }
//     } else {
//       if (document.cancelFullScreen) {
//         document.cancelFullScreen();
//       } else if (document.mozCancelFullScreen) {
//         document.mozCancelFullScreen();
//       } else if (document.webkitCancelFullScreen) {
//         document.webkitCancelFullScreen();
//       }
//     }
//   };

//   const handleSignOut = () => {
//     console.log("Signed out");
//     navigate("/login");
//   };

//   return (
//     <Navbar>
//       <NavbarLogo to="/">
//         <img src={logo} alt="Logo" />
//       </NavbarLogo>
//       <Heading>ADMIN DASHBOARD</Heading>
//       <NavbarList>
//         <NavbarItem to="/notifications">
//           <NotificationIcon>
//             <MdNotifications />
//           </NotificationIcon>
//         </NavbarItem>
//         <NavbarItem onClick={toggleFullscreen}>
//           <NotificationIcon className="ri-fullscreen-line" />
//         </NavbarItem>
//         <NavbarItem onClick={toggleMenuCallback}>
//           <MenuIcon className="ri-menu-2-line" />
//         </NavbarItem>
//       </NavbarList>
//       <AuthButtons>
//         <ProfilePic src={adminPic} alt="Admin Profile" />
//         <AdminName>Jane Smith</AdminName>
//         <DropdownIcon onClick={toggleDropdown}>
//           <MdOutlineArrowDropDown />
//         </DropdownIcon>
//         <Dropdown show={dropdownVisible}>
//           <DropdownItem onClick={handleSignOut}>{t("Sign Out")}</DropdownItem>
//           <DropdownItem onClick={toggleRightbar}>{t("Settings")}</DropdownItem>
//         </Dropdown>
//       </AuthButtons>
//     </Navbar>
//   );
// };

// export default NavbarComponent;
