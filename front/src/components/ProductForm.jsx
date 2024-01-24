import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNav from "./admin/AdminNav";
import AdminSidebar from "./admin/AdminSidebar";


export default function ProductForm() {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [productDescription, setProductDescription] = useState("");
  const [productSizes, setProductSizes] = useState([]);
  const navigate = useNavigate();

  useEffect(()=>{
    function setPageTitle(pageName){
      document.title= `${pageName}`;
    }
    setPageTitle('Add Product');
  })

  const handleAddProduct = async (e) => {

    

    try {
      e.preventDefault();
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", productName);
      formData.append("price", parseFloat(productPrice));
      formData.append("description", productDescription);
      formData.append("image", productImage);
      formData.append("sizes", productSizes);

      const response = await axios.post(
        "http://localhost:4000/users/addProduct",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("product added", response.data);
      navigate("/admin/products");

      if (response.data.success) {
        alert("Added Product");
        navigate("/admin/products");
      } else {
        console.log("Signup failed. Please check your information.");
      }
    } catch (error) {
      console.error("Error adding product:", error.message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProductImage(file);
  };

  const handleSizeChange = (size) => {
    setProductSizes((prevSizes) =>
      prevSizes.includes(size)
        ? prevSizes.filter((s) => s !== size)
        : [...prevSizes, size]
    );
  };
  return (
    <>
      <div className="bg-light">
        <AdminNav />
        <div className="contain row container-fluid">
          <AdminSidebar />
          <div className="card main col-9 bg-white con rounded shadow p-4 mb-5 pb-5">
            <div className="d-flex flex-column justify-content-center align-items-center">
              <h2 className="text-bold font-monospace text-center m-3">
                Add Product
              </h2>
              <div className="cardA rounded p-4 mb-5 pb-5">
                <form className="row g-3">
                  <div className="col-12">
                    <label className="form-label">Name </label>
                    <input
                      className="form-control"
                      type="text"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Price </label>
                    <input
                      className="form-control"
                      type="text"
                      value={productPrice}
                      onChange={(e) => setProductPrice(e.target.value)}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Description </label>
                    <input
                      className="form-control"
                      type="text"
                      value={productDescription}
                      onChange={(e) => setProductDescription(e.target.value)}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Image </label>
                    <input
                      className="form-control"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Sizes</label>
                    <div>
                      <label className="form-check-label">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          value="chota"
                          checked={productSizes.includes("chota")}
                          onChange={() => handleSizeChange("chota")}
                        />
                        Extra Small
                      </label>
                    </div>
                    <div>
                      <label className="form-check-label">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          value="small"
                          checked={productSizes.includes("small")}
                          onChange={() => handleSizeChange("small")}
                        />
                        Small
                      </label>
                    </div>
                    <div>
                      <label className="form-check-label">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          value="medium"
                          checked={productSizes.includes("medium")}
                          onChange={() => handleSizeChange("medium")}
                        />
                        Medium
                      </label>
                    </div>
                    <div>
                      <label className="form-check-label">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          value="large"
                          checked={productSizes.includes("large")}
                          onChange={() => handleSizeChange("large")}
                        />
                        Large
                      </label>
                    </div>
                    <div>
                      <label className="form-check-label">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          value="vada"
                          checked={productSizes.includes("vada")}
                          onChange={() => handleSizeChange("vada")}
                        />
                        Extra Large
                      </label>
                    </div>
                  </div>

                  <div className="col-12">
                    <button
                      className="btn btn-primary w-100"
                      type="button"
                      onClick={handleAddProduct}
                    >
                      Add Product
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
