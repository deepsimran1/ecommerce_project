import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Modal, Button } from "react-bootstrap";
import AdminNav from "./AdminNav";
import AdminSidebar from "./AdminSidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faEye } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [productCount, setProductCount] = useState(0); 

  useEffect(() => {
    axios
      .get("http://localhost:4000/users/getProductsToAdmin")
      .then((response) => {
        setProducts(response.data.products);
        setProductCount(response.data.productCount);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleDeleteProduct = (productId) => {
    const token = localStorage.getItem("token");
    axios
      .delete(`http://localhost:4000/users/deleteProduct/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        console.log("Product deleted successfully");
        window.location.reload();
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== productId)
        );
      })
      .catch((error) => console.error("Error deleting product:", error));
  };

  const renderSizes = (sizes) => {
    const availableSizes = Object.keys(sizes).filter((size) => sizes[size]);
    return availableSizes.join(", ");
  };

  return (
    <>
      <div className="bg-light">
        <AdminNav />
        <div className="contain row container-fluid">
          <AdminSidebar />
          <div className="card main bg-white con rounded shadow p-4 mb-5 pb-5">
            <h2>Product List{"   "}
              <span>({productCount})</span>
            </h2>
            <Table hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Size</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={product.id}>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        src={`http://localhost:4000/${product?.image}`}
                        className="small-img"
                      />
                    </td>
                    <td>{product.name}</td>
                    <td>${product.price}</td>
                    <td>{renderSizes(product.sizes)}</td>
                    <td>
                      <button
                        className="btn btn-success ms-2 mt-2"
                        onClick={() => handleViewDetails(product)}
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button className="btn btn-primary ms-2 mt-2 edit">
                        <Link to={`/admin/editProduct/${product._id}`}>
                          <FontAwesomeIcon icon={faEdit} />
                        </Link>
                      </button>
                      <button
                        className="btn btn-danger ms-2 mt-2"
                        onClick={() => handleDeleteProduct(product._id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <Modal show={showModal} onHide={handleCloseModal}>
              <Modal.Header closeButton>
                <Modal.Title>Product Details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {selectedProduct && (
                  <div className="d-flex">
                    <div className="modal-img h-100">
                      <img
                        src={`http://localhost:4000/${selectedProduct?.image}`}
                        className="img-fluid lg-small-img"
                      />
                    </div>
                    <div className="modal-details">
                      <p>Name: {selectedProduct.name}</p>
                      <p>Price: ${selectedProduct.price}</p>
                      <p>Description: {selectedProduct.description}</p>
                    </div>
                  </div>
                )}
              </Modal.Body>

              <Modal.Footer>
                <Button variant="secondary" className="change-color">
                  <Link to={`/admin/editProduct/${selectedProduct?._id}`}>
                    Edit
                  </Link>
                </Button>
                <Button variant="secondary" onClick={handleCloseModal}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminProducts;
