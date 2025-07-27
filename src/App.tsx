import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { Outlet } from "react-router";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { matricesAtom } from "@/store/matrices";
import { mockMatrices } from "@/store/mock-data";
import "./App.css";

function App() {
  const setMatrices = useSetAtom(matricesAtom);

  // Initialize with mock data on app start
  useEffect(() => {
    setMatrices(mockMatrices);
  }, [setMatrices]);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />

        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="ml-auto">
              <h1 className="text-lg font-semibold">Decision Matrix Tool</h1>
            </div>
          </header>

          <main className="flex-1 p-4">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export default App;
