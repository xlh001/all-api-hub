import { beforeAll, describe, expect, it } from "vitest"

import { SearchableSelect } from "~/components/ui"
import uiEn from "~/locales/en/ui.json"
import { testI18n } from "~/tests/test-utils/i18n"
import { fireEvent, render, screen } from "~/tests/test-utils/render"

describe("SearchableSelect", () => {
  beforeAll(() => {
    testI18n.addResourceBundle("en", "ui", uiEn, true, true)
  })

  it("shows a custom-entry hint when options are empty and allowCustomValue is enabled", async () => {
    render(
      <SearchableSelect
        options={[]}
        value=""
        onChange={() => {}}
        allowCustomValue
      />,
    )

    const combo = await screen.findByRole("combobox")
    fireEvent.click(combo)

    expect(
      await screen.findByText(uiEn.searchableSelect.noOptionsAllowCustom),
    ).toBeInTheDocument()
  })

  it("shows a no-options message when options are empty and allowCustomValue is disabled", async () => {
    render(<SearchableSelect options={[]} value="" onChange={() => {}} />)

    const combo = await screen.findByRole("combobox")
    fireEvent.click(combo)

    expect(
      await screen.findByText(uiEn.searchableSelect.noOptions),
    ).toBeInTheDocument()
  })
})
