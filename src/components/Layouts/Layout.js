import Header from './Header/Header';
import HeroSection from './HeroSection/HeroSection';

function Layout(props) {
  return (
    <div className="ui container">
      <HeroSection />
      <Header />
      <div className="ui container">{props.children}</div>
    </div>
  );
}

export default Layout;
