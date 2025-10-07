import { MenuItem, menuItems } from "~/options/constants"

interface SidebarProps {
  activeMenuItem: string
  onMenuItemClick: (itemId: string) => void
}

function Sidebar({ activeMenuItem, onMenuItemClick }: SidebarProps) {
  return (
    <aside className="w-64 flex-shrink-0">
      <nav className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            设置选项
          </h2>
        </div>
        <ul className="divide-y divide-gray-100">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeMenuItem === item.id

            return (
              <li key={item.id}>
                <button
                  onClick={() => onMenuItemClick(item.id)}
                  className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                      : "text-gray-700"
                  }`}>
                  <Icon
                    className={`w-5 h-5 mr-3 ${
                      isActive ? "text-blue-600" : "text-gray-400"
                    }`}
                  />
                  <span className="font-medium">{item.name}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
