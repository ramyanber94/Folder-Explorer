'use client';

import Link from 'next/link';

interface BreadcrumbProps {
  currentPath: string;
  className?: string;
}

interface BreadcrumbItem {
  name: string;
  path: string;
  isLast: boolean;
}

export function Breadcrumb({ currentPath, className = "" }: BreadcrumbProps) {
  // Build breadcrumb items from the current path
  const buildBreadcrumbs = (path: string): BreadcrumbItem[] => {
    if (!path || path === '') {
      return [{
        name: 'My Files',
        path: '/',
        isLast: true
      }];
    }

    const pathSegments = path.split('/').filter(segment => segment.length > 0);
    const breadcrumbs: BreadcrumbItem[] = [];

    // Add root/home
    breadcrumbs.push({
      name: 'My Files',
      path: '/',
      isLast: false
    });

    // Add each path segment
    let buildingPath = '';
    pathSegments.forEach((segment, index) => {
      buildingPath += `/${segment}`;
      const encodedPath = encodeURIComponent(buildingPath.substring(1)); // Remove leading slash before encoding
      breadcrumbs.push({
        name: decodeURIComponent(segment),
        path: `/folder/${encodedPath}`,
        isLast: index === pathSegments.length - 1
      });
    });

    // Mark the last item
    if (breadcrumbs.length > 0) {
      breadcrumbs[breadcrumbs.length - 1].isLast = true;
    }

    return breadcrumbs;
  };

  const breadcrumbs = buildBreadcrumbs(currentPath);

  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 bg-gray-100 rounded-lg px-2 py-2 sm:px-3 overflow-x-auto">
        {breadcrumbs.map((item, index) => (
          <li key={item.path} className="inline-flex items-center whitespace-nowrap">
            {index > 0 && (
              <span className="text-gray-400 mx-1 sm:mx-2 text-sm">
                /
              </span>
            )}
            
            <div className="flex items-center">
              {index === 0 && (
                <span className="mr-1 sm:mr-2 text-gray-600">🏠</span>
              )}
              
              {item.isLast ? (
                <span className="text-sm font-medium text-gray-800 truncate max-w-[120px] sm:max-w-[200px]">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.path}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors truncate max-w-[120px] sm:max-w-[200px] hover:underline"
                >
                  {item.name}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
