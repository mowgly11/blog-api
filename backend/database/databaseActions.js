import Blog from "./schema.js";
import logger from "../index.js";

class DataBase {
  async create(props) {
    try {
      const newBlog = new Blog({
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

  async find(query) {
    try {
      return (await Blog.findOne(query)) || false;
    } catch (err) {
      logger.error("Error finding blog:", err);
      return false;
    }
  }

  async findMultiple(from, to) {
    try {
      let allBlogs = await Blog.find({});
      if (!allBlogs) return false;

      allBlogs = allBlogs.slice(from, to);

      return allBlogs;
    } catch (err) {
      logger.error("Error finding multiple blogs: " + err);
      return false;
    }
  }

  async update(id, props) {
    try {
      const foundBlog = await Blog.findById(id);
      if (!foundBlog) return false;

      let beforeModifictions = JSON.parse(JSON.stringify(foundBlog));

      for (const key in props) {
        if (props.hasOwnProperty(key)) {
          foundBlog[key] = props[key];
        }
      }

      await foundBlog.save();
      return { foundBlog, beforeModifictions };
    } catch (err) {
      logger.error(err);
      return false;
    }
  }

  async delete(query) {
    try {
      await Blog.deleteOne(query);
      return true;
    } catch (err) {
      logger.error("Error deleting blog:", err);
      return false;
    }
  }

  async upVote(id) {
    const blogToUpdate = await Blog.findById(id);
    if(!blogToUpdate) return false;

    const upvoteAdded = await this.update(id, { upVotes: blogToUpdate.upVotes+=1 });

    return upvoteAdded;
  }
  
  async downVote(id) {
    const blogToUpdate = await Blog.findById(id);
    if(!blogToUpdate) return false;

    const upvoteAdded = await this.update(id, { downVotes: blogToUpdate.downVotes+=1 });

    return upvoteAdded;
  }
}

export default new DataBase();