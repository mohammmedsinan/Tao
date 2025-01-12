import Footer from "./ui/Footer"
import Header from "./ui/Header"

function Page({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-LiteBlue w-full min-h-[100vh]">
            <Header />
            {children}
            <Footer />
        </div>
    )
}

export default Page