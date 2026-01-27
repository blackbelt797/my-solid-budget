import { Router } from '@solidjs/router';
import { FileRoutes } from '@solidjs/start/router';
import { Suspense } from 'solid-js';
import Nav from '~/components/Nav';
import SideNav from '~/components/SideNav';

import Main from '~/components/Main';
import './app.css';

export default function App() {
 return (
  <Router
   root={(props) => (
    <>
     <Nav />
     {/* <SideNav /> */}
     <Main />
     <Suspense>{props.children}</Suspense>
    </>
   )}>
   <FileRoutes />
  </Router>
 );
}
