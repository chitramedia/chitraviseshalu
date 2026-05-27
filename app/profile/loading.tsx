import ProfileSkeleton from "../components/skeletons/ProfileSkeleton";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ProfileLoading() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#111111] text-white px-4 md:px-6 pt-28 pb-16">
        <ProfileSkeleton />
      </main>
      <Footer />
    </>
  );
}
