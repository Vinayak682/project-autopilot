import Hero from '@/components/Hero'
import CapabilityMeter from '@/components/CapabilityMeter'
import DisruptionReplay from '@/components/DisruptionReplay'
import ProjectsSection from '@/components/ProjectsSection'
import AgentDecisionFeed from '@/components/AgentDecisionFeed'
import DataFlowSection from '@/components/DataFlowSection'
import NetworkTopologySection from '@/components/NetworkTopologySection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="relative bg-off-black">
      <Hero />
      <CapabilityMeter />
      <DisruptionReplay />
      <ProjectsSection />
      <AgentDecisionFeed />
      <DataFlowSection />
      <NetworkTopologySection />
      <Footer />
    </main>
  )
}
