const Comment = require('./../models/comment')
const Blog = require('./../models/blog')
const User = require('./../user/models/userModel');
const commentController={
    addComment: async (req, res) => {
        try {
          const { blogId, content } = req.body;
            const userId = req.decoded._id;

          const blog = await Blog.findById(blogId);
          if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
          }
          const user = await User.findById(userId);
          if(!user){
            return res.status(404).json({error:"User not found"});
          }

    
          const newComment = new Comment({
            blogId,
            userId,
            content,
            userName:user.name,
          });
    
          
          await newComment.save();
    
          res.status(201).json({ message: 'Comment added successfully' });
        } catch (error) {
          console.error('Error adding comment', error);
          res.status(500).json({ error: 'Internal server error' });
        }
      },
      getComments: async (req, res) => {
        try {
          const { blogId } = req.params;
    
          const comments = await Comment.find({ blogId }).populate('userId','name');
    
          res.status(200).json(comments);
        } catch (error) {
          console.error('Error getting comments', error);
          res.status(500).json({ error: 'Internal server error' });
        }
      },
      editComment:async(req,res)=>{
        try{
          const {commentId } = req.params;
          const userId = req.decoded?._id;
          const {content} = req.body;
          const comment = await Comment.findOne({_id:commentId, userId});
          if(!comment){
            return res.status(404).json({message:"comment not found"});
          }
          comment.content= content;
          await comment.save();
          res.status(200).json({message:"comment edited successfully"});
        }catch(error){
          console.error("Error editing comment",error);
          res.status(500).json({message:"Error editing commnet"});
        }
      },
      deleteComment: async(req, res) => {
        try {
          const { commentId } = req.params;
          const userId = req.decoded?._id;
      
          const comment = await Comment.findOne({ _id: commentId, userId });
      
          if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
          }
      
          await Comment.deleteOne({ _id: commentId, userId });
          res.status(200).json({ message: "Comment deleted successfully" });
        } catch (error) {
          console.error("Error deleting comment", error);
          res.status(500).json({ message: "Error deleting comment" });
        }
      }
      
      
    
}
module.exports = commentController;