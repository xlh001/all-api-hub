import { describe, expect, it } from "vitest"

import { getHomepage, getPkgVersion, getRepository } from "~/utils/packageMeta"

describe("packageMeta", () => {
  describe("getHomepage", () => {
    it("returns homepage from package.json", () => {
      const homepage = getHomepage()
      expect(homepage).toBeTruthy()
      expect(typeof homepage).toBe("string")
    })
  })

  describe("getRepository", () => {
    it("returns repository URL", () => {
      const repo = getRepository()
      expect(repo).toBeTruthy()
      expect(typeof repo).toBe("string")
    })
  })

  describe("getPkgVersion", () => {
    it("returns version for existing dependency", () => {
      const version = getPkgVersion("react")
      expect(version).not.toBe("—")
      expect(version).toBeTruthy()
    })

    it("returns dash for non-existent dependency", () => {
      const version = getPkgVersion("non-existent-package-xyz")
      expect(version).toBe("—")
    })

    it("strips version prefixes", () => {
      const version = getPkgVersion("react")
      expect(version).not.toMatch(/^[~^><= ]/)
    })
  })
})
