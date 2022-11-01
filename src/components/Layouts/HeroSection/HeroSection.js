import style from './Hero.module.scss';
function HeroSection() {
  return (
    <div className={`ui container ${style.hero}`}>
      <h1>Hero image</h1>
    </div>
  );
}

export default HeroSection;
