import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
    let container
    const blog = {
        title: 'Test Blog',
        author: 'Test Author',
        url: 'http://test.com',
        likes: 5,
        user: {
            name: 'Test User',
            username: 'testuser'
        }
    }
    const user = { username: 'testuser' }
    const mockUpdateBlog = vi.fn()
    const mockRemoveBlog = vi.fn()

    beforeEach(() => {
        container = render(
            <Blog
                blog={blog}
                updateBlog={mockUpdateBlog}
                removeBlog={mockRemoveBlog}
                user={user}
            />
        ).container
    })

    test('renders title and author but not URL or likes by default', () => {
        const titleAuthor = screen.getByText('Test Blog Test Author')
        expect(titleAuthor).toBeDefined()

        const url = screen.queryByText('http://test.com')
        expect(url).toBeNull()

        const likes = screen.queryByText('likes: 5')
        expect(likes).toBeNull()
    })

    test('shows URL and likes when view button is clicked', async () => {
        const user = userEvent.setup()
        const button = screen.getByText('view')
        await user.click(button)

        const url = screen.getByText('http://test.com')
        expect(url).toBeDefined()

        const likes = screen.getByText('likes: 5')
        expect(likes).toBeDefined()
    })

    test('like button is clicked twice', async () => {
        const user = userEvent.setup()
        const viewButton = screen.getByText('view')
        await user.click(viewButton)

        const likeButton = screen.getByText('like')
        await user.click(likeButton)
        await user.click(likeButton)

        expect(mockUpdateBlog.mock.calls).toHaveLength(2)
    })
})