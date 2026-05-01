"use client"

import { useState } from "react"
import Layout from "@/frontend/shared/components/layout"
import Home from "@/frontend/modules/pages/home"
import Recipes from "@/frontend/modules/pages/recipes"
import Community from "@/frontend/modules/pages/community"
import Education from "@/frontend/modules/pages/education"
import Games from "@/frontend/modules/pages/games"
import Alerts from "@/frontend/modules/pages/alerts"

export default function Page() {
  const [currentPage, setCurrentPage] = useState("home")

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <Home />
      case "recipes":
        return <Recipes />
      case "community":
        return <Community />
      case "education":
        return <Education />
      case "games":
        return <Games />
      case "alerts":
        return <Alerts onNavigate={setCurrentPage} />
      default:
        return <Home />
    }
  }

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  )
}
