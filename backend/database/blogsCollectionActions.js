import Blog from "./schemas/blogs_schema.js";
import logger from "../utils/logger.js";
import IDManager from "../utils/idGen.js";

class BlogsCollection {
  static async create(props) {
    try {
      const newBlog = new Blog({
        id: IDManager.genUniqueID(12),
        title: props.title,
        author: props.author || "Anonymous",
        postedAt: Date.now(),
        lastModified: 0,
        content: props.content,
        upVotes: 0,
        downVotes: 0,
        visible: true,
        views: 0,
      });

      await newBlog.save();
      return newBlog;
    } catch (err) {
      logger.error("Error creating blog:", err);
      return false;
    }
  }

  static async find(id, publicOnly = false) {
    try {
      let blog = await Blog.findOne({ id });
      
      if (publicOnly && blog.visible) return blog;
      else if (!publicOnly) return blog;

      return false;
    } catch (err) {
      logger.error("Error finding blog:", err);
      return false;
    }
  }

  static async findMultiple(from, to, publicOnly = false) {
    try {
      let allBlogs = await Blog.find({});
      if (!allBlogs) return false;

      if (publicOnly) allBlogs = allBlogs.filter(v => v.visible);

      allBlogs = allBlogs.slice(from, to);

      return allBlogs;
    } catch (err) {
      logger.error("Error finding multiple blogs: " + err);
      return false;
    }
  }

  static async update(id, props) {
    try {
      const foundBlog = await this.find(id);
      if (!foundBlog) return false;

      foundBlog.title = props.title;
      foundBlog.author = props.author;
      foundBlog.content = props.content;

      await foundBlog.save();
      return foundBlog;
    } catch (err) {
      logger.error(err);
      return false;
    }
  }

  static async delete(id) {
    try {
      const deleteBlog = await Blog.deleteOne({ id });
      if (deleteBlog.deletedCount == 0) return false;
      return true;
    } catch (err) {
      logger.error("Error deleting blog:" + err);
      return null;
    }
  }

  static async changeBlogVisibility(id, visible) {
    try {
      const blogToUpdate = await Blog.findOne({ id });
      if (!blogToUpdate) return false;

      blogToUpdate.visible = visible;
      await blogToUpdate.save();
      return true;
    } catch (err) {
      logger.error("Error modifying blog visibility: " + err);
      return null;
    }
  }
}

export default BlogsCollection;