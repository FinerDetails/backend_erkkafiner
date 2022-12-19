const listHelper = require("../utils/list_helper")

const manyBlogs = [
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
	},
	{
		_id: "5a422b891b54a676234d17fa",
		title: "First class tests",
		author: "Robert C. Martin",
		url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
		likes: 10,
		__v: 0
	},
	{
		_id: "5a422ba71b54a676234d17fb",
		title: "TDD harms architecture",
		author: "Robert C. Martin",
		url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
		likes: 0,
		__v: 0
	},
	{
		_id: "5a422bc61b54a676234d17fc",
		title: "Type wars",
		author: "Robert C. Martin",
		url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
		likes: 2,
		__v: 0
	}
]
const oneBlog = [
	{
		_id: "5a422a851b54a676234d17f7",
		title: "React patterns",
		author: "Michael Chan",
		url: "https://reactpatterns.com/",
		likes: 7,
		__v: 0
	}
]
const emptyBlog = []

describe("functions", () => {

	test("dummy returns one", () => {
		const result = listHelper.dummy(emptyBlog)
		expect(result).toBe(1)
	})
	describe("bloglist", () => {

		test("list with multiple blogs", () => {
			const result = listHelper.totalLikes(manyBlogs)
			expect(result).toBe(36)
		})
		test("list with a single blog", () => {
			const result = listHelper.totalLikes(oneBlog)
			expect(result).toBe(7)
		})
		test("list with 0 blogs", () => {
			const result = listHelper.totalLikes(emptyBlog)
			expect(result).toBe(0)
		})
	})
	describe("blog with max likes", () => {
		test("max likes with multiple blogs", () => {
			const result = listHelper.favouriteBlog(manyBlogs)
			expect(result).toEqual({ title: "Canonical string reduction", author: "Edsger W. Dijkstra", likes: 12 })
		})
		test("max likes with a single blog", () => {
			const result = listHelper.favouriteBlog(oneBlog)
			expect(result).toEqual({ title: "React patterns", author: "Michael Chan", likes: 7 })
		})
		test("max likes with 0 blogs", () => {
			const result = listHelper.favouriteBlog(emptyBlog)
			expect(result).toBe(0)
		})
	})
	describe("most blogs", () => {
		test("most blogs with multiple blogs", () => {
			const result = listHelper.mostBlogs(manyBlogs)
			expect(result).toEqual({ author: "Robert C. Martin", blogs: 3 })
		})
		test("most blogs with a single blog", () => {
			const result = listHelper.mostBlogs(oneBlog)
			expect(result).toEqual({ author: "Michael Chan", blogs: 1 })
		})
		test("most blogs with 0 blogs", () => {
			const result = listHelper.mostBlogs(emptyBlog)
			expect(result).toBe(0)
		})
	})

	describe("author with most combined likes", () => {
		test("most likes with multiple blogs", () => {
			const result = listHelper.mostLikes(manyBlogs)
			expect(result).toEqual({
				author: "Edsger W. Dijkstra", likes: 17
			})
		})
		test("most likes with a single blog", () => {
			const result = listHelper.mostLikes(oneBlog)
			expect(result).toEqual({
				author: "Michael Chan", likes: 7
			})
		})
		test("most likes with 0 blogs", () => {
			const result = listHelper.mostLikes(emptyBlog)
			expect(result).toBe(0)
		})
	})
})