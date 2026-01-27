import { Router } from '@solidjs/router';
import { FileRoutes } from '@solidjs/start/router';
import { Suspense } from 'solid-js';
import Nav from '~/components/Nav';
import SideNav from '~/components/SideNav';
import Bills from '~/components/Bills';
import Transition from '~/components/Transactions';

import './app.css';

export default function App() {
 return (
  <Router
   root={(props) => (
    <>
     <Nav />
     <Bills />
     <Transition />
     {/* <SideNav /> */}
     <Suspense>{props.children}</Suspense>
    </>
   )}>
   <FileRoutes />
  </Router>
 );
}
