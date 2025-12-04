import { Metadata } from "next";
import Posts from "./posts/page";

export const metadata: Metadata = {
  title: "Linked Posts | Home",
};
const Home = async () => {
  return (
    <section className="w-full md:w-[80%] bg-blue-300/50 mt-10 min-h-screen mx-auto rounded-3xl shadow-3xl p-1 md:p-5">
      <Posts />
    </section>
  );
};

export default Home;
