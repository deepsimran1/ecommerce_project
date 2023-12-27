const Blog = require("../models/blog");
const Like = require('../models/like');
const blogController = {
    
    createBlog: async (req, res) => {
        try {
          const { title,content} = req.body;
          let adminId = req.decoded?._id;
          console.log("adminId", adminId);
          const image = req.file; 
            const newBlog = new Blog({ title, contentText: content,image:image.path,editor:adminId });
            await newBlog.save();
            res.status(201).json({ message: "Blog Created" });
          } catch (error) {
          console.error('Error saving blog', error);
          res.status(500).json({ message: 'Error saving blog' });
        }
      },
      
  getAdminBlogs: async (req, res) => {
    try {
      let adminId = req.decoded?._id;
      const adminBlogs = await Blog.find({ editor: adminId });

      res.status(200).json(adminBlogs);
    } catch (error) {
      console.error('Error fetching admin blogs', error);
      res.status(500).json({ message: 'Error fetching admin blogs' });
    }
  },
deleteBlog: async (req, res) => {
    try {
      const blogId = req.params.blogId;
      const adminId = req.decoded?._id;
  
      const blog = await Blog.findOne({ _id: blogId, editor: adminId });
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }
  
      await Blog.findByIdAndDelete(blogId);
  
      res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (error) {
      console.error('Error deleting blog', error);
      res.status(500).json({ message: 'Error deleting blog' });
    }
  },
  getBlog: async (req, res) => {
    try {
      const blogId = req.params.blogId;
      const adminId = req.decoded?._id;
  
      const blog = await Blog.findOne({ _id: blogId, editor: adminId });
  
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }
  
      res.status(200).json(blog);
    } catch (error) {
      console.error('Error fetching blog', error);
      res.status(500).json({ message: 'Error fetching blog' });
    }
  },
  
  updateBlog: async (req, res) => {
    try {
      const blogId = req.params.blogId;
      const adminId = req.decoded?._id;
  
      const blog = await Blog.findOne({ _id: blogId, editor: adminId });
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }
  
      const { title, content } = req.body;
      blog.title = title;
      blog.contentText = content;
  
      await blog.save();
  
      res.status(200).json({ message: 'Blog updated successfully' });
    } catch (error) {
      console.error('Error updating blog', error);
      res.status(500).json({ message: 'Error updating blog' });
    }
},

getAllBlogs : async (req, res) => {
    try {
      const allBlogs = await Blog.find(); // Fetch all blogs without using adminId
      res.status(200).json(allBlogs);
    } catch (error) {
      console.error('Error fetching all blogs', error);
      res.status(500).json({ message: 'Error fetching all blogs' });
    }
  },
  deleteBlogWithoutAdminId :async (req, res) => {
    try {
      const blogId = req.params.blogId;
      
      // Ensure a valid token is present before allowing deletion
      if (!req.decoded) {
        return res.status(401).json({ message: 'Unauthorized: Token not present' });
      }
  
      // Delete the blog without checking adminId
      await Blog.findByIdAndDelete(blogId);
  
      res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (error) {
      console.error('Error deleting blog', error);
      res.status(500).json({ message: 'Error deleting blog' });
    }
  },
  

  getBlogDetails: async (req, res) => {
    try {
      const blogId = req.params.blogId;
      const blog = await Blog.findById(blogId);
  
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }
  
      res.status(200).json(blog);
    } catch (error) {
      console.error('Error fetching blog details', error);
      res.status(500).json({ message: 'Error fetching blog details' });
    }
  }, 
  likeBlog: async (req, res) => {
    try {
      const { blogId } = req.params;
      const userId = req.decoded?._id;

      const like = await Like.findOne({ blog: blogId, user: userId });
      if (like) {
        return res.status(400).json({ message: 'Blog already liked by the user' });
      }

      const newLike = new Like({ blog: blogId, user: userId });
      await newLike.save();

      const blog = await Blog.findByIdAndUpdate(
        blogId,
        { $push: { likes: userId }, $inc: { likeCount: 1 } },
        { new: true }
      );

      res.status(200).json({ message: 'Blog liked successfully', likes: blog.likeCount});
    } catch (error) {
      console.error('Error liking blog', error);
      res.status(500).json({ message: 'Error liking blog' });
    }
  },  

 
    
  
};

module.exports = blogController;




