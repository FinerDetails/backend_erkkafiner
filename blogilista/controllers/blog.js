const blogsRouter = require("express").Router()
const Blog = require("../models/blog")
const middleware = require("../utils/middleware")
const tokenExtractor = middleware.tokenExtractor
const userExtractor = middleware.userExtractor


blogsRouter.get("/", async (req, res) => {
	const blogs = await Blog.find({})
		.populate("user", { username: 1, name: 1 })
	res.json(blogs)
})


blogsRouter.post("/", tokenExtractor, userExtractor, async (req, res) => {
	const user = req.user
	const blog = new Blog({
		title: req.body.title,
		author: req.body.author,
		url: req.body.url,
		likes: req.body.likes,
		user: user._id
	})
	console.log(blog)
	const savedBlog = await blog.save()
	user.blogs = user.blogs.concat(savedBlog._id)
	await user.save()
	res.status(201).json(savedBlog)
})
blogsRouter.put("/:id", async (req, res) => {
	const blog = {
		title: req.body.title,
		author: req.body.author,
		url: req.body.url,
		likes: req.body.likes
	}

	const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true })
	res.status(201).json(updatedBlog)
})
blogsRouter.delete("/:id", tokenExtractor, userExtractor, async(req, res) => {
	const user = req.user
	const blog = await Blog.findById(req.params.id)
	const blogPosterId = blog.user.toString()
	const userId = user.id.toString()
	if (blogPosterId === userId){
		await Blog.findByIdAndRemove(req.params.id)
		res.status(204).end()
	}
	else {
		return res.status(401).json({ error: "user token does not match creator of blog post" })
	}
})

module.exports = blogsRouter