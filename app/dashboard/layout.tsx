import Sidebar from "@/Components/Sidebar";
import NavBar from "@/navBar";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                {/* h-screen overflow-hidden تجعل الصفحة ثابتة بحجم الشاشة وتمنع السكرول الخارجي المزعج */}
                <div className="bg-orange-500 flex h-screen overflow-hidden">

                    {/* المكون الثابت على الشمال */}
                    <Sidebar />

                    {/* منطقة المحتوى والـ NavBar */}
                    <div className="flex-1 flex flex-col h-screen overflow-hidden">
                        <NavBar />

                        {/* flex-1 overflow-y-auto تجعل المحتوى الداخلي فقط هو من يعمل سكرول بسلاسة */}
                        <div className="flex-1 overflow-y-auto p-2">
                            {children}
                        </div>
                    </div>

                </div>
            </body>
        </html>
    );
}