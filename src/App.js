import { Routes, Route, Link } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css'; //css lib
import Organ from './pages/Organ/Organ';
import Topic from './pages/Topic/Topic';
import GlobalStyle from './components/GlobalStyle/GlobalStyle';
import { publicRoutes, privateRoutes } from './routes/Routes';
import Layout from './components/Layouts/Layout';
function App() {
  const processChildRoute = (route) => {
    let childRoute;
    let childRouteIndex;
    childRoute = route.child
      ? route.child.map((childRoute, i) => {
          if (childRoute.index) childRouteIndex = i;
          return (
            <Route
              key={i}
              path={childRoute.path}
              element={childRoute.component}
            />
          );
        })
      : null;
    if (childRoute && childRouteIndex)
      childRoute.push(
        <Route
          key={route.child.length}
          index
          element={route.child[childRouteIndex].component}
        />
      );
    return childRoute;
  };
  return (
    <GlobalStyle>
      <Routes>
        {publicRoutes.map((route, index) => {
          return (
            <Route
              key={index}
              path={route.path}
              element={<Layout>{route.component}</Layout>}
            >
              {processChildRoute(route)}
            </Route>
          );
        })}
      </Routes>
    </GlobalStyle>
  );
}

export default App;
