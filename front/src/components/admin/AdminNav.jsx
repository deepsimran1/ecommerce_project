import React, { useEffect, useRef, useState } from "react";
import "./admin.css";
import { Nav, NavDropdown } from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  faUser,
  faSignOutAlt,
  faCog,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { faBell as farBell } from "@fortawesome/free-regular-svg-icons";
import Logo from './../logo/logo.png'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { parse } from "@fortawesome/fontawesome-svg-core";
export default function AdminNav() {
  const [adminName, setAdminName] = useState("");
  const [adminImage, setAdminImage] = useState();
  const [notifications, setNotifications] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);

  const navigate = useNavigate();
  const searchRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logged out successfully");
    navigate("/admin");
  };

  const handleSearch = () => {
    const matchedRoute = findMatchingRoute(searchInput);
    if (matchedRoute) {
      navigate(matchedRoute);
    }
  };

  const handleSearchChange = (e) => {
    const searchText = e.target.value;
    setSearchInput(searchText);
    const newSuggestions = getSuggestions(searchText);
    setSuggestions(newSuggestions);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  const handleSearchIconClick = () => {
    handleSearch();
  };
  const handleSuggestionClick = (suggestion) => {
    navigate(suggestion.route);
    setSearchInput("");
    setSuggestions([]);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const findMatchingRoute = (searchText) => {
    const lowerCaseSearch = searchText.toLowerCase();
    const routes = [
      "/admin/home",
      "/admin/profile",
      "/admin/products",
      "/admin/customers",
      "/admin/addproduct",
      "/admin/addCustomer",
    ];
    for (const route of routes) {
      if (route.includes(lowerCaseSearch)) {
        return route;
      }
    }
    return null;
  };

  const getSuggestions = (searchText) => {
    const lowerCaseSearch = searchText.toLowerCase();
    const matchedSuggestions = [];

    const routes = [
      { route: "/admin/home", label: "Admin Home" },
      { route: "/admin/profile", label: "Admin Profile" },
      { route: "/admin/products", label: "Add Products" },
      { route: "/admin/customers", label: "All Users" },
      { route: "/admin/addproduct", label: "Add Product" },
      { route: "/admin/addCustomer", label: "Add Customers" },
    ];

    for (const route of routes) {
      if (route.label.toLowerCase().includes(lowerCaseSearch)) {
        matchedSuggestions.push(route);
      }
    }

    return matchedSuggestions;
  };

  const handleSetting = () => {
    navigate("/admin/profile", { state: { edit: true } });
  };

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:4000/users/adminProfile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const adminData = response.data;
        if (adminData && adminData.name && adminData.image) {
          setAdminName(adminData.name);
          setAdminImage(adminData.image);
        }

        const notificationsResponse = await axios.get(
          "http://localhost:4000/users/getNotification"
        );

        const notificationsData = notificationsResponse.data;
        console.log("notification", notificationsData);
        setNotifications(notificationsData);

        // const storedCount = localStorage.getItem("notificationCount");
        // setNotificationCount(storedCount ? parseInt(storedCount,10):notificationsData.length);
        // setNotificationCount(notificationsData.length);

        const unreadNotificationsResponse = await axios.get(
          "http://localhost:4000/users/getunreadNotification"
        );

        const unreadNotifications = unreadNotificationsResponse.data;
        setNotificationCount(unreadNotifications.length);
      } catch (error) {
        console.error("error fetching admin profile,", error);
      }
    };

    fetchAdminProfile();
  }, []);

  const handleNotificationClick = async (notification) => {
    try {
      await axios.patch(
        `http://localhost:4000/users/readNotification/${notification._id}/read`
      );
      if (notification.type === 0) {
        navigate("/admin/contactUser");
      } else if (notification.type === 1) {
        navigate("/admin/products");
      }
      else if (notification.type === 2) {
        navigate("/admin/customers");
      }
      setNotificationCount(notificationCount - 1);
    } catch (error) {
      console.error("Error marking notification as read", error);
    }

    // setNotificationCount((prevCount)=>{
    //   const newCount = Math.max(prevCount - 1,0);
    //   localStorage.setItem("notificationCount",newCount.toString());
    //   return newCount;
    // });
  };

  const groupNotificationsByType = (notification)=>{
    const groupedNotifications = {};

    for(const notification of notifications){
      if (!groupedNotifications[notification.type]){
        groupedNotifications[notification.type] = [notification];
      }else{
        groupedNotifications[notification.type].push(notification);
      }
    }
    return groupedNotifications;
  }

  const groupedNotifications = groupNotificationsByType(notifications);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="/admin/home">
          <img src={Logo} alt="logo" className="logo-img" />
          </a>
          
          <form ref={searchRef} className="me-3" onSubmit={handleSearchSubmit}>
            <div className="input-group">
              <input
                className="form-control bg-light"
                type="text"
                placeholder={searchInput ? "" : "Search for..."}
                value={searchInput}
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress}
              />
              <span
                className="input-group-text cursor-pointer"
                onClick={handleSearchIconClick}
              >
                <FontAwesomeIcon icon={faSearch} />
              </span>
            </div>

            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <div className="dropdown-menu show">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.route}
                    className="dropdown-item"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.label}
                  </button>
                ))}
              </div>
            )}
          </form>

          <div>
            <Nav className="ms-auto">
              <div className="notification-icon">
                {notificationCount > 0 && (
                  <div className="notification-badge-3 p-1">
                    {notificationCount}
                  </div>
                )}{" "}
              </div>
              <NavDropdown
                title={
                  <span>
                    <FontAwesomeIcon
                      icon={farBell}
                      className="notification-bell mt-2  p-0"
                    />
                  </span>
                }
              >
                {notifications.filter(notification=> !notification.read).length > 0 ? (
                  notifications.map((notification) => (
                    <>
                      {!notification.read && (
                        <NavDropdown.Item
                          key={notification._id}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div>{notification.content}</div>
                        </NavDropdown.Item>
                      )}
                      <NavDropdown.Divider />
                    </>
                  ))
                ) : (
                  <NavDropdown.Item>
                    <div>No notifications</div>
                  </NavDropdown.Item>
                )}
              </NavDropdown>

              <div className="notification-icon">
                <div className="notification-badge p-1"></div>
              </div>
              <NavDropdown
                title={
                  <img
                    src={`http://localhost:4000/${adminImage}`}
                    alt={adminName}
                    className="admin-img"
                  />
                }
                id="adminDropdown"
              >
                <NavDropdown.Item className="d-flex align-items-center">
                  <span className="col-6">
                    <div className="notification-icon">
                      <div className="notification-badge-2 p-1"></div>
                    </div>
                    {
                      <img
                        src={`http://localhost:4000/${adminImage}`}
                        alt={adminName}
                        className="admin-img"
                      />
                    }
                  </span>
                  <span className="col-6">
                    <span className="admin-n">{adminName}</span>
                    <br />
                    <span className="text-muted admin-d">Admin</span>
                  </span>
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/admin/profile">
                  <span>
                    <FontAwesomeIcon icon={faUser} className="text-muted" />
                  </span>
                  <span className="text-muted">Profile</span>
                </NavDropdown.Item>
                <NavDropdown.Item onClick={handleSetting}>
                  <span>
                    {" "}
                    <FontAwesomeIcon icon={faCog} className="text-muted" />
                  </span>
                  <span className="text-muted">Setting</span>
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  <span>
                    {" "}
                    <FontAwesomeIcon
                      icon={faSignOutAlt}
                      className="text-muted"
                    />
                  </span>
                  <span className="text-muted">Logout</span>
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </div>
        </div>
      </nav>
    </>
  );
}
