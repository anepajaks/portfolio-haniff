export type Project = {
  id: 'network' | 'coffee';
  title: string;
  category: string;
  description: string;
  status: string;
  href?: string;
};

// Coffee Lab has a standalone route so 3D assets are loaded only when opened.
export const projects: Project[] = [
  {
    id: 'network',
    title: 'Network Lab',
    category: 'TECHNOLOGY & LEARNING',
    description: 'An interactive space to explore networks, troubleshoot problems and learn by doing.',
    status: 'In development',
  },
  {
    id: 'coffee',
    title: 'Coffee Lab',
    category: 'COFFEE & CURIOSITY',
    description: 'Step into a miniature neighbourhood, explore the café and take your place behind the bar.',
    status: 'Exploration preview',
    href: '/coffee-lab/',
  },
];
