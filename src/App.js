import { Routes, Route, Link } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css'; //css lib
import Organ from './pages/Organ/Organ';
import Topic from './pages/Topic/Topic';
import GlobalStyle from './components/GlobalStyle/GlobalStyle';
import { publicRoutes, privateRoutes } from './routes/Routes';
import Layout from './components/Layouts/Layout';
function App() {
  return (
    <GlobalStyle>
      <Routes>
        {publicRoutes.map((r, i) => {
          return (
            <Route
              key={i}
              path={r.path}
              element={<Layout>{r.component}</Layout>}
            >
              {r.child
                ? r.child.map((r1, i1) => {
                    return (
                      <Route key={i1} path={r1.path} element={r1.component} />
                    );
                  })
                : null}
            </Route>
          );
        })}
      </Routes>
    </GlobalStyle>
  );
}

export default App;
