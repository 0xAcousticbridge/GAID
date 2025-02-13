import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export function BreadcrumbNav() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      <Link
        to="/"
        className="flex items-center hover:text-yellow-600 transition-colors"
      >
        <Home className="h-4 w-4 mr-1" />
        Home
      </Link>
      {pathSegments.map((segment, index) => (
        <React.Fragment key={segment}>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <Link
            to={`/${pathSegments.slice(0, index + 1).join('/')}`}
            className="hover:text-yellow-600 transition-colors capitalize"
          >
            {segment.replace(/-/g, ' ')}
          </Link>
        </React.Fragment>
      ))}
    </nav>
  );
}