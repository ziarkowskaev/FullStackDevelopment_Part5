import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'


test('renders the blog title and author, but does not render its URL or number of likes by default', () => {
  const blog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    user: { id: '123', name: 'Jane Doe' }
  }
  const authUser = { id: '456', name: 'John Doe' }

  const { container } = render(<Blog blog={blog} authUser={authUser}/>)

  const element1 = screen.getByText('React patterns Michael Chan')
  expect(element1).toBeDefined()
  const div = container.querySelector('.togglableContent')
  expect(div).toHaveStyle('display: none')
})

test('the blogs URL and number of likes are shown when the button controlling the shown details has been clicked', async () => {
  const blog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    user: { id: '123', name: 'Jane Doe' }
  }
  const authUser = { id: '456', name: 'John Doe' }

  const { container } = render(<Blog blog={blog} authUser={authUser}/>)

  const user = userEvent.setup()
  const button = screen.getByText('View details')
  await user.click(button)
  const div = container.querySelector('.togglableContent')
  expect(div).not.toHaveStyle('display: none')
})

test('if the like button is clicked twice, the event handler the component received as props is called twice', async () => {
  const blog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    user: { id: '123', name: 'Jane Doe' }
  }
  const authUser = { id: '456', name: 'John Doe' }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} authUser={authUser} handleLike={mockHandler}/>)

  const user = userEvent.setup()
  const button = screen.getByText('Like')
  await user.click(button)
  await user.click(button)
  expect(mockHandler.mock.calls).toHaveLength(2)
})