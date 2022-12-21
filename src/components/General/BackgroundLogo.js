import bg from 'assets/images/bg1.png';
function BackgroundLogo() {
  return (
    <div
      style={{
        backgroundColor: '#CED4DE',
        height: '100vh',
        backgroundImage: `url(${bg})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'contain',
      }}
    ></div>
  );
}

export default BackgroundLogo;
