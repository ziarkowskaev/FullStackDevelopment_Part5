import { useState, useEffect} from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [errorMessage, setErrorMessage] = useState(null)
  const [message, setMessage] = useState(null)
  const [user, setUser] = useState(null)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])



   const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      ) 
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
  const handleLoginOut = async (event) => {
    
      window.localStorage.removeItem('loggedNoteappUser')
      setUser(null)
      setUsername('')
      setPassword('')
   
  }

  const addBlog = async (event) => {
    event.preventDefault()
    
    const blogObject = {
      title: title,
      author: author,
      url: url
    }
  
    blogService
      .create(blogObject)
        .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setMessage('a new blog '+ title + ' by '+ author + ' added')
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        setTitle('')
        setAuthor('')
        setUrl('')
      })
  }

  const loginForm = () => (
   
    <div>   
      <form onSubmit={handleLogin}>
        <div>
          username
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )

  const renderedBlogs = () => (
    
    blogs.map(blog =>
      <Blog key={blog.id} blog={blog} />
    )
  )
  const nameToDisplay = () => (
    (user.name
      ? user.name 
      : user.username) + " logged in"
  )

  const blogForm = () => (
     <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          Title:
            <input
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          Author:
            <input
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
            <input
            type="text"
            value={url}
            name="url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">Create</button>
      </form>
   

     </div>
    
  )

  return (
    <div>
      <h2>Blogs</h2>
      <Notification bad = {true} message={errorMessage} />
      <Notification  bad = {false} message={message} />
     
      {user !== null && blogForm()}
      {user !== null && renderedBlogs()}

      {user === null ?
      loginForm() :
      <div>
        <p>{nameToDisplay()} logged-in </p>
        <button onClick={handleLoginOut}>
        Logout
      </button>
        {blogForm()}
        {renderedBlogs()}
      </div>
    }
    </div>
  )
}

export default App