import { useState } from "react";
import Notification from "./Notification";
const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState(null);

  const addBlog = async (event) => {
    event.preventDefault();

    createBlog({
      title: title,
      author: author,
      url: url,
    });

    setMessage("a new blog " + title + " by " + author + " added");
    setTimeout(() => {
      setMessage(null);
    }, 5000);
    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <div>
      <Notification bad={false} message={message} />
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
  );
};

export default BlogForm;
