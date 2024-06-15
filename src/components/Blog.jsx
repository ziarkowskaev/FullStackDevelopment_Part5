import Togglable from './Togglable'
import PropTypes from 'prop-types'
import { useRef } from 'react'
const Blog = ({ blog, handleLike, authUser, handleDelete }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }
  const blogDetailsRef = useRef()

  return (
    <div className='blog' style={blogStyle}>
      <div>
        {blog.title} {blog.author}
      </div>
      <Togglable buttonLabel="View details" ref={blogDetailsRef}>
        <ul>
          <li>{blog.url}</li>
          <li data-testid='likes'>
            Likes {blog.likes}{' '}
            <button onClick={() => handleLike(blog.id)}>Like</button>
          </li>
          <li>{blog.user.name ? blog.user.name : blog.user.username}</li>
        </ul>
        {authUser.id === blog.user.id && (
          <button
            style={{
              backgroundColor: '#008CBA',
              border: 'none',
              borderRadius: '5px',
            }}
            onClick={() => handleDelete(blog.id)}
          >
            Delete
          </button>
        )}
      </Togglable>
    </div>
  )
}

export default Blog
