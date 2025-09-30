import { useState, useEffect } from 'react'
import { fetchAvailableModels, fetchUserGroups, type GroupInfo } from '../services/apiService'
import toast from 'react-hot-toast'
import type { FormData } from './useTokenForm'

interface Account {
  id: string
  name: string
  baseUrl: string
  userId: number
  token: string
}

export function useTokenData(isOpen: boolean, currentAccount: Account | undefined, setFormData: React.Dispatch<React.SetStateAction<FormData>>) {
  const [isLoading, setIsLoading] = useState(false)
  const [availableModels, setAvailableModels] = useState<string[]>([])
  const [groups, setGroups] = useState<Record<string, GroupInfo>>({})

  useEffect(() => {
    if (isOpen && currentAccount) {
      loadInitialData()
    }
  }, [isOpen, currentAccount])

  const loadInitialData = async () => {
    if (!currentAccount) return
    
    setIsLoading(true)
    try {
      const [models, groupsData] = await Promise.all([
        fetchAvailableModels(currentAccount.baseUrl, currentAccount.userId, currentAccount.token),
        fetchUserGroups(currentAccount.baseUrl, currentAccount.userId, currentAccount.token)
      ])
      
      setAvailableModels(models)
      setGroups(groupsData)
      
      // Set default group
      if (groupsData.default) {
        setFormData(prev => ({ ...prev, group: 'default' }))
      } else {
        const firstGroup = Object.keys(groupsData)[0]
        if (firstGroup) {
          setFormData(prev => ({ ...prev, group: firstGroup }))
        }
      }
    } catch (error) {
      console.error('Failed to load initial data:', error)
      toast.error('加载数据失败，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  const resetData = () => {
    setAvailableModels([])
    setGroups({})
  }

  return { isLoading, availableModels, groups, resetData }
}