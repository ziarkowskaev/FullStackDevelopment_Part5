import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test(' form calls the event handler it received as props with the right details when a new blog is created', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const inputs = screen.getAllByRole('textbox')
  const sendButton = screen.getByText('Create')

  await user.type(inputs[0], 'Testing React')
  await user.type(inputs[1], 'Jane Doe')
  await user.type(inputs[2], 'https://reacttesting.com')
  await user.click(sendButton)

  expect(createBlog).toHaveBeenCalledTimes(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Testing React')
  expect(createBlog.mock.calls[0][0].author).toBe('Jane Doe')
  expect(createBlog.mock.calls[0][0].url).toBe('https://reacttesting.com')
})