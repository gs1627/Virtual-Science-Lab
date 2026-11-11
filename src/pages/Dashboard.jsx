import HeroSection from '../components/dashboard/HeroSection';
import SubjectCards from '../components/dashboard/SubjectCards';
import FeaturedExperiments from '../components/dashboard/FeaturedExperiments';
import LabAssistant from '../components/dashboard/LabAssistant';
import ProgressOverview from '../components/dashboard/ProgressOverview';

export default function Dashboard({ searchQuery }) {
  return (
    <div className="space-y-6">
      <HeroSection />
      <SubjectCards />
      <FeaturedExperiments searchQuery={searchQuery} />
      <LabAssistant />
      <ProgressOverview />
    </div>
  );
}
