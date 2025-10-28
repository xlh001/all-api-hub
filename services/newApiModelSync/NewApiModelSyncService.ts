import { ApiError } from "~/services/apiService/common/errors"
import { fetchApi } from "~/services/apiService/common/utils"
import type { ApiResponse } from "~/types"
import {
  BatchExecutionOptions,
  ExecutionItemResult,
  ExecutionResult,
  ExecutionStatistics,
  NewApiChannel,
  NewApiChannelListData
} from "~/types/newApiModelSync"

type NewApiResponse<T> = ApiResponse<T> & { code?: number }

/**
 * New API Model Sync Service
 * Handles channel operations for model synchronization
 */
export class NewApiModelSyncService {
  private baseUrl: string
  private token: string
  private userId?: string

  constructor(baseUrl: string, token: string, userId?: string) {
    this.baseUrl = baseUrl
    this.token = token
    this.userId = userId
  }

  /**
   * List all channels from New API
   */
  async listChannels(): Promise<NewApiChannelListData> {
    try {
      const response = await fetchApi<NewApiChannelListData>(
        {
          baseUrl: this.baseUrl,
          endpoint: "/api/channel/",
          userId: this.userId,
          token: this.token
        },
        false
      )

      if (!response.success) {
        throw new ApiError(
          response.message || "Failed to fetch channels",
          undefined,
          "/api/channel/"
        )
      }

      return response.data
    } catch (error) {
      console.error("[NewApiModelSync] Failed to list channels:", error)
      throw error
    }
  }

  /**
   * Fetch models for a specific channel
   */
  async fetchChannelModels(channelId: number): Promise<string[]> {
    try {
      const response = (await fetchApi<string[]>(
        {
          baseUrl: this.baseUrl,
          endpoint: `/api/channel/fetch_models/${channelId}`,
          userId: this.userId,
          token: this.token
        },
        false
      )) as NewApiResponse<string[]>

      if (!response.success || !Array.isArray(response.data)) {
        const error: any = new Error(
          response.message || "Failed to fetch models"
        )
        error.httpStatus = 200
        error.businessCode = response.code
        throw error
      }

      return response.data
    } catch (error: any) {
      // Attach HTTP status if available
      if (error instanceof ApiError) {
        const apiError: any = new Error(error.message)
        apiError.httpStatus = error.statusCode
        throw apiError
      }
      throw error
    }
  }

  /**
   * Update channel models
   * Strategy: Only update the models field, keep other fields unchanged
   */
  async updateChannelModels(
    channel: NewApiChannel,
    models: string[]
  ): Promise<void> {
    try {
      // Prepare the update payload - merge with existing channel data
      const updatePayload = {
        ...channel,
        models: models.join(",")
      }

      const response = (await fetchApi<unknown>(
        {
          baseUrl: this.baseUrl,
          endpoint: "/api/channel/",
          userId: this.userId,
          token: this.token,
          options: {
            method: "PUT",
            body: JSON.stringify(updatePayload)
          }
        },
        false
      )) as NewApiResponse<unknown>

      if (!response.success) {
        const error: any = new Error(
          response.message || "Failed to update channel"
        )
        error.httpStatus = 200
        error.businessCode = response.code
        throw error
      }
    } catch (error: any) {
      if (error instanceof ApiError) {
        const apiError: any = new Error(error.message)
        apiError.httpStatus = error.statusCode
        throw apiError
      }
      throw error
    }
  }

  /**
   * Execute sync for a single channel with retry logic
   */
  async runForChannel(
    channel: NewApiChannel,
    maxRetries: number = 2
  ): Promise<ExecutionItemResult> {
    let attempts = 0
    let lastError: any = null

    const oldModels = channel.models ? channel.models.split(",") : []

    while (attempts <= maxRetries) {
      attempts++

      try {
        // Fetch new models
        const newModels = await this.fetchChannelModels(channel.id)

        // Update channel if models changed
        if (
          JSON.stringify(oldModels.sort()) !== JSON.stringify(newModels.sort())
        ) {
          await this.updateChannelModels(channel, newModels)
        }

        // Success
        return {
          channelId: channel.id,
          channelName: channel.name,
          ok: true,
          attempts,
          finishedAt: Date.now(),
          oldModels,
          newModels,
          message: "Success"
        }
      } catch (error: any) {
        lastError = error

        // If this is not the last attempt, wait with exponential backoff
        if (attempts <= maxRetries) {
          const backoffMs = Math.pow(2, attempts - 1) * 1000
          await new Promise((resolve) => setTimeout(resolve, backoffMs))
        }
      }
    }

    // All retries failed
    return {
      channelId: channel.id,
      channelName: channel.name,
      ok: false,
      httpStatus: lastError?.httpStatus,
      businessCode: lastError?.businessCode,
      message: lastError?.message || "Unknown error",
      attempts,
      finishedAt: Date.now(),
      oldModels
    }
  }

  /**
   * Execute sync for multiple channels with concurrency control
   */
  async runBatch(
    channels: NewApiChannel[],
    options: BatchExecutionOptions
  ): Promise<ExecutionResult> {
    const { concurrency, maxRetries, onProgress } = options
    const startedAt = Date.now()
    const total = channels.length
    const results: (ExecutionItemResult | undefined)[] = new Array(total)

    let completed = 0
    let nextIndex = 0

    const worker = async () => {
      while (true) {
        const currentIndex = nextIndex
        if (currentIndex >= total) {
          return
        }
        nextIndex++

        const channel = channels[currentIndex]
        let result: ExecutionItemResult

        try {
          result = await this.runForChannel(channel, maxRetries)
        } catch (error: any) {
          console.error(
            `[NewApiModelSync] Unexpected error for channel ${channel.id}:`,
            error
          )
          result = {
            channelId: channel.id,
            channelName: channel.name,
            ok: false,
            message: error?.message || "Unexpected error",
            attempts: maxRetries + 1,
            finishedAt: Date.now()
          }
        }

        results[currentIndex] = result
        completed++

        onProgress?.({
          completed,
          total,
          lastResult: result
        })
      }
    }

    const workerCount = Math.max(1, Math.min(concurrency, total))
    const workers = Array.from({ length: workerCount }, () => worker())
    await Promise.all(workers)

    const items = results.filter((item): item is ExecutionItemResult => !!item)

    const endedAt = Date.now()
    const successCount = items.filter((item) => item.ok).length
    const failureCount = total - successCount

    const statistics: ExecutionStatistics = {
      total,
      successCount,
      failureCount,
      durationMs: endedAt - startedAt,
      startedAt,
      endedAt
    }

    return {
      items,
      statistics
    }
  }
}
