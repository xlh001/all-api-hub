import AddTokenDialog from "~/components/AddTokenDialog"

import { Controls } from "./KeyManagement/Controls"
import { Footer } from "./KeyManagement/Footer"
import { Header } from "./KeyManagement/Header"
import { TokenList } from "./KeyManagement/TokenList"
import { useKeyManagement } from "./KeyManagement/useKeyManagement"

export default function KeyManagement({
  routeParams
}: {
  routeParams?: Record<string, string>
}) {
  const {
    displayData,
    selectedAccount,
    setSelectedAccount,
    searchTerm,
    setSearchTerm,
    tokens,
    isLoading,
    visibleKeys,
    isAddTokenOpen,
    editingToken,
    loadTokens,
    filteredTokens,
    copyKey,
    toggleKeyVisibility,
    handleAddToken,
    handleCloseAddToken,
    handleEditToken,
    handleDeleteToken
  } = useKeyManagement(routeParams)

  return (
    <div className="p-6">
      <Header
        onAddToken={handleAddToken}
        onRefresh={() => selectedAccount && loadTokens()}
        isLoading={isLoading || !selectedAccount}
        isAddTokenDisabled={!selectedAccount || displayData.length === 0}
      />

      <Controls
        selectedAccount={selectedAccount}
        setSelectedAccount={setSelectedAccount}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        displayData={displayData}
        tokens={tokens}
        filteredTokens={filteredTokens}
      />

      <TokenList
        isLoading={isLoading}
        tokens={tokens}
        filteredTokens={filteredTokens}
        visibleKeys={visibleKeys}
        toggleKeyVisibility={toggleKeyVisibility}
        copyKey={copyKey}
        handleEditToken={handleEditToken}
        handleDeleteToken={handleDeleteToken}
        handleAddToken={handleAddToken}
        selectedAccount={selectedAccount}
        displayData={displayData}
      />

      <Footer />

      <AddTokenDialog
        isOpen={isAddTokenOpen}
        onClose={handleCloseAddToken}
        availableAccounts={displayData.map((account) => ({
          id: account.id,
          name: account.name,
          baseUrl: account.baseUrl,
          userId: account.userId,
          token: account.token
        }))}
        preSelectedAccountId={selectedAccount || null}
        editingToken={editingToken}
      />
    </div>
  )
}
