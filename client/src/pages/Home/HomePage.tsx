import { useState, useEffect } from "react";
import Header from "@/components/Header";
import LandingPage from "./LandingPage"; // adjust path if needed
import AboutAndProgramsSection from "./AboutPrograms";
import OurImpact from "./OurImpact";
import ApiService, { Program, Project, Event, Campaign } from "../../services/apiService";

import ScrollToTopButton from "./scrollToTopButton";
// import TestimonialsSection from "./TestimonialsSection";

import NewsSection from "./NewsSection";
import ProgramsView from "./ProgramsView";
import Footer from "./Footer";
import VolunteerSection from "./VolunteerSection";
import ProjectCardsWithFilter from "./ProjectsView";
import EventsView from "./EventsView";
import CampaignsView from "./CampaignsView";
import Contribute from "./Contribute";
import Contact from "./Contact";

const HomePage = () => {
  const [activeSection, setActiveSection] = useState<string>("home");
  const [programs, setPrograms] = useState<Program[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);

  // Data fetching effect
  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);
        setDataError(null);
        
        const [programsRes, projectsRes, eventsRes, campaignsRes] = await Promise.all([
          ApiService.getPrograms(),
          ApiService.getProjects(),
          ApiService.getEvents(),
          ApiService.getCampaigns()
        ]);
        
        setPrograms(programsRes || []);
        setProjects(projectsRes || []);
        setEvents(eventsRes || []);
        setCampaigns(campaignsRes || []);
      } catch {
        setDataError('Failed to load data. Please try again later.');
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const section = window.location.hash?.replace("#", "") || "home";
      setActiveSection(section);
      // Don't force scroll to top - let natural anchor navigation work
    };

    // Initial check
    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const isProgramsProjectPage = activeSection === "programs" || activeSection === "projects" || activeSection === "events" || activeSection === "campaigns"
  const isContribute = activeSection === "contribute"
  const isContact = activeSection === "contactUs"
  const showHeroSection = !isContribute && !isContact; // Don't show hero for contribute and contact pages
  
  return (
    <div className="bg-white">
      {/* Header - Now separate from carousel */}
      <Header />
      
      {/* Hero Section / Carousel - Hidden for Contribute and Contact pages */}
      {showHeroSection && (
        <div id="home">
          <LandingPage showOnlyHeaderImage={isProgramsProjectPage} activeSectionIs={activeSection} />
        </div>
      )}

      {/* Conditional rendering based on active section */}
      <div className={isContribute ? 'block' : 'hidden'}>
        <div id="contribute">
          <Contribute />
        </div>
      </div>

      {isContact && (
        <div id="contactUs">
          <Contact />
        </div>
      )}

      <div className={(!isProgramsProjectPage && !isContribute && !isContact) ? 'block' : 'hidden'}>
        <>
          {/* <div>
            <ProgramsSection />
          </div> */}

          <div>
            <AboutAndProgramsSection 
              programs={programs} 
              projects={projects} 
              events={events}
              loading={dataLoading} 
              error={dataError} 
            />
          </div>
          <div id="volunteer">
            <VolunteerSection />
          </div>
          <div>
            <OurImpact />
          </div>
          {/* <div>
            <TestimonialsSection />
          </div>   */}
          {/* <div>
            <PartnersSection />
          </div> */}
          <div id="news">
            <NewsSection />
          </div>
        </>
      </div>

      <div className={activeSection === "programs" ? 'block' : 'hidden'}>
        <ProgramsView 
          programs={programs} 
          loading={dataLoading} 
          error={dataError} 
        />
      </div>

      <div className={activeSection === "projects" ? 'block' : 'hidden'}>
        <ProjectCardsWithFilter 
          projects={projects} 
          loading={dataLoading} 
          error={dataError} 
        />
      </div>

      <div className={activeSection === "events" ? 'block' : 'hidden'}>
        <EventsView 
          events={events} 
          loading={dataLoading} 
          error={dataError} 
        />
      </div>

      <div className={activeSection === "campaigns" ? 'block' : 'hidden'}>
        <CampaignsView 
          campaigns={campaigns} 
          loading={dataLoading} 
          error={dataError} 
        />
      </div>



      <ScrollToTopButton />

      <div /> {/* Spacer for footer */}
      <Footer />
    </div>

  );
};

export default HomePage;