export type Project = {
  id: 'network' | 'coffee';
  title: string;
  category: string;
  description: string;
  status: string;
  href?: string;
};

// Add a local /labs/... URL only when that lab is ready for visitors.
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
    description: 'A miniature coffee shop to explore the craft, from the first bean to the final pour.',
    status: 'In development',
  },
];
