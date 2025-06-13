import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> calls createBlog with the right details', async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup()

    render(<BlogForm createBlog={createBlog} />)

    const titleInput = screen.getByPlaceholderText('title')
    const authorInput = screen.getByPlaceholderText('author')
    const urlInput = screen.getByPlaceholderText('url')
    const createButton = screen.getByText('create')

    await user.type(titleInput, 'Test Title')
    await user.type(authorInput, 'Test Author')
    await user.type(urlInput, 'http://test.com')
    await user.click(createButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0]).toEqual({
        title: 'Test Title',
        author: 'Test Author',
        url: 'http://test.com'
    })
})