const dummy = blogs => {
	return 1
}
const totalLikes = blogs => {
	let allLikes = 0

	if (blogs.length === 0){
		return allLikes
	}

	else {
		blogs.forEach(blog => {
			allLikes = allLikes + blog.likes
		})
		return allLikes
	}
}
const favouriteBlog = blogs => {
	if (blogs.length === 0){
		return 0
	}
	else {
		const allLikes = blogs.map(blog => blog.likes)
		const maxLikes = allLikes.reduce((a,b) => Math.max(a,b), -Infinity)
		const favourite = blogs.find(blog => blog.likes === maxLikes)
		const BlogMaxLikes = { title: favourite.title, author: favourite.author, likes: favourite.likes }
		return BlogMaxLikes
	}
}
const listAuthors = blogs => {
	const authorList = []
	const allAuthors = blogs.map(blog => blog.author)
	allAuthors.forEach(author => {
		if (!authorList.find(singleAuthor => singleAuthor === author)) {
			authorList.push(author)
		}
	})
	return authorList
}

const mostBlogs = blogs => {
	if (blogs.length === 0){
		return 0
	}
	else {
		const authorList = listAuthors(blogs)
		const blogList = []
		authorList.forEach(author => {
			const blogAmount = blogs.map(blog => blog.author).filter(i => i === author).length
			blogList.push(blogAmount)
		})
		const maxBlogs = blogList.reduce((a,b) => Math.max(a,b), -Infinity)
		const authorIndex = blogList.indexOf(maxBlogs)
		const maxAuthor = { author: authorList[authorIndex], blogs: maxBlogs }
		return maxAuthor
	}
}
const mostLikes = blogs => {
	if (blogs.length === 0){
		return 0
	}
	else {
		const authorList = listAuthors(blogs)
		const likeList = []
		authorList.forEach(author => {
			const individualLikes = blogs.filter(i => i.author === author).map(blog => blog.likes)
			likeList.push(individualLikes.reduce((a, b) => a + b, 0))
		})
		const maxLikes = likeList.reduce((a,b) => Math.max(a,b), -Infinity)
		const authorIndex = likeList.indexOf(maxLikes)
		const favouriteAuthor = { author: authorList[authorIndex], likes: maxLikes }
		return(favouriteAuthor)
	}
}

module.exports = {
	dummy, totalLikes, favouriteBlog, mostBlogs, mostLikes
}