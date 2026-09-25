import { About } from '../components/sections/About'
import { Contact } from '../components/sections/Contact'
import { Faq } from '../components/sections/Faq'
import { FinalCta } from '../components/sections/FinalCta'
import { Hero } from '../components/sections/Hero'
import { Needs } from '../components/sections/Needs'
import { Process } from '../components/sections/Process'
import { Services, Technology } from '../components/sections/Services'
import { Testimonials } from '../components/sections/Testimonials'

export function HomePage() {
  return (
    <>
      <Hero />
      <Needs />
      <Services />
      <Process />
      <Technology />
      <About />
      <Testimonials />
      <Faq />
      <FinalCta />
      <Contact />
    </>
  )
}
