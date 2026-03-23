import '../index.css';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import BarajaDiagnostica from '../components/BarajaDiagnostica';
import TarjetasApilables from '../components/TarjetasApilables';
import ManifiestoParallax from '../components/ManifiestoParallax';
import PedidoCTA from '../components/PedidoCTA';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <BarajaDiagnostica />
        <TarjetasApilables />
        <ManifiestoParallax />
        <PedidoCTA />
      </main>
      <Footer />
    </>
  );
}
