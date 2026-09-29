import { useEffect, useState } from 'react';
import { navigation } from '../data/catalog';
import type { Route } from '../types';

function readRoute(): Route {
  const route = location.hash.replace('#/', '').split('?')[0];
  return navigation.some((n) => n.id === route) ? (route as Route) : 'home';
}
export function useRoute() {
  const [route, setRoute] = useState<Route>(readRoute);
  useEffect(() => {
    const handle = () => setRoute(readRoute());
    window.addEventListener('hashchange', handle);
    return () => window.removeEventListener('hashchange', handle);
  }, []);
  return {
    route,
    navigate: (next: Route) => {
      location.hash = `/${next}`;
    },
  };
}
