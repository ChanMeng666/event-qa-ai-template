export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: 'mentor' | 'judge' | 'organizer';
  organization: string;
  avatarUrl: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    quote: "The AI Hackathon Festival 2025 represents a groundbreaking opportunity for innovators to push the boundaries of what's possible with AI while addressing real-world challenges.",
    author: "Dr. Sarah Chen",
    role: "mentor",
    organization: "AUT School of Computer Science",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "2",
    quote: "Seeing participants tackle the UN Sustainable Development Goals with AI solutions gives me hope for our future. The creativity and technical skill on display is truly inspiring.",
    author: "James Mitchell",
    role: "judge",
    organization: "AI Forum New Zealand",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "3",
    quote: "This hackathon is more than a competition—it's a launchpad for the next generation of AI innovators in New Zealand and beyond.",
    author: "Emma Williams",
    role: "organizer",
    organization: "She Sharp",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "4",
    quote: "The mentorship opportunities here are unparalleled. We're not just teaching technical skills—we're nurturing future leaders in responsible AI development.",
    author: "Dr. Michael Torres",
    role: "mentor",
    organization: "Microsoft Research NZ",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "5",
    quote: "What sets this hackathon apart is the focus on ethical AI and sustainable solutions. Participants don't just build—they think deeply about impact.",
    author: "Lisa Park",
    role: "judge",
    organization: "Tech Futures Lab",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "6",
    quote: "The energy and innovation at this event is incredible. Every year, I'm amazed by the fresh perspectives participants bring to complex problems.",
    author: "David Chen",
    role: "mentor",
    organization: "Google Cloud NZ",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "7",
    quote: "As an organizer, watching teams go from an idea to a working prototype in just 48 hours never gets old. The spirit of collaboration here is infectious.",
    author: "Rachel Thompson",
    role: "organizer",
    organization: "AUT Ventures",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "8",
    quote: "The quality of AI solutions addressing climate change and sustainability has been exceptional. These young innovators are solving problems that matter.",
    author: "Professor Alan Wright",
    role: "judge",
    organization: "Auckland AI Institute",
    avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "9",
    quote: "This hackathon has become a cornerstone event for New Zealand's AI community. It's where talent meets opportunity and ideas become reality.",
    author: "Sophie Anderson",
    role: "mentor",
    organization: "AWS New Zealand",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "10",
    quote: "Every participant leaves with more than just new skills—they leave with connections, confidence, and a clearer vision for their future in tech.",
    author: "Marcus Lee",
    role: "organizer",
    organization: "AI Forum New Zealand",
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "11",
    quote: "The diversity of participants—from students to industry professionals—creates an incredible learning environment for everyone involved.",
    author: "Dr. Priya Sharma",
    role: "mentor",
    organization: "University of Auckland",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "12",
    quote: "Judging this hackathon is both challenging and rewarding. The level of innovation continues to exceed our expectations year after year.",
    author: "Thomas Nguyen",
    role: "judge",
    organization: "Callaghan Innovation",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "13",
    quote: "She Sharp is proud to support events that bring diverse voices into AI development. Representation matters in building technology for everyone.",
    author: "Nina Roberts",
    role: "organizer",
    organization: "She Sharp",
    avatarUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "14",
    quote: "The practical application of AI to UN SDGs shows that technology can be a powerful force for good. These teams understand that responsibility.",
    author: "Dr. Robert Kim",
    role: "judge",
    organization: "Ministry of Business Innovation & Employment",
    avatarUrl: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "15",
    quote: "Mentoring at this hackathon reminds me why I got into tech. The enthusiasm and creativity of these participants is truly energizing.",
    author: "Jennifer Walsh",
    role: "mentor",
    organization: "Datacom",
    avatarUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face"
  }
];

export const getRoleDisplayName = (role: Testimonial['role']): string => {
  const roleNames: Record<Testimonial['role'], string> = {
    mentor: 'Mentor',
    judge: 'Judge',
    organizer: 'Organizer',
  };
  return roleNames[role];
};

export const getRoleBadgeColor = (role: Testimonial['role']): string => {
  const roleColors: Record<Testimonial['role'], string> = {
    mentor: 'bg-blue-50 text-blue-600',
    judge: 'bg-purple-50 text-purple-600',
    organizer: 'bg-green-50 text-green-600',
  };
  return roleColors[role];
};
