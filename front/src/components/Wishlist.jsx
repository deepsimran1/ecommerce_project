import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState({ products: [] });
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [sizeNotSelected, setSizeNotSelected] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:4000/users/getWishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setWishlist(response.data?.data))
      .catch((error) =>
        console.error("Error fetching wishlist products:", error)
      );
  }, []);

  const updateLocalWishlist = (updatedWishlist) => {
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:4000/users/deleteFromWishlist/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        const updatedWishlist = await axios.get(
          "http://localhost:4000/users/getWishlist",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setWishlist(updatedWishlist.data?.data);
        updateLocalWishlist(updatedWishlist.data?.data);
        console.log("Product removed from wishlist");
      } else {
        alert("Error removing product");
      }
    } catch (error) {
      console.log("Error removing product", error);
    }
  };

  const handleMoveToCart = async (product) => {
    setSelectedProduct(product);
    setShowModal(true);

    try {
      const productId = product.productId;
      const response = await axios.get(
        `http://localhost:4000/users/getProductById/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const productData = response.data;
      if (productData) {
        setSelectedProduct({
          ...product,
          ...productData,
          sizes: productData.sizes,
        });
      }

      setShowModal(true);
    } catch (error) {
      console.error("Error fetching product details.", error);
    }
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setShowModal(false);
    setSizeNotSelected(false);
    setSelectedSize("");
  };

  const handleBackdropClick = () => {
    closeModal();
  };

  const handleAddToCart = async () => {
    try {
      if (!selectedSize) {
        setSizeNotSelected(true);
        return;
      }
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:4000/users/addToCart`,
        {
          productId: selectedProduct.productId,
          quantity: 1,
          size: selectedSize,
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        console.log("Product added to cart successfully");
        handleDeleteProduct(selectedProduct.productId);
        alert("product added to cart 😀")
        closeModal();
        navigate("/cart");
      } else {
        alert("Error adding product to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h4 className="mb-4">My Wishlist</h4>
      <div className="row d-flex justify-content-center align-items-center">
        {wishlist &&
          wishlist.products &&
          wishlist.products.map((item) => (
            <div
              className="col-lg-3 mb-3 col-md-4 col-sm-6 mb-4 col-10 "
              key={item.productId}
            >
              <div className="card h-100 card-rad">
                <div className="position-relative">
                  <div className="img-box-w">
                    <img
                      src={`http://localhost:4000/${item?.image}`}
                      className="card-img-top"
                      alt={item?.name}
                    />
                  </div>
                  <div className="icon-del btn">
                    <FontAwesomeIcon
                      icon={faTimes}
                      className="delete-icon"
                      onClick={() => handleDeleteProduct(item.productId)}
                    />
                  </div>
                </div>
                <div className="card-body text-center">
                  <h6 className="card-title mb-0">{item.name}</h6>
                  <p className="card-text">${item.price}</p>
                  <div className="card-footer text-center m-0 p-0 row">
                    <button
                      className="btn m-1 m-0 fs-6"
                      onClick={() => handleMoveToCart(item)}
                    >
                      Move to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
      {showModal && selectedProduct && (
        <>
          <div
            className="modal-backdrop show"
            onClick={handleBackdropClick}
          ></div>
          <div
            // onRequestClose={closeModal}
            // contentLabel="Product Details Modal"
            className={"myModal modal"}
            tabIndex="-1"
            role="dialog"
            style={{ display: "block" }}
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <div className="modal-img ma-div">
                    <img src={`http://localhost:4000/${selectedProduct?.image}`}
                    className="card-img-top"
                    alt={selectedProduct?.name}/>
                  </div>
                  <div className="modal-details">
                  <h2>{selectedProduct?.name}</h2>
              <p>{selectedProduct?.description}</p>
              <p>${selectedProduct?.price}</p>
              <select
                className="form-select"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                <option value="" className="text-muted">
                  Size
                </option>
                {selectedProduct?.sizes &&
                  Object.keys(selectedProduct.sizes).map(
                    (size) =>
                      selectedProduct.sizes[size] && (
                        <option key={size} value={size} className="text-dark">
                          {size}
                        </option>
                      )
                  )}
              </select>
              <>
                {sizeNotSelected && (
                  <p style={{ color: "red" }}>
                    Please select a size before adding to cart.
                  </p>
                )}
              </>
                  </div>
                </div>
                <div className="modal-footer">
                <button onClick={closeModal} className="btn btn-secondary">Close</button>
                <button onClick={handleAddToCart} className="btn btn-success">Add to Cart</button>
              
                </div>
              </div> 
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Wishlist;
