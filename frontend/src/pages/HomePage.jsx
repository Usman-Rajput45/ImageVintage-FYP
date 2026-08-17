import Navbar from "../components/Navbar";
import UploadZone from "../components/UploadZone";
import Footer from "../components/Footer";
import FeatureCard from "../components/visiontag/FeatureCard";

const FEATURES = [
  {
    icon: "speed",
    title: "Real-time Processing",
    description: "Results delivered in under 500ms for standard images.",
  },
  {
    icon: "psychology",
    title: "99% Accuracy",
    description: "Trained on billions of images for unparalleled precision.",
  },
  {
    icon: "api",
    title: "Developer Friendly",
    description: "Easy integration via our REST API and SDKs.",
  },
];

const HomePage = () => (
  <div className="flex min-h-screen flex-col bg-vt-surface-container-lowest font-sans text-vt-body-md text-vt-on-surface">
    <Navbar />

    <main className="mx-auto flex w-full max-w-vt-container flex-grow flex-col items-center px-vt-gutter pt-32 pb-vt-xl">
      <section className="mb-vt-xl text-center">
        <h1 className="mb-vt-md text-vt-headline-lg font-bold text-vt-on-background md:text-vt-headline-lg">
          Analyze any image instantly
        </h1>
        <p className="mx-auto max-w-2xl text-vt-body-lg text-vt-on-surface-variant">
          Upload your photos and let our high-precision AI identify objects,
          scenes, and complex patterns with deep metadata extraction.
        </p>
      </section>

      <UploadZone />

      <div className="mt-vt-xl grid w-full max-w-4xl grid-cols-1 gap-vt-lg md:grid-cols-3">
        {FEATURES.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </main>

    <Footer />
  </div>
);

export default HomePage;
