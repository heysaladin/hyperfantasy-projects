export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  image?: string;
  content: string;
  rating: number;
  date: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "Project Manager",
    company: "Tech Innovations Inc",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    content:
      "Exceptional work and attention to detail. The team delivered exactly what we needed on time and within budget.",
    rating: 5,
    date: "2025-12-15",
  },
  {
    id: "2",
    name: "Michael Chen",
    role: "CEO",
    company: "Digital Solutions Co",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    content:
      "Professional, reliable, and innovative. Our project was transformed beyond our initial expectations.",
    rating: 5,
    date: "2025-11-20",
  },
  {
    id: "3",
    name: "Emma Davis",
    role: "Design Lead",
    company: "Creative Studio",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
    content:
      "Great collaboration and communication throughout the project. Highly recommended for any challenging endeavor.",
    rating: 5,
    date: "2025-10-10",
  },
  {
    id: "4",
    name: "James Wilson",
    role: "Product Owner",
    company: "StartUp Ventures",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    content:
      "Delivered high-quality results with excellent documentation. Made the handoff process seamless.",
    rating: 4,
    date: "2025-09-05",
  },
  {
    id: "5",
    name: "Lisa Anderson",
    role: "Operations Director",
    company: "Global Enterprises",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    content:
      "Outstanding technical expertise combined with great customer service. Would work together again.",
    rating: 5,
    date: "2025-08-22",
  },
  {
    id: "6",
    name: "Lisa Anderson",
    role: "Operations Director",
    company: "Global Enterprises",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    content:
      "Outstanding technical expertise combined with great customer service. Would work together again.",
    rating: 5,
    date: "2025-08-22",
  },
];
