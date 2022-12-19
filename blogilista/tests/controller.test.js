const supertest = require("supertest")
const app = require("../app")
const api = supertest(app)
const mongoose = require("mongoose")
const Blog = require("../models/blog")
const User = require("../models/user")

const defaultBlogs = [
	{
		_id: "5a422a851b54a676234d17f7",
		title: "React patterns",
		author: "Michael Chan",
		url: "https://reactpatterns.com/",
		likes: 7,
		__v: 0
	},
	{
		_id: "5a422aa71b54a676234d17f8",
		title: "Go To Statement Considered Harmful",
		author: "Edsger W. Dijkstra",
		url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
		likes: 5,
		__v: 0
	},
	{
		_id: "5a422b3a1b54a676234d17f9",
		title: "Canonical string reduction",
		author: "Edsger W. Dijkstra",
		url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
		likes: 12,
		__v: 0
	}
]
const defaultAccount = {
	username: "newUsername0",
	password: "1234"
}
beforeEach(async () => {
	await Blog.deleteMany({})
	let blogObject = new Blog(defaultBlogs[0])
	await blogObject.save()
	blogObject = new Blog(defaultBlogs[1])
	await blogObject.save()
	blogObject = new Blog(defaultBlogs[2])
	await blogObject.save()
	await User.deleteMany({})
	let userObject = new User(defaultAccount)
	await userObject.save()
})
describe("requests", () => {

	test("blogs are returned as JSON", async () => {
		await api
			.get("/api/blogs")
			.expect(200)
			.expect("Content-Type", /application\/json/)
	})
	test("correct amount of blogs is returned", async () => {
		const res = await api.get("/api/blogs")
		expect(res.body).toHaveLength(defaultBlogs.length)
	})
	test("blog has a correct id-field", async () => {
		const res = await api.get("/api/blogs")
		expect(res.body[0].id).toBeDefined()
	})
	test("blogs can be posted", async () => {
		const newBlog = {
			_id: "5a422b891b54a676234d17fa",
			title: "First class tests",
			author: "Robert C. Martin",
			url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
			likes: 10,
			__v: 0
		}
		await api
			.post("/api/blogs")
			.send(newBlog)
			.expect(201)
		const res = await api.get("/api/blogs")
		expect(res.body).toHaveLength(defaultBlogs.length + 1)
	})
	test("empty likes in a blog defaults to 0", async () => {
		const newBlog = {
			_id: "5a422b891b54a676234d17fa",
			title: "First class tests",
			author: "Robert C. Martin",
			url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
			likes: undefined,
			__v: 0
		}
		await api
			.post("/api/blogs")
			.send(newBlog)
			.expect(201)
		const res = await api.get("/api/blogs")
		expect(res.body[defaultBlogs.length].likes).toBe(0)
	})
	describe("missing field", () => {

		test("missing title triggers status 400", async () => {
			const newBlog = {
				_id: "5a422b891b54a676234d17fa",
				author: "Robert C. Martin",
				url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
				likes: 10,
				__v: 0
			}
			await api
				.post("/api/blogs")
				.send(newBlog)
				.expect(400)
		})

		test("missing url triggers status 400", async () => {
			const newBlog = {
				_id: "5a422b891b54a676234d17fa",
				title: "First class tests",
				author: "Robert C. Martin",
				likes: 10,
				__v: 0
			}
			await api
				.post("/api/blogs")
				.send(newBlog)
				.expect(400)
		})
	})
	test("blogs can be deleted", async () => {
		const newBlog = {
			_id: "5a422a851b54a676234d17f7"
		}
		await api
			.delete(`/api/blogs/${newBlog._id}`)
			.send(newBlog)
			.expect(204)
		const res = await api.get("/api/blogs")
		expect(res.body).toHaveLength(defaultBlogs.length - 1)
	})
	test("blogs can be edited", async () => {
		const newBlog = {
			_id: "5a422a851b54a676234d17f7",
			title: "test",
			author: "test",
			url: "http://test.html",
			likes: 1,
			__v: 0
		}
		await api
			.put(`/api/blogs/${newBlog._id}`)
			.send(newBlog)
			.expect(201)
		const res = await api.get("/api/blogs")
		const titles = res.body.map(r => r.title)
		expect(res.body).toHaveLength(defaultBlogs.length)
		expect(titles).toContain("test")
	})
	describe("user creation", () => {
		test("user can be added", async () => {
			const newAccount = {
				username: "newUsername",
				password: "1234"
			}
			await api
				.post("/api/users")
				.send(newAccount)
				.expect(201)
		})
		test("user with missing password outputs exception", async () => {
			const newAccount = {
				username: "newUsername",
			}
			await api
				.post("/api/users")
				.send(newAccount)
				.expect(400)
		})
		test("user with too short password outputs exception", async () => {
			const newAccount = {
				username: "newUsername",
				password: "12"
			}
			await api
				.post("/api/users")
				.send(newAccount)
				.expect(400)
		})
		test("user with missing username outputs exception", async () => {
			const newAccount = {
				password: "1234"
			}
			await api
				.post("/api/users")
				.send(newAccount)
				.expect(400)
		})
		test("user with too short username outputs exception", async () => {
			const newAccount = {
				username: "ne",
				password: "1234"
			}
			await api
				.post("/api/users")
				.send(newAccount)
				.expect(400)
		})
		test("user with a taken username outputs exception", async () => {
			const newAccount = {
				username: "newUsername0",
				password: "1234"
			}
			await api
				.post("/api/users")
				.send(newAccount)
				.expect(400)
		})

	})
})
afterAll(() => {
	mongoose.connection.close()
})

