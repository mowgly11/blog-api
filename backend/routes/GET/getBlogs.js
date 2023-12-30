import database from "../../database/databaseActions.js";

export default {
  methods: ["get"],
  endpoint: "/get_blogs",
  Get: async function (req, res, next) {
    const allBlogs = await database.findMultiple(0);
    res.json({
      status: 200,
      error: null,
      data: { blogs: allBlogs, length: allBlogs.length },
    });
  },
};
