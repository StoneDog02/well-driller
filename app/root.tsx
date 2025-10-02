import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "icon", href: "/StokesDrillingLogo.png", type: "image/png" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css",
  },
];

export async function loader({ request }: LoaderFunctionArgs) {
  return json({
    googleMapsApiKey: process.env.GOOGLE_PLACES_API_KEY,
  });
}

function Navigation() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isAdminPage = location.pathname === "/admin";
  
  // Don't render navigation on admin page
  if (isAdminPage) {
    return null;
  }
  
  return (
    <>
      {/* Top Call Bar */}
      <div className={`py-1 ${
        isHomePage 
          ? "bg-white text-gray-900" 
          : "bg-gradient-to-br from-accent-600 via-accent-700 to-accent-800 text-white"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="text-sm">
              Stokes Professional Well Drilling Services
            </div>
            <a
              href="tel:+14357649462"
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200"
            >
              CALL NOW: (435) 764-9462
            </a>
          </div>
        </div>
      </div>
      
      {/* Main Navigation Header */}
      <nav 
        className={`transition-all duration-300 sticky top-20 z-50 ${
          isHomePage 
            ? "bg-transparent" 
            : "bg-white shadow-lg border-b border-gray-200"
        }`} 
        id="main-nav"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-24">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <a
                  href="/"
                  className="hover:opacity-80 transition-opacity duration-200"
                >
                  <img 
                    src="/StokesDrillingLogo.png" 
                    alt="Stokes Water Well Drilling" 
                    className="h-20 w-auto"
                  />
                </a>
              </div>
              {/* Hidden Admin Button - Separate element, only visible on hover */}
              <div className="ml-2 opacity-0 hover:opacity-100 transition-opacity duration-200">
                <a
                  href="/admin"
                  className="bg-gray-800 hover:bg-gray-900 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-lg"
                  title="Admin Panel"
                >
                  ⚙️
                </a>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8" id="nav-links">
              <a
                href="/"
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  isHomePage 
                    ? "text-white hover:text-gray-200" 
                    : "text-gray-700 hover:text-primary-600"
                }`}
              >
                HOME
              </a>
              <a
                href="/services"
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  isHomePage 
                    ? "text-white hover:text-gray-200" 
                    : "text-gray-700 hover:text-primary-600"
                }`}
              >
                SERVICES
              </a>
              <a
                href="/about"
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  isHomePage 
                    ? "text-white hover:text-gray-200" 
                    : "text-gray-700 hover:text-primary-600"
                }`}
              >
                ABOUT US
              </a>
              <a
                href="/general-info"
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  isHomePage 
                    ? "text-white hover:text-gray-200" 
                    : "text-gray-700 hover:text-primary-600"
                }`}
              >
                GENERAL INFO
              </a>
              <a
                href="/contact"
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  isHomePage 
                    ? "text-white hover:text-gray-200" 
                    : "text-gray-700 hover:text-primary-600"
                }`}
              >
                CONTACT US
              </a>
              <a
                href="/request"
                className="ml-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                REQUEST QUOTE
              </a>
            </div>
            {/* Mobile menu button */}
            <div className="sm:hidden flex items-center">
              <button
                type="button"
                className={`focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 p-2 rounded-md transition-colors duration-200 ${
                  isHomePage 
                    ? "text-white hover:text-gray-200" 
                    : "text-gray-700 hover:text-gray-600"
                }`}
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

function Footer() {
  const location = useLocation();
  const isAdminPage = location.pathname === "/admin";
  
  // Don't render footer on admin page
  if (isAdminPage) {
    return null;
  }
  
  return (
    <footer className="section-dark">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              <a
                href="/"
                className="hover:text-primary-400 transition-colors duration-200"
              >
                Stokes Water Well
              </a>
            </h3>
            <p className="text-gray-300">
              Professional residential well drilling services you can trust.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/services"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="/general-info"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  General Info
                </a>
              </li>
              <li>
                <a
                  href="/request"
                  className="inline-block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 shadow-md hover:shadow-lg mt-2"
                >
                  Request Quote
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Contact Info
            </h3>
            <p className="text-gray-300">
              Email: info@stokeswaterwell.com
              <br />
              Phone: (435) 764-9462
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-300">
          <p>&copy; 2024 Stokes Water Well. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { googleMapsApiKey } = useLoaderData<typeof loader>();
  
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        {googleMapsApiKey && (
          <script
            src={`https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`}
            async
            defer
          />
        )}
      </head>
      <body className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
        <ScrollRestoration />
        <Scripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Header positioning and scroll behavior
              window.addEventListener('scroll', function() {
                const nav = document.getElementById('main-nav');
                const navLinks = document.getElementById('nav-links');
                const isHomePage = window.location.pathname === '/';
                
                // Handle header positioning for all pages
                if (window.scrollY > 0) {
                  // When scrolling, use fixed positioning at top-0
                  nav.classList.remove('sticky', 'top-20');
                  nav.classList.add('fixed', 'top-0', 'left-0', 'right-0');
                } else {
                  // When at top, use sticky positioning at top-20
                  nav.classList.remove('fixed', 'top-0', 'left-0', 'right-0');
                  nav.classList.add('sticky', 'top-20');
                }
                
                // Only apply background changes on home page
                if (isHomePage) {
                  const heroSection = document.querySelector('section');
                  const heroHeight = heroSection ? heroSection.offsetHeight : 0;
                  
                  // Trigger white background at 15% of hero section
                  if (window.scrollY > heroHeight * 0.15) {
                    // White background state when scrolling past hero
                    nav.classList.add('bg-white', 'shadow-lg', 'border-b', 'border-gray-200');
                    nav.classList.remove('bg-transparent');
                    
                    // Change nav links to dark text (exclude REQUEST QUOTE button)
                    if (navLinks) {
                      const links = navLinks.querySelectorAll('a');
                      links.forEach(link => {
                        // Skip the REQUEST QUOTE button to keep it white
                        if (!link.textContent?.includes('REQUEST QUOTE')) {
                          link.classList.remove('text-white', 'hover:text-gray-200');
                          link.classList.add('text-gray-700', 'hover:text-primary-600');
                        }
                      });
                    }
                  } else {
                    // Transparent background state when over hero
                    nav.classList.remove('bg-white', 'shadow-lg', 'border-b', 'border-gray-200');
                    nav.classList.add('bg-transparent');
                    
                    // Change nav links to white text (exclude REQUEST QUOTE button)
                    if (navLinks) {
                      const links = navLinks.querySelectorAll('a');
                      links.forEach(link => {
                        // Skip the REQUEST QUOTE button to keep it white
                        if (!link.textContent?.includes('REQUEST QUOTE')) {
                          link.classList.remove('text-gray-700', 'hover:text-primary-600');
                          link.classList.add('text-white', 'hover:text-gray-200');
                        }
                      });
                    }
                  }
                }
              });
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Add CSS for water drop animations
              const style = document.createElement('style');
              style.textContent = \`
                .water-drop {
                  position: absolute;
                  width: 10px;
                  height: 10px;
                  background: rgba(255, 255, 255, 0.8);
                  border-radius: 50%;
                  z-index: 10;
                }
                
                .water-drop:before {
                  content: "";
                  position: absolute;
                  width: 0;
                  height: 0;
                  border-left: 5px solid transparent;
                  border-right: 5px solid transparent;
                  border-bottom: 12px solid rgba(255, 255, 255, 0.8);
                  top: -6px;
                  left: 50%;
                  transform: translateX(-50%);
                }
                
                .ripple {
                  position: absolute;
                  border: 2px solid rgba(255, 255, 255, 0.6);
                  border-radius: 50%;
                  animation: ripple-expand 1.5s ease-out forwards;
                  z-index: 5;
                }
                
                .ripple-small {
                  position: absolute;
                  border: 1px solid rgba(255, 255, 255, 0.8);
                  border-radius: 50%;
                  animation: ripple-expand-small 0.8s ease-out forwards;
                  z-index: 6;
                }
                
                @keyframes drop-fall {
                  0% {
                    transform: translateY(-20px);
                    opacity: 1;
                  }
                  90% {
                    opacity: 1;
                  }
                  100% {
                    transform: translateY(100vh);
                    opacity: 0;
                  }
                }
                
                @keyframes ripple-expand {
                  0% {
                    width: 4px;
                    height: 4px;
                    opacity: 1;
                  }
                  100% {
                    width: 180px;
                    height: 120px;
                    opacity: 0;
                  }
                }
                
                @keyframes ripple-expand-small {
                  0% {
                    width: 2px;
                    height: 2px;
                    opacity: 1;
                  }
                  100% {
                    width: 80px;
                    height: 50px;
                    opacity: 0;
                  }
                }
              \`;
              document.head.appendChild(style);
              
              // Dynamic water drop system
              function createWaterDrop() {
                const container = document.getElementById('water-ripples');
                if (!container) return;
                
                const rect = container.getBoundingClientRect();
                const x = Math.random() * rect.width;
                const y = -20; // Start above the container
                
                // Random fall distance between 20% and 70% of hero height
                const fallPercentage = Math.random() * 0.5 + 0.2; // 0.2 to 0.7 (20% to 70%)
                const fallDistance = rect.height * fallPercentage;
                const hitY = y + fallDistance;
                const finalY = hitY; // Final landing position (no extra distance)
                
                // Create the drop
                const drop = document.createElement('div');
                drop.className = 'water-drop';
                drop.style.left = x + 'px';
                drop.style.top = y + 'px';
                
                // Calculate animation duration based on fall distance
                const animationDuration = (fallDistance / rect.height) * 1.2; // Scale duration with distance (faster)
                
                // Animate the drop falling
                drop.animate([
                  { transform: 'translateY(0px)', opacity: 1 },
                  { transform: \`translateY(\${fallDistance}px)\`, opacity: 0 }
                ], {
                  duration: animationDuration * 1000,
                  easing: 'linear',
                  fill: 'forwards'
                });
                
                container.appendChild(drop);
                
                // Create ripples immediately when drop hits
                setTimeout(() => {
                  // Create small ripple (faster, smaller)
                  const rippleSmall = document.createElement('div');
                  rippleSmall.className = 'ripple-small';
                  rippleSmall.style.left = x + 'px';
                  rippleSmall.style.top = finalY + 'px';
                  rippleSmall.style.transform = 'translate(-50%, -50%)';
                  
                  // Create large ripple (slower, larger)
                  const ripple = document.createElement('div');
                  ripple.className = 'ripple';
                  ripple.style.left = x + 'px';
                  ripple.style.top = finalY + 'px';
                  ripple.style.transform = 'translate(-50%, -50%)';
                  
                  container.appendChild(rippleSmall);
                  container.appendChild(ripple);
                  
                  // Clean up elements
                  setTimeout(() => {
                    if (drop.parentNode) drop.parentNode.removeChild(drop);
                    if (rippleSmall.parentNode) rippleSmall.parentNode.removeChild(rippleSmall);
                    if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
                  }, 2000);
                }, animationDuration * 1000 - 50); // 50ms before drop finishes for immediate ripple
              }
              
              // Create drops at random intervals
              function startRain() {
                function scheduleNextDrop() {
                  const randomDelay = Math.random() * 800 + 100; // Random interval between 100-900ms (much faster)
                  setTimeout(() => {
                    createWaterDrop();
                    scheduleNextDrop(); // Schedule the next drop
                  }, randomDelay);
                }
                scheduleNextDrop(); // Start the cycle
              }
              
              // Start the rain when page loads
              document.addEventListener('DOMContentLoaded', startRain);
              
              // Also create drops on click
              document.addEventListener('click', (e) => {
                const container = document.getElementById('water-ripples');
                if (container) {
                  const rect = container.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = -20;
                  
                  // Random fall distance between 20% and 70% of hero height
                  const fallPercentage = Math.random() * 0.5 + 0.2; // 0.2 to 0.7 (20% to 70%)
                  const fallDistance = rect.height * fallPercentage;
                  const hitY = y + fallDistance;
                  const finalY = hitY; // Final landing position (no extra distance)
                  
                  const drop = document.createElement('div');
                  drop.className = 'water-drop';
                  drop.style.left = x + 'px';
                  drop.style.top = y + 'px';
                  
                  // Calculate animation duration based on fall distance
                  const animationDuration = (fallDistance / rect.height) * 1.2; // Scale duration with distance (faster)
                  
                  // Animate the drop falling
                  drop.animate([
                    { transform: 'translateY(0px)', opacity: 1 },
                    { transform: \`translateY(\${fallDistance}px)\`, opacity: 0 }
                  ], {
                    duration: animationDuration * 1000,
                    easing: 'linear',
                    fill: 'forwards'
                  });
                  
                  container.appendChild(drop);
                  
                  setTimeout(() => {
                    // Create small ripple (faster, smaller)
                    const rippleSmall = document.createElement('div');
                    rippleSmall.className = 'ripple-small';
                    rippleSmall.style.left = x + 'px';
                    rippleSmall.style.top = finalY + 'px';
                    rippleSmall.style.transform = 'translate(-50%, -50%)';
                    
                    // Create large ripple (slower, larger)
                    const ripple = document.createElement('div');
                    ripple.className = 'ripple';
                    ripple.style.left = x + 'px';
                    ripple.style.top = finalY + 'px';
                    ripple.style.transform = 'translate(-50%, -50%)';
                    
                    container.appendChild(rippleSmall);
                    container.appendChild(ripple);
                    
                    setTimeout(() => {
                      if (drop.parentNode) drop.parentNode.removeChild(drop);
                      if (rippleSmall.parentNode) rippleSmall.parentNode.removeChild(rippleSmall);
                      if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
                    }, 2000);
                  }, animationDuration * 1000 - 50); // 50ms before drop finishes for immediate ripple
                }
              });
            `,
          }}
        />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
