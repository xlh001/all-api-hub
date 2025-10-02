import { useEffect } from "react"
import { useAccountData } from "~/hooks/useAccountData"
import { getAllProviders } from "~/utils/modelProviders"
import { useModelListState } from "./ModelList/hooks/useModelListState"
import { useModelData } from "./ModelList/hooks/useModelData"
import { useFilteredModels } from "./ModelList/hooks/useFilteredModels"
import { Header } from "./ModelList/components/Header"
import { AccountSelector } from "./ModelList/components/AccountSelector"
import { StatusIndicator } from "./ModelList/components/StatusIndicator"
import { ControlPanel } from "./ModelList/components/ControlPanel"
import { ProviderTabs } from "./ModelList/components/ProviderTabs"
import { ModelDisplay } from "./ModelList/components/ModelDisplay"
import { Footer } from "./ModelList/components/Footer"
import { Tab } from "@headlessui/react"

export default function ModelList({
  routeParams
}: {
  routeParams?: Record<string, string>
}) {
  const { displayData } = useAccountData()
  const safeDisplayData = displayData || []

  const {
    selectedAccount,
    setSelectedAccount,
    searchTerm,
    setSearchTerm,
    selectedProvider,
    setSelectedProvider,
    selectedGroup,
    setSelectedGroup,
    isLoading,
    setIsLoading,
    pricingData,
    setPricingData,
    dataFormatError,
    setDataFormatError,
    showRealPrice,
    setShowRealPrice,
    showRatioColumn,
    setShowRatioColumn,
    showEndpointTypes,
    setShowEndpointTypes
  } = useModelListState()

  const { loadPricingData } = useModelData({
    selectedAccount,
    setSelectedGroup,
    setIsLoading,
    setDataFormatError,
    setPricingData,
    pricingData,
    selectedGroup
  })

  const currentAccount = safeDisplayData.find((acc) => acc.id === selectedAccount)
  const providers = getAllProviders()

  const {
    filteredModels,
    baseFilteredModels,
    getProviderFilteredCount,
    availableGroups
  } = useFilteredModels({
    pricingData,
    currentAccount,
    selectedGroup,
    searchTerm,
    selectedProvider
  })

  useEffect(() => {
    if (routeParams?.accountId && safeDisplayData.length > 0) {
      const accountExists = safeDisplayData.some(
        (acc) => acc.id === routeParams.accountId
      )
      if (accountExists) {
        setSelectedAccount(routeParams.accountId)
      }
    }
  }, [routeParams?.accountId, safeDisplayData, setSelectedAccount])

  const handleGroupClick = (group: string) => {
    setSelectedGroup(group)
  }

  return (
    <div className="p-6">
      <Header />
      <AccountSelector
        selectedAccount={selectedAccount}
        setSelectedAccount={setSelectedAccount}
        accounts={safeDisplayData}
      />

      <StatusIndicator
        selectedAccount={selectedAccount}
        isLoading={isLoading}
        dataFormatError={dataFormatError}
        currentAccount={currentAccount}
        loadPricingData={() => loadPricingData(selectedAccount)}
      />

      {selectedAccount && !isLoading && pricingData && (
        <>
          <ControlPanel
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedGroup={selectedGroup}
            setSelectedGroup={setSelectedGroup}
            availableGroups={availableGroups}
            pricingData={pricingData}
            loadPricingData={() => loadPricingData(selectedAccount)}
            isLoading={isLoading}
            showRealPrice={showRealPrice}
            setShowRealPrice={setShowRealPrice}
            showRatioColumn={showRatioColumn}
            setShowRatioColumn={setShowRatioColumn}
            showEndpointTypes={showEndpointTypes}
            setShowEndpointTypes={setShowEndpointTypes}
            totalModels={pricingData?.data?.length || 0}
            filteredModelsCount={filteredModels.length}
          />

          <ProviderTabs
            providers={providers}
            selectedProvider={selectedProvider}
            setSelectedProvider={setSelectedProvider}
            baseFilteredModelsCount={baseFilteredModels.length}
            getProviderFilteredCount={getProviderFilteredCount}
          />

          <Tab.Panels>
            <Tab.Panel>
              <ModelDisplay
                models={filteredModels}
                currentAccount={currentAccount}
                showRealPrice={showRealPrice}
                showRatioColumn={showRatioColumn}
                showEndpointTypes={showEndpointTypes}
                selectedGroup={selectedGroup}
                handleGroupClick={handleGroupClick}
                availableGroups={availableGroups}
              />
            </Tab.Panel>
            {providers.map((provider) => (
              <Tab.Panel key={provider}>
                <ModelDisplay
                  models={filteredModels}
                  currentAccount={currentAccount}
                  showRealPrice={showRealPrice}
                  showRatioColumn={showRatioColumn}
                  showEndpointTypes={showEndpointTypes}
                  selectedGroup={selectedGroup}
                  handleGroupClick={handleGroupClick}
                  availableGroups={availableGroups}
                />
              </Tab.Panel>
            ))}
          </Tab.Panels>

          <Footer />
        </>
      )}
    </div>
  )
}