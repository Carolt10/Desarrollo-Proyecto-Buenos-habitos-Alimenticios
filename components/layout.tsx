"use client"

import type React from "react"

import { useState } from "react"
import Sidebar from "./sidebar"
import Header from "./header"
import Footer from "./footer"

export default function Layout({
  children,
  currentPage,
  onPageChange,
}: {
  children: React.ReactNode
  currentPage: string
  onPageChange: (page: string) => void
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? "w-32" : "w-0"} transition-all duration-300 overflow-hidden`}>
        <Sidebar currentPage={currentPage} onPageChange={onPageChange} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-background to-orange-50">
          <main className="max-w-7xl mx-auto p-6">{children}</main>
          <Footer />
        </div>
      </div>
    </div>
  )
}
