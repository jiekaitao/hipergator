import { Nav } from "./chrome/Nav";
import { ParticleHero } from "./hero/ParticleHero";
import { Eligibility } from "./sections/Eligibility";
import { TheDeal } from "./sections/TheDeal";
import { GlobeSection } from "./sections/GlobeSection";
// import { Stats } from "./sections/Stats"; // hidden — numbers TBD
// import { ApplyForm } from "./sections/ApplyForm"; // hidden — pitch demo only
// import { FAQ } from "./sections/FAQ"; // hidden — content TBD
import { Footer } from "./chrome/Footer";

export default function Page() {
  return (
    <>
      <Nav />
      <ParticleHero />
      <main className="relative z-10">
        <Eligibility />
        <TheDeal />
        <GlobeSection />
        {/* <Stats /> */}
        {/* <ApplyForm /> */}
        {/* <FAQ /> */}
      </main>
      <Footer />
    </>
  );
}
