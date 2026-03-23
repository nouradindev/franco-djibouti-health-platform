import Layout from "@/components/Layout";
import HeroSection from "@/components/HeroSection";
import StrategicVision from "@/components/StrategicVision";
import StatsSection from "@/components/StatsSection";
import VideoTestimonials from "@/components/VideoTestimonials";
import PartnersSection from "@/components/PartnersSection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <StrategicVision />
      <StatsSection />
      <VideoTestimonials />
      <PartnersSection />
    </Layout>
  );
};

export default Index;
