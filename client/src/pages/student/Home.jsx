import CallToAction from "../../components/student/CallToAction";
import Companies from "../../components/student/Companies";
import CoursesSection from "../../components/student/CoursesSection";
import Footer from "../../components/student/Footer";
import Hero from "../../components/student/Hero";
import TestimonialSection from "../../components/student/TestimonialSection";

const Home = () => {
  return (
    <div className=" flex flex-col items-center space-y-7 text-center ">
      <Hero />
      <Companies />
      <CoursesSection />
      <TestimonialSection />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Home;
