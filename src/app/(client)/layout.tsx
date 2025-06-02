import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import { footerData } from "@/lib/dummyData";

export const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <Header />
      {children}
      <Footer {...footerData} />
    </div>
  );
};

export default ClientLayout;
