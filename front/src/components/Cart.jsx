import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Cart = () => {
  const [cart, setCart] = useState({ products: [] });
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:4000/users/getCart', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => setCart(response.data?.data))
      .catch(error => console.error('Error fetching cart products:', error));
  }, []);

  const removePreviousSizeFromLocalStorage = (productId) => {
    localStorage.removeItem(`previousSelectedSize_${productId}`);
  };


  const handleDeleteProduct = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:4000/users/deleteFromCart/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 201) {
        const updatedCart = await axios.get('http://localhost:4000/users/getCart', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        removePreviousSizeFromLocalStorage(productId);
        localStorage.setItem("cart", JSON.stringify(updatedCart.data?.data));
        setCart(updatedCart.data?.data);
        console.log("Product removed from cart");
        calculateTotalPrice(updatedCart.data?.data.products, selectedProducts);
      } else {
        alert("Error removing product");
      }
    } catch (error) {
      console.log('Error removing product', error);
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:4000/users/updateCartItem/${productId}`, {
        quantity: newQuantity,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setCart(response.data);
        console.log('Quantity updated successfully');
        calculateTotalPrice(response.data.products, selectedProducts);
      } else {
        alert("Error updating quantity");
      }
    } catch (error) {
      console.log('Error updating quantity', error);
    }
  };

  const handleCheckboxChange = (productId) => {
    const updatedSelectedProducts = selectedProducts.includes(productId)
      ? selectedProducts.filter((id) => id !== productId)
      : [...selectedProducts, productId];
    setSelectedProducts(updatedSelectedProducts);
    calculateTotalPrice(cart.products, updatedSelectedProducts);
  };

  const calculateTotalPrice = (products, selectedProducts) => {
    const selectedProductsList = selectedProducts || selectedProducts;
    const total = products.reduce((sum, product) => {
      if (selectedProductsList.includes(product.productId)) {
        return sum + product.price * product.quantity;
      }
      return sum;
    }, 0);
    setTotalPrice(total);

    const calculatedDiscount = total * 0.3;
    setDiscount(calculatedDiscount);

    const calculatedFinalPrice = total - calculatedDiscount;
    setFinalPrice(calculatedFinalPrice);
  };
  

  const handleReadMoreClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
   <div className='container'>
     <div className="mt-5  row">
      <h5 className='text-color'>My Cart</h5>
      <div className='col-lg-8'>
        {cart && cart.products && cart.products.map(item => (
          <div className="col-md-10 col-lg-12 cart-card" key={item.productId}>
            <div className="card border-card h-100 d-flex justify-content-center ">
              <div className="col-row row g-0">
                <div className="col-md-1 checkboxs">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(item.productId)}
                    onChange={() => handleCheckboxChange(item.productId)}
                  />
                </div>

                <div className=" col-img col-md-6 col-sm-6 d-flex justify-content-center align-items-center">
                  <div className='img-box cart-img '>
                    <img src={`http://localhost:4000/${item?.image}`} className="card-img view-img h-100" alt={item?.name} />
                  </div>
                </div>
                <div className=" col-txt col-md-6 cd-by col-sm-6">
                  <div className="card-body">
                    <h5 className="card-title">{item.name}</h5>
                    <p className="card-text">${item.price}</p>
                    <p className="card-text">Size: {item.size}</p>
                    <div className="d-flex quantity-btn">
                    <button className="btn  ms-2" onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        disabled={item.quantity === 1}
                      >-</button>
                     <span>&nbsp;&nbsp;{item.quantity}&nbsp;&nbsp;</span>
                      <button className="btn  me-2 " onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}>+</button>
                      
                    </div>
                    <div className='remove-btn'>
                    <button className="btn  mt-2 ms-3 " onClick={() => handleDeleteProduct(item.productId)}>Remove</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className=" col-lg-4 p-2">

      <div className='card border-card price-list p-3'>
       <div className='row'>
       <p className='price-title'>Price Details</p>
      <div className='row prow'>
      <div className='col-6'><span>Total Price:</span></div>
       <div className='col-6 text-end'><span>${totalPrice}</span></div>
      </div>
      <div className='row prow'>
      <div className='col-6'><span>Discount:</span><span className='readm' onClick={handleReadMoreClick}>&nbsp;Know More</span></div>
       <div className='col-6 text-end text-success'><span>- ${discount}</span></div>
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Additional Discount</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You've earned an additional 30% discount!</p>
          {/* Add any additional information or styling here */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <div className='row prow'>
      <div className='col-6'><span>Final Price:</span></div>
       <div className='col-6 text-end'><span>${finalPrice}</span></div>
      </div>
      <div className='row btn-color'>
        <button className='btn m-2 mt-3'> Place Order</button>
         </div>
       </div>

      </div>
      </div>
    </div>
   </div>
  );
};

export default Cart;
