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
    name: "Anna Jihad F.",
    role: "Founder",
    company: "O'Art Studio",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    content:
      "Hyperfantasy is a motivated, forward thinking & also intelligent UI Designer team with lots of knowledge in their field. Proactive, energetic & totally organized. Hyperfantasy always maintains very good relation with co-workers & clients. They learns quickly and I would have no hesitation in working with Hyperfantasy once again in the future.",
    rating: 5,
    date: "2023-06-10",
  },
  {
    id: "2",
    name: "Cokorda Gde Dwipa Susila",
    role: "Head of Shipping & Export Import",
    company: "PT Freeport Indonesia",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    content:
      "Hyperfantasy is a rare & outstanding talents I have ever worked with. I've worked with them to develop UI/UX for an app & website. I was very impressed with their ability to translate a brief requirement into an awesome UI/UX design. They was always able to complete the task in a timely manner or even faster than the expected target. Great manner & professionalism during our cooperation.",
    rating: 5,
    date: "2023-04-22",
  },
  {
    id: "3",
    name: "Anas Al-Suhaim",
    role: "Founder & CTO",
    company: "Tammwel",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
    content:
      "I have been consistently impressed with Hyperfantasy talents, efficiency, & ability to get things done. I believe that their would be an excellent addition to your design projects. Hyperfantasy constantly seeks to learn more about illustration, UI/UX trends & latest tools in the industry & also a quick learner who picks up new technology with great speed.",
    rating: 5,
    date: "2022-11-15",
  },
  {
    id: "4",
    name: "Armando Chandra",
    role: "Co-founder & CEO",
    company: "KonsulAja",
    image: "https://randomuser.me/api/portraits/men/52.jpg",
    content:
      "The quality of the deliverables produced was satisfactory as Hyperfantasy did manage the complete the project within a relatively short period of time given the urgency of the project. Given the numerous requests from us, Hyperfantasy remained professional throughout the project & responded to our inputs in a structure manner in Figma.",
    rating: 5,
    date: "2022-09-08",
  },
  {
    id: "5",
    name: "Mubarak Al-Nabit",
    role: "Founder",
    company: "ezLaundry — Qatar",
    image: "https://randomuser.me/api/portraits/men/68.jpg",
    content:
      "Very creative and resourceful. I give 10/10 for the service provided by Hyperfantasy. They are very communicative, good collaboration and all managed very properly. I worked with Hyperfantasy to build a mobile app, dashboard for back office & website landing page, all done very well. Highly recommended for those who want \"creativity\".",
    rating: 5,
    date: "2022-07-01",
  },
];
