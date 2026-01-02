import { For, JSX, Show, createSignal } from 'solid-js';
import { A, useLocation } from '@solidjs/router'; // Optional: if using Solid Router
// Remove the above import if you're not using routing

interface NavItem {
 label: string;
 href: string;
 icon?: () => JSX.Element; // Optional icon component
 children?: NavItem[]; // For sub-items (collapsible)
}

const navItems: NavItem[] = [
 {
  label: 'Dashboard',
  href: '/dashboard',
  icon: () => (
   <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
     stroke-linecap="round"
     stroke-linejoin="round"
     stroke-width="2"
     d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
   </svg>
  ),
 },
 {
  label: 'Users',
  href: '/users',
  icon: () => (
   <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
     stroke-linecap="round"
     stroke-linejoin="round"
     stroke-width="2"
     d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
    />
   </svg>
  ),
 },
 {
  label: 'Settings',
  href: '#',
  icon: () => (
   <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
     stroke-linecap="round"
     stroke-linejoin="round"
     stroke-width="2"
     d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
   </svg>
  ),
  children: [
   { label: 'Profile', href: '/settings/profile' },
   { label: 'Security', href: '/settings/security' },
   { label: 'Notifications', href: '/settings/notifications' },
  ],
 },
];

export default function SideNavigation() {
 const [openSections, setOpenSections] = createSignal<Set<string>>(new Set());
 const location = useLocation(); // Remove if not using router

 const toggleSection = (label: string) => {
  setOpenSections((prev) => {
   const next = new Set(prev);
   if (next.has(label)) {
    next.delete(label);
   } else {
    next.add(label);
   }
   return next;
  });
 };

 const isActive = (href: string) => {
  return location.pathname.startsWith(href);
 };

 return (
  <aside class="w-64 h-screen bg-gray-900 text-gray-100 fixed left-0 top-0 overflow-y-auto">
   <div class="p-6">
    <h2 class="text-2xl font-bold text-white">My App</h2>
   </div>

   <nav class="mt-6">
    <ul class="space-y-2 px-4">
     <For each={navItems}>
      {(item) => (
       <li>
        <Show
         when={item.children}
         fallback={
          // Simple link
          <A
           href={item.href}
           class={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive(item.href) ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
           }`}>
           {item.icon && <item.icon />}
           <span>{item.label}</span>
          </A>
         }>
         {/* Collapsible parent */}
         <button
          onClick={() => toggleSection(item.label)}
          class={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
           isActive(item.href!) ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          }`}>
          <div class="flex items-center gap-3">
           {item.icon && <item.icon />}
           <span>{item.label}</span>
          </div>
          <svg
           class={`w-4 h-4 transition-transform ${openSections().has(item.label) ? 'rotate-90' : ''}`}
           fill="none"
           stroke="currentColor"
           viewBox="0 0 24 24">
           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
         </button>

         {/* Submenu */}
         <Show when={openSections().has(item.label)}>
          <ul class="ml-8 mt-2 space-y-1 border-l-2 border-gray-700 pl-4">
           <For each={item.children}>
            {(subItem) => (
             <li>
              <A
               href={subItem.href}
               class={`block px-4 py-2 rounded-lg text-sm transition-colors ${
                isActive(subItem.href)
                 ? 'text-blue-400 bg-gray-800'
                 : 'text-gray-400 hover:text-white hover:bg-gray-800'
               }`}>
               {subItem.label}
              </A>
             </li>
            )}
           </For>
          </ul>
         </Show>
        </Show>
       </li>
      )}
     </For>
    </ul>
   </nav>
  </aside>
 );
}
