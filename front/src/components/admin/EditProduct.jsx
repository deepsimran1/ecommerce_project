import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';  // Import useParams
import AdminNav from './AdminNav';
import AdminSidebar from './AdminSidebar';


const EditProduct = () => {
    const {productId} = useParams();
 const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: 0,
    image:'',
    sizes: {
      xs: false,
      small: false,
      medium: false,
      large: false,
      xl: false,
      xll: false,
    },
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`http://localhost:4000/users/getProductById/${productId}`,{
      headers:{
        Authorization:`Bearer ${token}`,
      }
    })
      .then(response => setProduct(response.data))
      .catch(error => console.error('Error fetching product details:', error));
  }, [productId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct(prevProduct => ({ ...prevProduct, [name]: value }));
  };

  const handleSizeChange = (size) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      sizes: {
        ...prevProduct.sizes,
        [size]: !prevProduct.sizes[size],
      },
    }));
  };
  const handleSave = () => {
    const token = localStorage.getItem('token');
    axios.put(`http://localhost:4000/users/updateProduct/${productId}`, product,{
      headers:{
        Authorization:`Bearer ${token}`,
        'Content-Type':'multipart/form-data'
      }
    })
      .then(() => {
        console.log('Product updated successfully');
        navigate('/admin/products');
      })
      .catch(error => console.error('Error updating product:', error));
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProduct((prevProduct) => ({ ...prevProduct, image: file }));
    }
  };
  

  return (
    <>
    <div className='bg-light'>
        <AdminNav/>
        <div className='contain row container-fluid'>
            <AdminSidebar/>
            <div className="card main col-9 bg-white con rounded shadow p-4 mb-5 pb-5">
            <h2>Edit Product</h2>
      <form>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={product.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            value={product.description}
            onChange={handleInputChange}
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">Price</label>
          <input
            type="number"
            className="form-control"
            id="price"
            name="price"
            value={product.price}
            onChange={handleInputChange}
          />
        </div>
        
        {product.image && (
          <div className="mb-3">
            <label className="form-label d-block">Current Image:</label>
            <img src={`http://localhost:4000/${product.image}`} alt="Product" className="img-fluid mb-2 small-img" />
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="image" className="form-label">Update Image</label>
          <input
            type="file"
            className="form-control"
            id="image"
            name="image"
            onChange={handleImageChange}
          />
        </div>

        <div className="mb-3">
                <label className="form-label">Sizes</label>
                <div>
                  {Object.keys(product.sizes).map((size) => (
                    <div key={size} className="form-check form-check-inline">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={size}
                        checked={product.sizes[size]}
                        onChange={() => handleSizeChange(size)}
                      />
                      <label className="form-check-label" htmlFor={size}>{size.toUpperCase()}</label>
                    </div>
                  ))}
                </div>
              </div>


        <button type="button" className="btn btn-primary" onClick={handleSave}>
          Save
        </button>
        <button type="button" className="btn btn-secondary change-color ms-2">
          <Link to={'/admin/products'}>
            Cancel
          </Link>
        </button>
      </form>
            </div>
        </div>
    </div>
    
    </>
  );
};

export default EditProduct;
