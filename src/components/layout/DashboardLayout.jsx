import { Header } from './Header'
import { Sidebar } from './Sidebar'

export function DashboardLayout({ children, navigate }) {
  return (
    <div className="app-shell">
      <Sidebar navigate={navigate} />
      <div className="app-main">
        <Header navigate={navigate} />
        <main className="page-content">{children}</main>
      </div>
    </div>
  )
}
