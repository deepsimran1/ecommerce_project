import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSearch } from "./SearchContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faSignOutAlt, faUser,faHeart  } from "@fortawesome/free-solid-svg-icons";
import "./navbar.css";
import Logo from './logo/logo.png';
export default function Navbar() {
  const { searchTerm, setSearchTerm } = useSearch();
  const navigate=useNavigate();
 
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLogout = () =>{
    localStorage.removeItem("token");
    navigate('/login');
  }
  const isLoggedIn = !!localStorage.getItem("token");
  return (
    <>
    <nav>
      <ul>
      <span className="logo-search">
            <Link to="/">
            <img src={Logo}  alt="logo" className="logo-img"/>
            </Link>
            {isLoggedIn && (
              <input type="search"
               placeholder="Search..."
              className="search-input col-lg-8 col-md-6 col-sm-4 col-2"
              value={searchTerm}
              onChange={handleSearch} />
            )}
          </span>
       
        <span className="right">
          {isLoggedIn && (
            <>
            <Link to='/wishlist' className="wishlist-icon">
                <FontAwesomeIcon icon={faHeart} />
              </Link>
              <Link to='/cart' >
              <FontAwesomeIcon icon={faShoppingCart}/>
            </Link>
            <Link to="/dashboard" className="user-icon">
            <FontAwesomeIcon icon={faUser} />
            </Link>
            
            </>
          )}
          {!isLoggedIn && <Link to="/login">Login</Link>}
          {!isLoggedIn && <Link to="/signup">Signup</Link>}
          {isLoggedIn && <a href="" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt}/>
            </a>}
        </span>
      </ul>
    </nav>
    </>
  );
}
