import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch products from the backend
    axios.get('http://localhost:4000/users/product')
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:4000/users/addToCart`, {
        productId,
        quantity: 1,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 201) {
        console.log("Product added to cart successfully");
        navigate('/cart');
      } else {
        alert("Error adding product to cart");
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleCardClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setShowModal(false);
  };

  const handleBackdropClick = () => {
    closeModal();
  };


  return (
    <div className="container-fluid mt-5">
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {products.map(product => (
          <div key={product?._id} className="col" onClick={() => handleCardClick(product)}>
            <div className="card ds h-100">
              <div className='product'>
                <img src={`http://localhost:4000/${product?.image}`} className="card-img-top view-img" alt={product?.name} />
              </div>
              <div className="card-body">
                <p className="card-title">{product?.name}</p>
                <p className="card-text">Price: ${product?.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && selectedProduct && (
        <div>
          <div className="modal-backdrop show" onClick={handleBackdropClick}></div>
          <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                <img src={`http://localhost:4000/${selectedProduct?.image}`} className="card-img-top modal-img" alt={selectedProduct?.name} />
                </div>
                <div className="modal-body">
                <p>{selectedProduct.name}</p>
                <p>{selectedProduct.description}</p>
                  <p>${selectedProduct.price}</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    Close
                  </button>
                  <button type="button" className="btn btn-primary" onClick={() => handleAddToCart(selectedProduct._id)}>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;


