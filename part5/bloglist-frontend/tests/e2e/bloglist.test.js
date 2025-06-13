const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('http://localhost:3003/api/testing/reset')
        await request.post('http://localhost:3003/api/users', {
            data: {
                name: 'Test User',
                username: 'testuser',
                password: 'testpass'
            }
        })

        await page.goto('http://localhost:5173')
    })

    test('Login form is shown', async ({ page }) => {
        await expect(page.getByText('Log in to application')).toBeVisible()
        await expect(page.getByText('username')).toBeVisible()
        await expect(page.getByText('password')).toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await page.getByTestId('username-input').fill('testuser')
            await page.getByTestId('password-input').fill('testpass')
            await page.getByTestId('login-button').click()

            await expect(page.getByText('Test User logged in')).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await page.getByTestId('username-input').fill('wronguser')
            await page.getByTestId('password-input').fill('wrongpass')
            await page.getByTestId('login-button').click()

            await expect(page.getByText('Wrong credentials')).toBeVisible()
            await expect(page.getByText('Test User logged in')).not.toBeVisible()
        })
    })

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await page.getByTestId('username-input').fill('testuser')
            await page.getByTestId('password-input').fill('testpass')
            await page.getByTestId('login-button').click()
        })

        test('a new blog can be created', async ({ page }) => {
            await page.getByRole('button', { name: 'create new blog' }).click()
            await page.getByTestId('title-input').fill('Test Blog Title')
            await page.getByTestId('author-input').fill('Test Blog Author')
            await page.getByTestId('url-input').fill('http://testblog.com')
            await page.getByTestId('create-button').click()

            await expect(page.getByText('Test Blog Title Test Blog Author')).toBeVisible()
        })

        test('blog can be liked', async ({ page }) => {
            // First create a blog
            await page.getByRole('button', { name: 'create new blog' }).click()
            await page.getByTestId('title-input').fill('Test Blog Title')
            await page.getByTestId('author-input').fill('Test Blog Author')
            await page.getByTestId('url-input').fill('http://testblog.com')
            await page.getByTestId('create-button').click()

            await page.getByRole('button', { name: 'view' }).click()
            await page.getByRole('button', { name: 'like' }).click()
            await expect(page.getByText('likes: 1')).toBeVisible()
        })

        test('blog can be deleted by creator', async ({ page }) => {
            // First create a blog
            await page.getByRole('button', { name: 'create new blog' }).click()
            await page.getByTestId('title-input').fill('Test Blog Title')
            await page.getByTestId('author-input').fill('Test Blog Author')
            await page.getByTestId('url-input').fill('http://testblog.com')
            await page.getByTestId('create-button').click()

            await page.getByRole('button', { name: 'view' }).click()
            await page.getByRole('button', { name: 'remove' }).click()

            await expect(page.getByText('Test Blog Title Test Blog Author')).not.toBeVisible()
        })

        test('only creator sees delete button', async ({ page }) => {
            // First create a blog
            await page.getByRole('button', { name: 'create new blog' }).click()
            await page.getByTestId('title-input').fill('Test Blog Title')
            await page.getByTestId('author-input').fill('Test Blog Author')
            await page.getByTestId('url-input').fill('http://testblog.com')
            await page.getByTestId('create-button').click()

            await page.getByRole('button', { name: 'view' }).click()
            await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()

            // Logout and login as different user
            await page.getByRole('button', { name: 'logout' }).click()
            await request.post('http://localhost:3003/api/users', {
                data: {
                    name: 'Other User',
                    username: 'otheruser',
                    password: 'otherpass'
                }
            })
            await page.getByTestId('username-input').fill('otheruser')
            await page.getByTestId('password-input').fill('otherpass')
            await page.getByTestId('login-button').click()

            await page.getByRole('button', { name: 'view' }).click()
            await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
        })

        test('blogs are ordered by likes', async ({ page }) => {
            // Create two blogs
            await page.getByRole('button', { name: 'create new blog' }).click()
            await page.getByTestId('title-input').fill('Blog with 5 likes')
            await page.getByTestId('author-input').fill('Author 1')
            await page.getByTestId('url-input').fill('http://blog1.com')
            await page.getByTestId('create-button').click()

            await page.getByRole('button', { name: 'view' }).first().click()
            const likeButton = page.getByRole('button', { name: 'like' }).first()
            for (let i = 0; i < 5; i++) {
                await likeButton.click()
            }

            await page.getByRole('button', { name: 'create new blog' }).click()
            await page.getByTestId('title-input').fill('Blog with 10 likes')
            await page.getByTestId('author-input').fill('Author 2')
            await page.getByTestId('url-input').fill('http://blog2.com')
            await page.getByTestId('create-button').click()

            await page.getByRole('button', { name: 'view' }).nth(1).click()
            const secondLikeButton = page.getByRole('button', { name: 'like' }).nth(1)
            for (let i = 0; i < 10; i++) {
                await secondLikeButton.click()
            }

            // Check order
            const blogs = await page.$$('.blog')
            expect(await blogs[0].innerText()).toContain('Blog with 10 likes')
            expect(await blogs[1].innerText()).toContain('Blog with 5 likes')
        })
    })
})