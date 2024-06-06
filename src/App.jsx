import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [message, setMessage] = useState(null)
  const [user, setUser] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)

  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs.sort(compareBlogs)))
  }, [])

  function compareBlogs(a, b) {
    return a.likes < b.likes
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setMessage('Logged in user')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }
  const handleLogOut = async (event) => {
    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)
    setUsername('')
    setPassword('')
  }

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>Log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()

    blogService.create(blogObject).then((returnedBlog) => {
      setBlogs(blogs.concat(returnedBlog))
    })
  }

  const addLike = (id) => {
    const blog = blogs.find((blog) => blog.id === id)

    const blogLikes = blog.likes

    const changedBlog = { ...blog, likes: blogLikes + 1 }

    blogService
      .update(id, changedBlog)
      .then((returnedBlog) => {
        setBlogs(
          blogs.map((b) =>
            b.id !== id ? b : { ...returnedBlog, user: blog.user },
          ),
        )
      })
      .catch((error) => {
        console.log(error)
        setErrorMessage('Can\'t like removed blog')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const deleteBlog = (id) => {
    const blogFind = blogs.find((blog) => blog.id === id)
    if(confirm('Remove ' + blogFind.title + ' by ' + blogFind.author)){
      const blog = blogs.filter((blog) => blog.id !== id)
      blogService
        .deleteBlog(id)
        .then(setBlogs(blog))
        .catch((error) => {
          console.log(error)
          setErrorMessage('Error when deleting')
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification bad={true} message={errorMessage} />
      <Notification bad={false} message={message} />

      {!user && loginForm()}

      {user && (
        <div>
          <div>
            {user.name} logged in
            <button onClick={() => handleLogOut()}>Log out</button>
          </div>

          <Togglable buttonLabel="New Blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
          {blogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              handleLike={addLike}
              authUser={user}
              handleDelete={deleteBlog}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default App
