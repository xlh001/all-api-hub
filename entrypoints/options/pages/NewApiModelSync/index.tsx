import {
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline"
import dayjs from "dayjs"
import { useCallback, useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"

import {
  Badge,
  Button,
  Card,
  EmptyState,
  Heading3,
  Input
} from "~/components/ui"
import type {
  ExecutionProgress,
  ExecutionResult
} from "~/types/newApiModelSync"
import { formatFullTime } from "~/utils/formatters"

type FilterStatus = "all" | "success" | "failed"

export default function NewApiModelSync() {
  const { t } = useTranslation("newApiModelSync")
  const [lastExecution, setLastExecution] = useState<ExecutionResult | null>(
    null
  )
  const [progress, setProgress] = useState<ExecutionProgress | null>(null)
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all")
  const [searchKeyword, setSearchKeyword] = useState("")
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [isLoading, setIsLoading] = useState(true)

  const loadLastExecution = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await browser.runtime.sendMessage({
        action: "newApiModelSync:getLastExecution"
      })

      if (response.success) {
        setLastExecution(response.data)
      }
    } catch (error) {
      console.error("Failed to load last execution:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadProgress = useCallback(async () => {
    try {
      const response = await browser.runtime.sendMessage({
        action: "newApiModelSync:getProgress"
      })

      if (response.success) {
        setProgress(response.data)
      }
    } catch (error) {
      console.error("Failed to load progress:", error)
    }
  }, [])

  useEffect(() => {
    void loadLastExecution()
    void loadProgress()

    // Listen for progress updates
    const handleMessage = (message: any) => {
      if (message.type === "NEW_API_MODEL_SYNC_PROGRESS") {
        setProgress(message.payload)

        // If sync completed, reload execution results
        if (!message.payload?.isRunning) {
          void loadLastExecution()
        }
      }
    }

    browser.runtime.onMessage.addListener(handleMessage)
    return () => {
      browser.runtime.onMessage.removeListener(handleMessage)
    }
  }, [loadLastExecution, loadProgress])

  const handleRunAll = async () => {
    try {
      const response = await browser.runtime.sendMessage({
        action: "newApiModelSync:triggerAll"
      })

      if (response.success) {
        toast.success(
          t("messages.success.syncCompleted", {
            success: response.data.statistics.successCount,
            total: response.data.statistics.total
          })
        )
        setLastExecution(response.data)
      } else {
        toast.error(t("messages.error.syncFailed", { error: response.error }))
      }
    } catch (error: any) {
      toast.error(t("messages.error.syncFailed", { error: error.message }))
    }
  }

  const handleRunSelected = async () => {
    if (selectedIds.size === 0) {
      toast.error(t("messages.error.noSelection"))
      return
    }

    try {
      const response = await browser.runtime.sendMessage({
        action: "newApiModelSync:triggerSelected",
        channelIds: Array.from(selectedIds)
      })

      if (response.success) {
        toast.success(
          t("messages.success.syncCompleted", {
            success: response.data.statistics.successCount,
            total: response.data.statistics.total
          })
        )
        setLastExecution(response.data)
        setSelectedIds(new Set())
      } else {
        toast.error(t("messages.error.syncFailed", { error: response.error }))
      }
    } catch (error: any) {
      toast.error(t("messages.error.syncFailed", { error: error.message }))
    }
  }

  const handleRetryFailed = async () => {
    try {
      const response = await browser.runtime.sendMessage({
        action: "newApiModelSync:triggerFailedOnly"
      })

      if (response.success) {
        toast.success(
          t("messages.success.syncCompleted", {
            success: response.data.statistics.successCount,
            total: response.data.statistics.total
          })
        )
        setLastExecution(response.data)
      } else {
        toast.error(t("messages.error.syncFailed", { error: response.error }))
      }
    } catch (error: any) {
      toast.error(t("messages.error.syncFailed", { error: error.message }))
    }
  }

  const handleRefresh = () => {
    void loadLastExecution()
    void loadProgress()
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked && lastExecution) {
      setSelectedIds(new Set(lastExecution.items.map((item) => item.channelId)))
    } else {
      setSelectedIds(new Set())
    }
  }

  const handleSelectItem = (channelId: number, checked: boolean) => {
    const newSelected = new Set(selectedIds)
    if (checked) {
      newSelected.add(channelId)
    } else {
      newSelected.delete(channelId)
    }
    setSelectedIds(newSelected)
  }

  // Filter and search
  const filteredItems = lastExecution?.items.filter((item) => {
    // Filter by status
    if (filterStatus === "success" && !item.ok) return false
    if (filterStatus === "failed" && item.ok) return false

    // Search by keyword
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase()
      return (
        item.channelName.toLowerCase().includes(keyword) ||
        item.channelId.toString().includes(keyword) ||
        item.message?.toLowerCase().includes(keyword)
      )
    }

    return true
  })

  const stats = lastExecution?.statistics

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-6 animate-pulse space-y-4">
          <div className="h-8 w-1/3 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-24 rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Heading3 className="mb-2">{t("execution.title")}</Heading3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t("description")}
        </p>
      </div>

      {/* Progress indicator */}
      {progress?.isRunning && (
        <Card className="mb-6 border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
          <div className="flex items-center gap-3">
            <ArrowPathIcon className="h-5 w-5 animate-spin text-blue-600 dark:text-blue-400" />
            <div className="flex-1">
              <p className="font-medium text-blue-900 dark:text-blue-100">
                {t("execution.status.running")}
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {t("execution.progress.running", {
                  completed: progress.completed,
                  total: progress.total
                })}
                {progress.currentChannel && ` - ${progress.currentChannel}`}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Statistics */}
      {stats && (
        <Card className="mb-6">
          <h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            {t("execution.lastExecution")}
          </h4>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("execution.statistics.total")}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.total}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("execution.statistics.success")}
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.successCount}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("execution.statistics.failed")}
              </p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {stats.failureCount}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("execution.statistics.duration")}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {(stats.durationMs / 1000).toFixed(1)}s
              </p>
            </div>
          </div>
          <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
            <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
              <div>
                <span className="text-gray-600 dark:text-gray-400">
                  {t("execution.statistics.startTime")}:{" "}
                </span>
                <span className="text-gray-900 dark:text-white">
                  {formatFullTime(new Date(stats.startedAt))}
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">
                  {t("execution.statistics.endTime")}:{" "}
                </span>
                <span className="text-gray-900 dark:text-white">
                  {formatFullTime(new Date(stats.endedAt))}
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Actions */}
      <div className="mb-6 flex flex-wrap gap-3">
        <Button
          onClick={handleRunAll}
          variant="default"
          disabled={progress?.isRunning}>
          <ArrowPathIcon className="mr-2 h-4 w-4" />
          {t("execution.actions.runAll")}
        </Button>
        <Button
          onClick={handleRunSelected}
          variant="secondary"
          disabled={progress?.isRunning || selectedIds.size === 0}>
          {t("execution.actions.runSelected")} ({selectedIds.size})
        </Button>
        <Button
          onClick={handleRetryFailed}
          variant="outline"
          disabled={progress?.isRunning || !stats || stats.failureCount === 0}>
          {t("execution.actions.retryFailed")}
        </Button>
        <Button
          onClick={handleRefresh}
          variant="ghost"
          disabled={progress?.isRunning}>
          <ArrowPathIcon className="mr-2 h-4 w-4" />
          {t("execution.actions.refresh")}
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="flex gap-2">
          <button
            onClick={() => setFilterStatus("all")}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              filterStatus === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}>
            {t("execution.filters.all")}
          </button>
          <button
            onClick={() => setFilterStatus("success")}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              filterStatus === "success"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}>
            {t("execution.filters.success")}
          </button>
          <button
            onClick={() => setFilterStatus("failed")}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              filterStatus === "failed"
                ? "bg-red-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}>
            {t("execution.filters.failed")}
          </button>
        </div>

        <div className="relative flex-1 md:max-w-xs">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder={t("execution.filters.searchPlaceholder")}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            leftIcon={<MagnifyingGlassIcon className="h-4 w-4" />}
            className="pl-9"
          />
        </div>
      </div>

      {/* Results Table */}
      {!lastExecution || lastExecution.items.length === 0 ? (
        <EmptyState
          title={t("execution.empty.noData")}
          description={t("execution.empty.noDataDesc")}
          icon={<ArrowPathIcon className="h-12 w-12" />}
        />
      ) : filteredItems && filteredItems.length === 0 ? (
        <EmptyState
          title={t("execution.empty.noResults")}
          description={t("execution.empty.noResultsDesc")}
          icon={<MagnifyingGlassIcon className="h-12 w-12" />}
        />
      ) : (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectedIds.size === lastExecution.items.length &&
                        lastExecution.items.length > 0
                      }
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("execution.table.status")}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("execution.table.channelId")}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("execution.table.channelName")}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("execution.table.message")}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("execution.table.attempts")}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("execution.table.finishedAt")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredItems?.map((item) => (
                  <tr
                    key={item.channelId}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(item.channelId)}
                        onChange={(e) =>
                          handleSelectItem(item.channelId, e.target.checked)
                        }
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      {item.ok ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <ExclamationCircleIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {item.channelId}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {item.channelName}
                    </td>
                    <td className="px-4 py-3">
                      {item.ok ? (
                        <Badge variant="success">
                          {t("execution.status.success")}
                        </Badge>
                      ) : (
                        <div>
                          <Badge variant="destructive">
                            {t("execution.status.failed")}
                          </Badge>
                          {item.message && (
                            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                              {item.message}
                            </p>
                          )}
                          {item.httpStatus && (
                            <p className="mt-1 text-xs text-gray-500">
                              HTTP: {item.httpStatus}
                            </p>
                          )}
                          {item.businessCode && (
                            <p className="mt-1 text-xs text-gray-500">
                              Code: {item.businessCode}
                            </p>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {item.attempts}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {dayjs(item.finishedAt).format("HH:mm:ss")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
