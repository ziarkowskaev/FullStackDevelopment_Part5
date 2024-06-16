const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http:localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Jane Doe',
        username: 'janedoe',
        password: 'sekret'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await page.goto('http://localhost:5173')
    await page.getByRole('button', { name: 'Log in' }).click()
    await page.getByTestId('username').toBeVisible
    await page.getByTestId('password').toBeVisible
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {

        await page.getByRole('button', { name: 'Log in' }).click()
        await loginWith(page, 'mluukkai', 'salainen')
  
        await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {

        await page.getByRole('button', { name: 'Log in' }).click()
        await loginWith(page, 'mluukkai', 'wrong')

        const errorDiv = await page.locator('.notification')
        await expect(errorDiv).toContainText('Wrong credentials')
        await expect(errorDiv).toHaveCSS('border-style', 'solid')
        await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
        await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
        await page.getByRole('button', { name: 'Log in' }).click()
        await loginWith(page, 'mluukkai', 'salainen')
    })
  
    test('a new blog can be created', async ({ page }) => {
        await createBlog(page, 'React patterns','Michael Chan','https://reactpatterns.com/')
        await expect(page.getByText('React patterns Michael Chan')).toBeVisible()
    })
  })

  describe('Make sure that blog can be liked', () => {
    beforeEach(async ({ page }) => {

        await page.getByRole('button', { name: 'Log in' }).click()
        await loginWith(page, 'mluukkai', 'salainen')
        await createBlog(page, 'React patterns','Michael Chan','https://reactpatterns.com/')
    })
  
    test('can like a blog', async ({ page }) => {
        await page.getByRole('button', { name: 'View details' }).click();
        await expect(page.getByText('Likes 0')).toBeVisible()
        await page.getByRole('button', { name: 'Like' }).click();

        await page.getByText('Likes 1').waitFor()
    
        await expect(page.getByText('Likes 1')).toBeVisible()
    
    })
  })

  describe('delete the blog', () => {
    beforeEach(async ({ page }) => {

        await page.getByRole('button', { name: 'Log in' }).click()
        await loginWith(page, 'mluukkai', 'salainen')
        await createBlog(page, 'React patterns','Michael Chan','https://reactpatterns.com/')
    })

    test('user who created the blog can delete it', async ({ page }) => {
        
        await expect(page.getByText('React patterns Michael Chan')).toBeVisible()
        await page.getByRole('button', { name: 'View details' }).click()
        await page.getByRole('button', { name: 'Delete' }).click()
        page.on('dialog', dialog => dialog.accept());
        await page.getByRole('button').click();
        await expect(page.getByText('React patterns Michael Chan')).not.toBeVisible()
    })
  })
  
})

  describe('only the user who added the blog sees the blogs delete button', () => {
    beforeEach(async ({ page }) => {

        await page.getByRole('button', { name: 'Log in' }).click()
        await loginWith(page, 'mluukkai', 'salainen')
        await createBlog(page, 'React patterns','Michael Chan','https://reactpatterns.com/')
    })

    test('user who created the blog', async ({ page }) => {
        await page.getByRole('button', { name: 'View details' }).click()
        await page.getByRole('button', { name: 'Delete' }).isVisible()
        
    })

    test('user who didnt create the blog', async ({ page }) => {
        await page.getByRole('button', { name: 'Log out' }).click()
        await loginWith(page, 'janedoe', 'sekret')
        await page.getByRole('button', { name: 'View details' }).click()
        await page.getByRole('button', { name: 'Delete' }).isHidden()
    })
  })
  