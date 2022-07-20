import Navbar from './Navbar'
import Footer from './Footer'

export default function ({children}) {
  return (
    <>
      <Navbar />
      <div className="main">{children}</div>
      <Footer />
    </>
  )
}
