import type { BrowserContext, Page, Worker } from "@playwright/test"
import { expect } from "@playwright/test"

const PERMISSION_ONBOARDING_TEST_ID = "permission-onboarding-dialog"

/**
 * Detect whether a page URL is an options page carrying the permissions
 * onboarding query flag.
 */
function isPermissionOnboardingPage(page: Page): boolean {
  try {
    const url = new URL(page.url())
    return url.searchParams.get("onboarding") === "permissions"
  } catch {
    return false
  }
}

/**
 * Resolve the MV3 service worker, waiting briefly if the extension just started.
 */
export async function getServiceWorker(
  context: BrowserContext,
): Promise<Worker> {
  return (
    context.serviceWorkers()[0] ??
    (await context.waitForEvent("serviceworker", { timeout: 15_000 }))
  )
}

/**
 * Persist a Plasmo-backed local-storage value from inside the service worker.
 */
export async function setPlasmoStorageValue(
  serviceWorker: Worker,
  key: string,
  value: unknown,
) {
  const serialized = JSON.stringify(value)
  await serviceWorker.evaluate(
    async ({ storageKey, storageValue }) => {
      const chromeApi = (globalThis as any).chrome
      await new Promise<void>((resolve, reject) => {
        chromeApi.storage.local.set(
          {
            [storageKey]: storageValue,
          },
          () => {
            const error = chromeApi.runtime?.lastError
            if (error) {
              reject(new Error(error.message))
              return
            }
            resolve()
          },
        )
      })
    },
    { storageKey: key, storageValue: serialized },
  )
}

/**
 * Remove a raw key from chrome.storage.local inside the service worker context.
 */
export async function removePlasmoStorageKey(
  serviceWorker: Worker,
  key: string,
) {
  await serviceWorker.evaluate(async (storageKey) => {
    const chromeApi = (globalThis as any).chrome
    await new Promise<void>((resolve, reject) => {
      chromeApi.storage.local.remove(storageKey, () => {
        const error = chromeApi.runtime?.lastError
        if (error) {
          reject(new Error(error.message))
          return
        }
        resolve()
      })
    })
  }, key)
}

/**
 * Read a raw value from chrome.storage.local without local deserialization.
 */
export async function getPlasmoStorageRawValue<T>(
  serviceWorker: Worker,
  key: string,
): Promise<T> {
  return await serviceWorker.evaluate(async (storageKey) => {
    const chromeApi = (globalThis as any).chrome
    return await new Promise<T>((resolve, reject) => {
      chromeApi.storage.local.get(storageKey, (stored: Record<string, T>) => {
        const error = chromeApi.runtime?.lastError
        if (error) {
          reject(new Error(error.message))
          return
        }
        resolve(stored[storageKey])
      })
    })
  }, key)
}

/**
 * Close every page in the context except the one the test actively drives.
 */
export async function closeOtherPages(
  context: BrowserContext,
  keepPage?: Page,
): Promise<void> {
  await Promise.allSettled(
    context
      .pages()
      .filter((existingPage) => existingPage !== keepPage)
      .map((existingPage) => existingPage.close()),
  )
}

/**
 * Assert that the first-install permission onboarding dialog is not present.
 */
export async function expectPermissionOnboardingHidden(page: Page) {
  await expect
    .poll(() => isPermissionOnboardingPage(page), {
      message: "Permission onboarding query param should not be present",
    })
    .toBe(false)

  await expect(page.getByTestId(PERMISSION_ONBOARDING_TEST_ID)).toHaveCount(0)
}
