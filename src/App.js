import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Organ from './pages/Organ/Organ';
import Topic from './pages/Topic/Topic';
import GlobalStyle from './components/GlobalStyle/GlobalStyle';
import { publicRoutes, privateRoutes } from './routes/Routes';
import Layout from './components/Layouts/Layout';
function App() {
  return (
    <GlobalStyle>
      <BrowserRouter>
        <Routes>
          {publicRoutes.map((r, i) => {
            return (
              <Route
                key={i}
                path={r.path}
                element={<Layout>{r.component}</Layout>}
              />
            );
          })}
        </Routes>
      </BrowserRouter>
    </GlobalStyle>
  );
}

export default App;
