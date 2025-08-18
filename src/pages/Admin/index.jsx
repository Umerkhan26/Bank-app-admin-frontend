// import React, { useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { Outlet } from "react-router-dom";
// import {
//   AdminPanel,
//   AdminLayoutContainer,
//   AdminContent,
// } from "../styles/Admin.styles";
// import NavbarComponent from "./Navbar";
// import SidebarComponent from "./Sidebar";
// import { changeSidebarType } from "../../store/actions";

// const Layout = () => {
//   const dispatch = useDispatch();
//   const { isPreloader, leftSideBarType } = useSelector((state) => state.Layout);
//   const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

//   useEffect(() => {
//     // Handle preloader
//     if (isPreloader) {
//       document.getElementById("preloader").style.display = "block";
//       document.getElementById("status").style.display = "block";
//       setTimeout(() => {
//         document.getElementById("preloader").style.display = "none";
//         document.getElementById("status").style.display = "none";
//       }, 2500);
//     } else {
//       document.getElementById("preloader").style.display = "none";
//       document.getElementById("status").style.display = "none";
//     }

//     // Scroll to top
//     window.scrollTo(0, 0);
//   }, [isPreloader]);

//   const toggleMenuCallback = () => {
//     if (leftSideBarType === "default") {
//       dispatch(changeSidebarType("condensed", isMobile));
//     } else if (leftSideBarType === "condensed") {
//       dispatch(changeSidebarType("default", isMobile));
//     }
//   };

//   return (
//     <AdminPanel>
//       <div id="preloader">
//         <div id="status">
//           <div className="spinner">
//             <i className="ri-loader-line spin-icon"></i>
//           </div>
//         </div>
//       </div>
//       <NavbarComponent toggleMenuCallback={toggleMenuCallback} />
//       <AdminLayoutContainer>
//         <SidebarComponent />
//         <AdminContent>
//           <Outlet />
//         </AdminContent>
//       </AdminLayoutContainer>
//     </AdminPanel>
//   );
// };

// export default Layout;
