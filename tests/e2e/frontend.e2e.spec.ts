import { test, expect, Page } from '@playwright/test'

test.describe('Frontend', () => {
  let page: Page

  test.beforeAll(async ({ browser }, testInfo) => {
    const context = await browser.newContext()
    page = await context.newPage()
  })

  test('can go on homepage', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page).toHaveTitle(/Payload Blank Template/)

    const heading = page.locator('h1').first()

    await expect(heading).toHaveText('Welcome to your new project.')
  })

  test('can navigate to categories page and select a category', async ({ page }) => {
    // 1. Ir a la página de categorías
    await page.goto('http://localhost:3000/categories')

    // 2. Verificar que el título de bienvenida se muestra
    const heading = page.locator('h1').first()
    await expect(heading).toHaveText('¿Qué te gustaría comer hoy?')

    // 3. Buscar el primer enlace a una categoría
    const firstCategoryLink = page.locator('main a').first()
    await expect(firstCategoryLink).toBeVisible()

    const href = await firstCategoryLink.getAttribute('href')
    expect(href).toContain('/categories/')

    // 4. Hacer clic en la categoría
    await firstCategoryLink.click()

    // 5. Verificar que nos redirigió a la URL de la categoría seleccionada
    await expect(page).toHaveURL(new RegExp(href || ''))

    // 6. Verificar que la página cargó y muestra el enlace para volver
    const backLink = page.locator('text=← Volver a Categorías')
    await expect(backLink).toBeVisible()
  })
})
