import React from 'react';

const BlogModal = ({ blog, handleCloseModal }) => {
  return (
    <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{blog.title}</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={handleCloseModal}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
          <p dangerouslySetInnerHTML={{__html:blog.contentText}}/>
            {blog.image && <img src={blog.image} alt="Blog" className="img-fluid" />}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogModal;
