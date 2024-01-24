import React, { useEffect } from "react";
import Slider from "react-slick";
import "./login.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Img1 from "./sliderImages/img1.jpg";
import Img2 from "./sliderImages/img2.jpg";
import Img3 from "./sliderImages/img3.jpg";
import Img4 from "./sliderImages/img4.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSearch } from "./SearchContext";
export default function Home() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [wishlist, setWishlist] = useState({ products: [] });
  const [cart, setCart] = useState({ products: [] });
  const [selectedSize, setSelectedSize] = useState();
  const [sizeNotSelected, setSizeNotSelected] = useState(false);
  const [previousSelectedSize, setPreviousSelectedSize] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totoalpage, setTotoalpage] = useState("");
  const navigate = useNavigate();

  const { searchTerm } = useSearch();

  useEffect(() => {
  

    const token = localStorage.getItem("token");
    if (token) {
      // User is logged in, fetch wishlist from the database
      axios
        .get("http://localhost:4000/users/getWishlist", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setWishlist(response.data?.data || { products: [] });
        })
        .catch((error) => {
          console.error("Error fetching wishlist:", error);
        });
    }
  }, []);

  useEffect(() => {
    

    axios
      .get(
        `http://localhost:4000/users/product?search=${searchTerm}&page=${currentPage}&limit=12`
      )
      .then((response) => {
        setTotoalpage(response.data.count);
        setProducts(response.data.products);
      })
      .catch((error) => console.error("Error fetching products:", error));

    const storedWishlist = localStorage.getItem("wishlist");
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }

    if (showModal && selectedProduct) {
      const storedPreviousSize = localStorage.getItem(
        `previousSelectedSize_${selectedProduct._id}`
      );
      if (storedPreviousSize) {
        setPreviousSelectedSize(storedPreviousSize);
      }
    }

    
    if (showModal && selectedProduct) {
      document.title = `Belle Chic - ${selectedProduct?.name}`;
    } else {
      document.title = 'Belle Chic - Online Shopping for Women';
    }
    

  }, [searchTerm, showModal, selectedProduct, currentPage]);

  const handleAddToCart = async (productId, selectedSize) => {
    try {
      if (!selectedSize) {
        // Size not selected, display a modal
        setSizeNotSelected(true);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login first..🙂");
        navigate("/login");
      }
      const response = await axios.post(
        `http://localhost:4000/users/addToCart`,
        {
          productId,
          quantity: 1,
          size: selectedSize,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (
        response.status === 201 ||
        response.status === 204 ||
        response.status === 400
      ) {
        const updatedCart = await axios.get(
          "http://localhost:4000/users/getCart",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        localStorage.setItem("cart", JSON.stringify(updatedCart.data?.data));
        setCart(updatedCart.data?.data);
        localStorage.setItem(`previousSelectedSize_${productId}`, selectedSize);
        console.log("Product added to cart successfully");
        navigate("/cart");
      } else {
        alert("Error adding product to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleCardClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
    document.title = `${product?.name} - Belle Chic`;
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setShowModal(false);
    setSizeNotSelected(false);
    setPreviousSelectedSize(null);
  };

  const handleBackdropClick = () => {
    closeModal();
  };

 

  const handleAddToWishlist = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login first..🙂");
        navigate("/login");
      }
      const response = await axios.post(
        `http://localhost:4000/users/addToWishlist`,
        { productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (
        response.status === 201 ||
        response.status === 204 ||
        response.status === 400
      ) {
        // Update the local storage
        const updatedWishlist = await axios.get(
          "http://localhost:4000/users/getWishlist",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        localStorage.setItem(
          "wishlist",
          JSON.stringify(updatedWishlist.data?.data)
        );
        // Update the state
        setWishlist(updatedWishlist.data?.data);
      } else {
        console.log("Error updating wishlist");
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  const isProductInWishlist = (productId) => {
    return wishlist.products.some((item) => item.productId === productId);
  };

  const isProductInCart = (productId) => {
    return cart.products.some((item) => item.productId === productId);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <>
      <div>
        <div style={{ position: "relative" }}>
          <Slider {...settings}>
            <div>
              <img src={Img1} alt="Img1" />
            </div>
            <div>
              <img src={Img2} alt="Img2" />
            </div>
            <div>
              <img src={Img3} alt="Img3" />
            </div>
            <div>
              <img src={Img4} alt="Img4" />
            </div>
          </Slider>
        </div>
      </div>

      <div className="container-fluid mt-5">
        <div className="row">
          {products.map((product) => (
            <div
              key={product?._id}
              className="col-lg-3 col-md-4  col-sm-6 col-cls"
              onClick={() => handleCardClick(product)}
            >
              <div className="card ds h-100">
                <div className="product  ma-div">
                  <img
                    src={`http://localhost:4000/${product?.image}`}
                    className="card-img-top view-img"
                    alt={product?.name}
                  />
                  <div class="icon ">
                    <div class="icon-cls">
                      <button
                        className="btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToWishlist(product._id);
                        }}
                      >
                        <FontAwesomeIcon
                          icon={
                            isProductInWishlist(product._id)
                              ? solidHeart
                              : faHeart
                          }
                          style={{
                            color: isProductInWishlist(product._id)
                              ? "red"
                              : "black",
                          }}
                        />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="detail">
                  <p>{product?.name}</p>
                  <p>${product?.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {showModal && selectedProduct && (
          <div>
            <div
              className="modal-backdrop show"
              onClick={handleBackdropClick}
            ></div>
            <div
              className="modal"
              tabIndex="-1"
              role="dialog"
              style={{ display: "block" }}
            >
              <div className="modal-dialog " role="document">
                <div className="modal-content design">
                  <div className="design-2 shadow">
                  <div className="modal-header">
                    <div className="modal-img ma-div">
                      <img
                        src={`http://localhost:4000/${selectedProduct?.image}`}
                        className="img-fluid"
                        alt={selectedProduct?.name}
                      />
                      <div class="icon ">
                        <div class="icon-cls">
                          <button
                            className="btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToWishlist(selectedProduct._id);
                            }}
                          >
                            <FontAwesomeIcon
                              icon={
                                isProductInWishlist(selectedProduct._id)
                                  ? solidHeart
                                  : faHeart
                              }
                              style={{
                                color: isProductInWishlist(selectedProduct._id)
                                  ? "red"
                                  : "black",
                              }}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="modal-details">
                      <p className="name">{selectedProduct.name}</p>
                      {selectedProduct.description
                        .split(",")
                        .map((part, index) => (
                          <p key={index} style={{ margin: "0px" }}>
                            {part}
                          </p>
                        ))}

                      <p className="name mt-1">${selectedProduct.price}</p>
                      <select
                        className="form-select"
                        value={selectedSize || previousSelectedSize}
                        onChange={(e) => setSelectedSize(e.target.value)}
                      >
                        <option value="" className="text-muted">
                          Size
                        </option>
                        {Object.keys(selectedProduct.sizes).map(
                          (size) =>
                            selectedProduct.sizes[size] && (
                              <option
                                key={size}
                                value={size}
                                className="text-dark"
                              >
                                {size}
                              </option>
                            )
                        )}
                      </select>

                      {sizeNotSelected && (
                        <p style={{ color: "red" }}>
                          Please select a size before adding to cart.
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="modal-footer">
                    {isProductInCart(selectedProduct._id) ? (
                      <>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={closeModal}
                        >
                          Close
                        </button>
                        <button
                          type="button"
                          className="btn btn-success"
                          onClick={() => navigate("/cart")}
                        >
                          Go to Cart
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={closeModal}
                        >
                          Close
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() =>
                            handleAddToCart(selectedProduct._id, selectedSize)
                          }
                        >
                          Add to Cart
                        </button>
                      </>
                    )}
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className=" d-flex justify-content-center align-items-center">
          <button
            className="btn btn-primary p-1 m-1"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <button
            disabled={totoalpage === currentPage}
            className="btn btn-primary p-1 m-1"
            onClick={handleNextPage}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
