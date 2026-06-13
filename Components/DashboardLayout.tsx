"use client";
import React, { useState } from 'react';
import Sidebar from "@/Components/Sidebar";
import NavBar from "@/navBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="bg-zinc-950 flex h-screen overflow-hidden" dir="rtl">
            {/* Sidebar component - passing state */}
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <NavBar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
                <div className="flex-1 overflow-y-auto p-2">
                    {children}
                </div>
            </div>
        </div>
    )
}
