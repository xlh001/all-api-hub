import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import React from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { UI_CONSTANTS } from "~/constants/ui"
import { ModelDisplay } from "~/features/ModelList/components/ModelDisplay"
import {
  createAccountModelVerificationHistoryTarget,
  createProfileModelVerificationHistoryTarget,
  serializeVerificationHistoryTarget,
} from "~/services/verification/verificationResultHistory"

const { modelItemSpy } = vi.hoisted(() => ({
  modelItemSpy: vi.fn(),
}))

vi.mock("react-i18next", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-i18next")>()

  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => `modelList:${key}`,
    }),
  }
})

vi.mock("~/components/ui", () => ({
  EmptyState: ({ title }: { title: string }) => (
    <div data-testid="empty-state">{title}</div>
  ),
}))

vi.mock("react-virtuoso", () => ({
  Virtuoso: ({
    data,
    itemContent,
    components,
  }: {
    data: any[]
    itemContent: (index: number, item: any) => React.ReactNode
    components?: { Item?: React.ComponentType<any> }
  }) => {
    const Item = components?.Item ?? ((props: any) => <div {...props} />)

    return (
      <div data-testid="virtuoso">
        {data.map((item, index) => (
          <Item key={`${item.model.model_name}-${index}`}>
            {itemContent(index, item)}
          </Item>
        ))}
      </div>
    )
  },
}))

vi.mock("~/features/ModelList/components/ModelItem", () => ({
  default: (props: any) => {
    modelItemSpy(props)

    return (
      <div
        data-testid="model-item"
        data-model-id={props.model.model_name}
        data-exchange-rate={String(props.exchangeRate)}
        data-user-group={props.userGroup}
        data-all-groups={String(props.isAllGroupsMode)}
        data-summary-status={props.verificationSummary?.status ?? "none"}
        data-source-kind={props.source.kind}
      >
        <button
          type="button"
          onClick={() =>
            props.onVerifyModel?.(props.source, props.model.model_name)
          }
        >
          verify-{props.model.model_name}
        </button>
        <button
          type="button"
          onClick={() =>
            props.onVerifyCliSupport?.(props.source, props.model.model_name)
          }
        >
          verify-cli-{props.model.model_name}
        </button>
        {props.source.kind === "account" ? (
          <button
            type="button"
            onClick={() =>
              props.onOpenModelKeyDialog?.(
                props.source.account,
                props.model.model_name,
                props.model.enable_groups,
              )
            }
          >
            key-{props.model.model_name}
          </button>
        ) : null}
      </div>
    )
  },
}))

const ACCOUNT_SOURCE = {
  kind: "account",
  account: {
    id: "account-1",
    name: "Account One",
    balance: {
      USD: 10,
      CNY: 80,
    },
  },
} as any

const PROFILE_SOURCE = {
  kind: "profile",
  profile: {
    id: "profile-1",
    name: "Reusable Profile",
  },
} as any

const createCalculatedModel = (overrides: Record<string, unknown>) => ({
  model: {
    model_name: "gpt-4o-mini",
    enable_groups: ["default", "vip"],
    supported_endpoint_types: ["chat"],
    ...overrides.model,
  },
  calculatedPrice: {
    inputUSD: 1,
    outputUSD: 2,
    inputCNY: 7,
    outputCNY: 14,
    ...overrides.calculatedPrice,
  },
  source: overrides.source ?? ACCOUNT_SOURCE,
  ...overrides,
})

describe("ModelDisplay", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("shows an empty state when no filtered models are available", () => {
    render(
      <ModelDisplay
        models={[]}
        verificationSummariesByKey={{}}
        showRealPrice={true}
        showRatioColumn={true}
        showEndpointTypes={true}
        selectedGroup="all"
        handleGroupClick={vi.fn()}
        availableGroups={["default"]}
      />,
    )

    expect(screen.getByTestId("empty-state")).toHaveTextContent(
      "modelList:noMatchingModels",
    )
    expect(screen.queryByTestId("virtuoso")).not.toBeInTheDocument()
  })

  it("derives account exchange rates, group mode, and account verification summaries for rendered model cards", async () => {
    const user = userEvent.setup()
    const onVerifyModel = vi.fn()
    const onVerifyCliSupport = vi.fn()
    const onOpenModelKeyDialog = vi.fn()
    const handleGroupClick = vi.fn()
    const accountSummaryKey = serializeVerificationHistoryTarget(
      createAccountModelVerificationHistoryTarget("account-1", "gpt-4o-mini"),
    )

    render(
      <ModelDisplay
        models={[
          createCalculatedModel({}),
          createCalculatedModel({
            model: {
              model_name: "gemini-1.5-pro",
              enable_groups: ["default"],
            },
            source: {
              ...ACCOUNT_SOURCE,
              account: {
                ...ACCOUNT_SOURCE.account,
                id: "account-2",
                balance: { USD: 0, CNY: 60 },
              },
            },
          }),
        ]}
        verificationSummariesByKey={{
          [accountSummaryKey]: { status: "success" } as any,
        }}
        onVerifyModel={onVerifyModel}
        onVerifyCliSupport={onVerifyCliSupport}
        onOpenModelKeyDialog={onOpenModelKeyDialog}
        showRealPrice={true}
        showRatioColumn={true}
        showEndpointTypes={true}
        selectedGroup="all"
        handleGroupClick={handleGroupClick}
        availableGroups={["default", "vip"]}
        displayCapabilities={{ canVerify: true } as any}
      />,
    )

    const [accountItem, defaultRateItem] = screen.getAllByTestId("model-item")

    expect(accountItem).toHaveAttribute("data-source-kind", "account")
    expect(accountItem).toHaveAttribute("data-exchange-rate", "8")
    expect(accountItem).toHaveAttribute("data-user-group", "default")
    expect(accountItem).toHaveAttribute("data-all-groups", "true")
    expect(accountItem).toHaveAttribute("data-summary-status", "success")

    expect(defaultRateItem).toHaveAttribute(
      "data-exchange-rate",
      String(UI_CONSTANTS.EXCHANGE_RATE.DEFAULT),
    )
    expect(defaultRateItem).toHaveAttribute("data-summary-status", "none")

    await user.click(screen.getByRole("button", { name: "verify-gpt-4o-mini" }))
    await user.click(
      screen.getByRole("button", { name: "verify-cli-gpt-4o-mini" }),
    )
    await user.click(screen.getByRole("button", { name: "key-gpt-4o-mini" }))

    expect(onVerifyModel).toHaveBeenCalledWith(ACCOUNT_SOURCE, "gpt-4o-mini")
    expect(onVerifyCliSupport).toHaveBeenCalledWith(
      ACCOUNT_SOURCE,
      "gpt-4o-mini",
    )
    expect(onOpenModelKeyDialog).toHaveBeenCalledWith(
      ACCOUNT_SOURCE.account,
      "gpt-4o-mini",
      ["default", "vip"],
    )
    expect(handleGroupClick).not.toHaveBeenCalled()
  })

  it("uses profile verification summaries and preserves non-all group selection for profile-backed items", () => {
    const profileSummaryKey = serializeVerificationHistoryTarget(
      createProfileModelVerificationHistoryTarget(
        "profile-1",
        "claude-3-5-sonnet",
      ),
    )

    render(
      <ModelDisplay
        models={[
          createCalculatedModel({
            model: {
              model_name: "claude-3-5-sonnet",
              enable_groups: ["vip"],
            },
            source: PROFILE_SOURCE,
          }),
        ]}
        verificationSummariesByKey={{
          [profileSummaryKey]: { status: "failed" } as any,
        }}
        showRealPrice={false}
        showRatioColumn={false}
        showEndpointTypes={false}
        selectedGroup="vip"
        handleGroupClick={vi.fn()}
        availableGroups={["vip"]}
      />,
    )

    expect(screen.getByTestId("model-item")).toHaveAttribute(
      "data-source-kind",
      "profile",
    )
    expect(screen.getByTestId("model-item")).toHaveAttribute(
      "data-user-group",
      "vip",
    )
    expect(screen.getByTestId("model-item")).toHaveAttribute(
      "data-all-groups",
      "false",
    )
    expect(screen.getByTestId("model-item")).toHaveAttribute(
      "data-summary-status",
      "failed",
    )
    expect(
      screen.queryByRole("button", { name: "key-claude-3-5-sonnet" }),
    ).not.toBeInTheDocument()
  })
})
