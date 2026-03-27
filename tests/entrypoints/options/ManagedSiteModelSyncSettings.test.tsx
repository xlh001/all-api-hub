import type { ReactNode } from "react"
import toast from "react-hot-toast"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { MENU_ITEM_IDS } from "~/constants/optionsMenuIds"
import { RuntimeActionIds } from "~/constants/runtimeActions"
import ManagedSiteModelSyncSettings from "~/features/BasicSettings/components/tabs/ManagedSite/managedSiteModelSyncSettings"
import { modelMetadataService } from "~/services/models/modelMetadata"
import { sendRuntimeMessage } from "~/utils/browser/browserApi"
import { navigateWithinOptionsPage } from "~/utils/navigation"
import { fireEvent, render, screen, waitFor } from "~~/tests/test-utils/render"

const {
  mockedUseUserPreferencesContext,
  mockUpdateNewApiModelSync,
  mockResetNewApiModelSyncConfig,
} = vi.hoisted(() => ({
  mockedUseUserPreferencesContext: vi.fn(),
  mockUpdateNewApiModelSync: vi.fn(),
  mockResetNewApiModelSyncConfig: vi.fn(),
}))

vi.mock("~/contexts/UserPreferencesContext", async (importOriginal) => {
  const actual =
    (await importOriginal()) as typeof import("~/contexts/UserPreferencesContext")

  return {
    ...actual,
    UserPreferencesProvider: ({ children }: { children: ReactNode }) =>
      children,
    useUserPreferencesContext: () => mockedUseUserPreferencesContext(),
  }
})

vi.mock("~/utils/browser/browserApi", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("~/utils/browser/browserApi")>()

  return {
    ...actual,
    sendRuntimeMessage: vi.fn(),
  }
})

vi.mock("~/services/models/modelMetadata", () => ({
  modelMetadataService: {
    initialize: vi.fn(),
    getAllMetadata: vi.fn(),
  },
}))

vi.mock("~/utils/navigation", async (importOriginal) => {
  const actual = await importOriginal<typeof import("~/utils/navigation")>()

  return {
    ...actual,
    navigateWithinOptionsPage: vi.fn(),
  }
})

vi.mock("~/utils/core/identifier", () => ({
  safeRandomUUID: vi.fn(() => "generated-filter-id"),
}))

vi.mock("react-hot-toast", () => ({
  default: {
    error: vi.fn(),
    success: vi.fn(),
  },
}))

vi.mock("~/components/SettingSection", () => ({
  SettingSection: ({
    children,
    title,
    description,
    onReset,
  }: {
    children: ReactNode
    title: string
    description: string
    onReset?: () => Promise<boolean>
  }) => (
    <section>
      <h2>{title}</h2>
      <p>{description}</p>
      <button onClick={() => void onReset?.()}>common:actions.reset</button>
      {children}
    </section>
  ),
}))

vi.mock("~/components/ChannelFiltersEditor", () => ({
  default: ({
    filters,
    jsonText,
    onAddFilter,
    onChangeJsonText,
    onClickViewJson,
    onClickViewVisual,
  }: any) => (
    <div>
      <div data-testid="filter-count">{filters.length}</div>
      <button onClick={onAddFilter}>add-filter</button>
      <button onClick={onClickViewJson}>view-json</button>
      <button onClick={onClickViewVisual}>view-visual</button>
      <textarea
        aria-label="json-text"
        value={jsonText}
        onChange={(event) => onChangeJsonText(event.target.value)}
      />
    </div>
  ),
}))

vi.mock("~/components/ui", () => ({
  Button: ({
    children,
    onClick,
    disabled,
  }: {
    children: ReactNode
    onClick?: () => void
    disabled?: boolean
  }) => (
    <button disabled={disabled} onClick={() => onClick?.()}>
      {children}
    </button>
  ),
  Card: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  CardItem: ({
    title,
    description,
    rightContent,
    children,
  }: {
    title?: ReactNode
    description?: ReactNode
    rightContent?: ReactNode
    children?: ReactNode
  }) => (
    <div>
      {title ? <div>{title}</div> : null}
      {description ? <div>{description}</div> : null}
      {rightContent}
      {children}
    </div>
  ),
  CardList: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  CompactMultiSelect: ({
    options,
    selected,
    onChange,
    disabled,
  }: {
    options: Array<{ label: string }>
    selected: string[]
    onChange?: (value: string[]) => void
    disabled?: boolean
  }) => (
    <div>
      <div data-testid="allowed-model-options">
        {options.map((option) => option.label).join(",")}
      </div>
      <div data-testid="allowed-model-selected">{selected.join(",")}</div>
      <button
        disabled={disabled}
        onClick={() => onChange?.(["gpt-4o", "claude-3-7-sonnet"])}
      >
        select-allowed-models
      </button>
    </div>
  ),
  Input: ({
    value,
    placeholder,
    onChange,
    type,
  }: {
    value?: string
    placeholder?: string
    type?: string
    onChange?: (event: { target: { value: string } }) => void
  }) => (
    <input
      aria-label={placeholder ?? type ?? "input"}
      value={value}
      onChange={(event) =>
        onChange?.({ target: { value: event.currentTarget.value } })
      }
      type={type}
    />
  ),
  Modal: ({
    isOpen,
    children,
    footer,
    header,
  }: {
    isOpen: boolean
    children: ReactNode
    footer?: ReactNode
    header?: ReactNode
  }) =>
    isOpen ? (
      <div role="dialog">
        {header}
        {children}
        {footer}
      </div>
    ) : null,
  Switch: ({
    checked,
    onChange,
  }: {
    checked: boolean
    onChange?: (checked: boolean) => void
  }) => (
    <input
      aria-label="managed-site-sync-enabled"
      checked={checked}
      onChange={(event) => onChange?.(event.currentTarget.checked)}
      type="checkbox"
    />
  ),
}))

const mockedSendRuntimeMessage = sendRuntimeMessage as unknown as ReturnType<
  typeof vi.fn
>
const mockedModelMetadataService = modelMetadataService as unknown as {
  initialize: ReturnType<typeof vi.fn>
  getAllMetadata: ReturnType<typeof vi.fn>
}
const mockedNavigateWithinOptionsPage =
  navigateWithinOptionsPage as unknown as ReturnType<typeof vi.fn>

const createContextValue = (overrides: Record<string, unknown> = {}) => ({
  preferences: {
    managedSiteModelSync: {
      enabled: true,
      interval: 24 * 60 * 60 * 1000,
      concurrency: 2,
      maxRetries: 2,
      rateLimit: { requestsPerMinute: 20, burst: 5 },
      allowedModels: ["existing-model"],
      globalChannelModelFilters: [],
    },
  },
  updateNewApiModelSync: mockUpdateNewApiModelSync,
  resetNewApiModelSyncConfig: mockResetNewApiModelSyncConfig,
  ...overrides,
})

describe("ManagedSiteModelSyncSettings", () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockUpdateNewApiModelSync.mockResolvedValue(true)
    mockResetNewApiModelSyncConfig.mockResolvedValue(true)
    mockedUseUserPreferencesContext.mockReturnValue(createContextValue())

    mockedSendRuntimeMessage.mockResolvedValue({
      success: true,
      data: ["z-model", "a-model"],
    })

    mockedModelMetadataService.initialize.mockResolvedValue(undefined)
    mockedModelMetadataService.getAllMetadata.mockReturnValue([])
  })

  it("loads runtime model options and persists toggles, intervals, and allowed models", async () => {
    render(<ManagedSiteModelSyncSettings />)

    await waitFor(() => {
      expect(mockedSendRuntimeMessage).toHaveBeenCalledWith({
        action: RuntimeActionIds.ModelSyncGetChannelUpstreamModelOptions,
      })
    })

    expect(screen.getByTestId("allowed-model-options")).toHaveTextContent(
      "a-model,z-model",
    )
    expect(screen.getByTestId("allowed-model-selected")).toHaveTextContent(
      "existing-model",
    )

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "select-allowed-models" }),
      ).not.toBeDisabled()
    })

    fireEvent.click(
      screen.getByRole("checkbox", { name: "managed-site-sync-enabled" }),
    )

    await waitFor(() => {
      expect(mockUpdateNewApiModelSync).toHaveBeenCalledWith({ enabled: false })
    })

    fireEvent.click(
      screen.getByRole("button", { name: "select-allowed-models" }),
    )

    await waitFor(() => {
      expect(mockUpdateNewApiModelSync).toHaveBeenCalledWith({
        allowedModels: ["gpt-4o", "claude-3-7-sonnet"],
      })
    })

    const intervalInput = screen.getByDisplayValue("24")
    fireEvent.change(intervalInput, { target: { value: "12" } })

    await waitFor(() => {
      expect(mockUpdateNewApiModelSync).toHaveBeenCalledWith({
        interval: 12 * 60 * 60 * 1000,
      })
    })

    expect(mockUpdateNewApiModelSync).toHaveBeenCalledWith({
      enabled: false,
    })
    expect(toast.success).toHaveBeenCalledWith(
      "managedSiteModelSync:messages.success.settingsSaved",
    )
  })

  it("falls back to model metadata when runtime options are unavailable", async () => {
    mockedSendRuntimeMessage.mockResolvedValue({
      success: true,
      data: [],
    })
    mockedModelMetadataService.getAllMetadata.mockReturnValue([
      { id: "zeta-model" },
      { id: "alpha-model" },
    ])

    render(<ManagedSiteModelSyncSettings />)

    await waitFor(() => {
      expect(mockedModelMetadataService.initialize).toHaveBeenCalledTimes(1)
    })

    expect(screen.getByTestId("allowed-model-options")).toHaveTextContent(
      "alpha-model,zeta-model",
    )
  })

  it("validates and saves global channel filters from the JSON editor", async () => {
    render(<ManagedSiteModelSyncSettings />)

    fireEvent.click(
      screen.getByRole("button", {
        name: "managedSiteModelSync:settings.globalChannelModelFiltersButton",
      }),
    )

    expect(await screen.findByRole("dialog")).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "view-json" }))
    fireEvent.change(screen.getByLabelText("json-text"), {
      target: {
        value: '[{"pattern":"^gpt","isRegex":true}]',
      },
    })

    fireEvent.click(
      screen.getByRole("button", {
        name: "managedSiteChannels:filters.actions.save",
      }),
    )

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "managedSiteChannels:filters.messages.jsonInvalid",
      )
    })

    fireEvent.change(screen.getByLabelText("json-text"), {
      target: {
        value: JSON.stringify([
          {
            name: "  GPT include  ",
            description: "  keep chat models  ",
            pattern: "  ^gpt  ",
            isRegex: true,
            action: "exclude",
            enabled: false,
          },
        ]),
      },
    })

    fireEvent.click(
      screen.getByRole("button", {
        name: "managedSiteChannels:filters.actions.save",
      }),
    )

    await waitFor(() => {
      expect(mockUpdateNewApiModelSync).toHaveBeenCalledWith({
        globalChannelModelFilters: [
          expect.objectContaining({
            id: "generated-filter-id",
            name: "GPT include",
            description: "keep chat models",
            pattern: "^gpt",
            isRegex: true,
            action: "exclude",
            enabled: false,
          }),
        ],
      })
    })

    expect(toast.success).toHaveBeenCalledWith(
      "managedSiteChannels:filters.messages.saved",
    )
  })

  it("navigates to the execution page and resets the section through SettingSection", async () => {
    render(<ManagedSiteModelSyncSettings />)

    fireEvent.click(
      screen.getByRole("button", {
        name: "managedSiteModelSync:settings.viewExecutionButton",
      }),
    )
    fireEvent.click(
      screen.getByRole("button", { name: "common:actions.reset" }),
    )

    await waitFor(() => {
      expect(mockResetNewApiModelSyncConfig).toHaveBeenCalledTimes(1)
    })

    expect(mockedNavigateWithinOptionsPage).toHaveBeenCalledWith(
      `#${MENU_ITEM_IDS.MANAGED_SITE_MODEL_SYNC}`,
    )
  })
})
