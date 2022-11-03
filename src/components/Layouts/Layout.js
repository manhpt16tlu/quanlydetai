import Header from './Header/Header';
import HeroSection from './HeroSection/HeroSection';
import style from './Layout.module.scss';
function Layout(props) {
  return (
    <div className="ui container">
      <HeroSection />
      <Header />
      <div className={`ui container ${style.main}`}>{props.children}</div>
    </div>
  );
}

export default Layout;
