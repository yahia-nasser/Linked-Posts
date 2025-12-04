import Providers from "@/Providers";
import NavBar from "../_components/NavBar/NavBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Providers>
        <div>
          <NavBar />
        </div>
        {children}
      </Providers>
    </>
  );
}
