import { render, renderHook, type RenderOptions } from "@testing-library/react"
import type { ReactElement, ReactNode } from "react"
import { I18nextProvider } from "react-i18next"

import { ChannelDialogProvider } from "~/components/dialogs/ChannelDialog"
import { DeviceProvider } from "~/contexts/DeviceContext"
import { ThemeProvider } from "~/contexts/ThemeContext"
import { UserPreferencesProvider } from "~/contexts/UserPreferencesContext"
import { testI18n } from "~~/tests/test-utils/i18n"

interface AppProvidersProps {
  children: ReactNode
  withUserPreferencesProvider?: boolean
  withThemeProvider?: boolean
}

function IdentityProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}

const AppProviders = ({
  children,
  withUserPreferencesProvider = true,
  withThemeProvider = true,
}: AppProvidersProps) => {
  const PreferencesProvider = withUserPreferencesProvider
    ? UserPreferencesProvider
    : IdentityProvider
  const ActiveThemeProvider = withThemeProvider
    ? ThemeProvider
    : IdentityProvider

  return (
    <I18nextProvider i18n={testI18n}>
      <DeviceProvider>
        <PreferencesProvider>
          <ChannelDialogProvider>
            <ActiveThemeProvider>{children}</ActiveThemeProvider>
          </ChannelDialogProvider>
        </PreferencesProvider>
      </DeviceProvider>
    </I18nextProvider>
  )
}

interface AppRenderOptions extends Omit<RenderOptions, "wrapper"> {
  withUserPreferencesProvider?: boolean
  withThemeProvider?: boolean
}

const customRender = (ui: ReactElement, options?: AppRenderOptions) => {
  const {
    withUserPreferencesProvider = true,
    withThemeProvider = true,
    ...renderOptions
  } = options ?? {}

  return render(ui, {
    wrapper: ({ children }) => (
      <AppProviders
        withUserPreferencesProvider={withUserPreferencesProvider}
        withThemeProvider={withThemeProvider}
      >
        {children}
      </AppProviders>
    ),
    ...renderOptions,
  })
}

const customRenderHook: typeof renderHook = (callback, options) => {
  const {
    withUserPreferencesProvider = true,
    withThemeProvider = true,
    ...renderHookOptions
  } = (options ?? {}) as {
    withUserPreferencesProvider?: boolean
    withThemeProvider?: boolean
  }

  return renderHook(callback, {
    wrapper: ({ children }) => (
      <AppProviders
        withUserPreferencesProvider={withUserPreferencesProvider}
        withThemeProvider={withThemeProvider}
      >
        {children}
      </AppProviders>
    ),
    ...renderHookOptions,
  })
}

// eslint-disable-next-line import/export
export * from "@testing-library/react"
// eslint-disable-next-line import/export
export { customRender as render }
// eslint-disable-next-line import/export
export { customRenderHook as renderHook }
