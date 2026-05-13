import IssueNav from '../components/UI/IssueNav'
import CinematicCurtain from '../components/UI/CinematicCurtain'
import IssueCover from '../components/Hero/IssueCover'
import TickerBar from '../components/Sections/TickerBar'
import Manifest from '../components/Sections/Manifest'
import KnowledgeNetwork from '../components/Sections/KnowledgeNetwork'
import ArchiveIndex from '../components/Sections/ArchiveIndex'
import Folio from '../components/Sections/Folio'
import FieldNotes from '../components/Sections/FieldNotes'
import Colophon from '../components/Sections/Colophon'

/**
 * Personal Archive — Vol. 01.
 *
 * Editorial-magazine portfolio with scroll-jacked cinematic transitions
 * between chapters. Avatar walks across the viewport during transitions,
 * revealing the next chapter behind him.
 */
export default function Home() {
  return (
    <main id="top" className="relative">
      <IssueNav />
      <IssueCover />
      <TickerBar />
      <Manifest />

      <CinematicCurtain
        number="03"
        title="The Network"
        kicker="Drag any node — fizyka jest prawdziwa"
        fromBg="bg-paper"
        toBg="bg-paper"
        silhouette="ink"
      />

      <KnowledgeNetwork />
      <ArchiveIndex />
      <Folio />

      <CinematicCurtain
        number="06"
        title="Field Notes"
        kicker="Z pracowni — aktualizowane na żywo"
        fromBg="bg-paper"
        toBg="bg-bone"
        silhouette="ink"
      />

      <FieldNotes />
      <Colophon />
    </main>
  )
}
