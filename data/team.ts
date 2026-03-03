export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image?: string;
  gradient: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
}

export const team: TeamMember[] = [
  {
    id: "1",
    name: "Alex Rivera",
    role: "Founder & Creative Director",
    bio: "With over a decade of experience in brand design and digital strategy, Alex founded Hyperfantasy to build a studio where craft and creativity come first.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    gradient: "from-purple-900/20 to-blue-900/20",
    social: {
      twitter: "#",
      linkedin: "#",
    },
  },
  {
    id: "2",
    name: "Jordan Kim",
    role: "Lead Designer",
    bio: "Jordan brings a sharp eye for visual systems and a deep passion for typography, shaping the aesthetic direction of every brand we touch.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    gradient: "from-orange-900/20 to-red-900/20",
    social: {
      twitter: "#",
      instagram: "#",
    },
  },
  {
    id: "3",
    name: "Sam Okafor",
    role: "Head of Engineering",
    bio: "Sam architects the technical foundations of our digital products, ensuring every build is fast, accessible, and built to last.",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
    gradient: "from-green-900/20 to-teal-900/20",
    social: {
      twitter: "#",
      linkedin: "#",
    },
  },
  {
    id: "4",
    name: "Maya Chen",
    role: "UX Strategist",
    bio: "Maya bridges the gap between research and design, turning complex user needs into clear, elegant product experiences.",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    gradient: "from-pink-900/20 to-purple-900/20",
    social: {
      linkedin: "#",
      instagram: "#",
    },
  },
  {
    id: "5",
    name: "Leo Santos",
    role: "Motion Designer",
    bio: "Leo brings interfaces to life through motion, ensuring every transition and interaction feels intentional and refined.",
    image: "https://randomuser.me/api/portraits/men/52.jpg",
    gradient: "from-yellow-900/20 to-orange-900/20",
    social: {
      twitter: "#",
      instagram: "#",
    },
  },
  {
    id: "6",
    name: "Priya Nair",
    role: "Digital Strategist",
    bio: "Priya crafts the strategic frameworks that guide our clients' digital presence, connecting creative work to measurable growth.",
    image: "https://randomuser.me/api/portraits/women/90.jpg",
    gradient: "from-blue-900/20 to-cyan-900/20",
    social: {
      linkedin: "#",
      twitter: "#",
    },
  },
];
