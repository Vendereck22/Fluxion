"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import gsap from "gsap";

type TeamMember = {
  id: number;
  name: string;
  role: string;
  bio: string;
  img: string;
  socials: {
    linkedin: string;
    twitter: string;
    instagram: string;
  };
};

const LinkedInIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export default function TeamInteractive({
  title,
  members,
}: {
  title: string;
  members: TeamMember[];
}) {
  const teamData = members;
  const [activeIndex, setActiveIndex] = useState(0);
  const activeMember = teamData[activeIndex];

  if (teamData.length === 0 || !activeMember) {
    return (
      <section className="relative w-full overflow-hidden bg-white px-6 py-24">
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#ffd5db]/50 to-transparent" />
        <div className="relative mx-auto flex max-w-5xl flex-col items-center rounded-3xl border border-slate-200 bg-slate-50 px-6 py-16 text-center">
          <div className="mb-8 flex gap-3">
            <div className="h-20 w-14 rounded-2xl bg-gradient-to-b from-slate-300 to-slate-100" />
            <div className="mt-6 h-20 w-14 rounded-2xl bg-gradient-to-b from-fluxion-rose/30 to-slate-100" />
            <div className="h-20 w-14 rounded-2xl bg-gradient-to-b from-slate-300 to-slate-100" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-fluxion-rose">
            Équipe en cours d'intégration
          </p>
          <h2 className="mt-4 text-4xl font-black uppercase tracking-tight text-fluxion-blue md:text-6xl">
            {title}
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-500 md:text-base">
            Les profils existent déjà dans l'administration. Ajoutez les photos des membres pour activer le carrousel interactif de l'équipe.
          </p>
        </div>
      </section>
    );
  }

  const socialLinks = [
    { href: activeMember.socials.linkedin, icon: <LinkedInIcon className="w-6 h-6" /> },
    { href: activeMember.socials.twitter, icon: <TwitterIcon className="w-6 h-6" /> },
    { href: activeMember.socials.instagram, icon: <InstagramIcon className="w-6 h-6" /> },
  ].filter((item) => item.href && item.href !== "#");

  const handleNext = () => {
    const next = (activeIndex + 1) % teamData.length;
    animateTransition(next);
  };

  const handlePrev = () => {
    const prev = (activeIndex - 1 + teamData.length) % teamData.length;
    animateTransition(prev);
  };

  const animateTransition = (newIndex: number) => {

    gsap.fromTo(
      ".team-text-anim",
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        onStart: () => setActiveIndex(newIndex),
      },
    );


  };

  const getMobilePositionStyle = (index: number, total: number) => {

    if (index === 0)
      return { top: "50%", left: "50%", transform: "translate(-50%, -50%) scale(1.2)", zIndex: 30, opacity: 1 };

    if (index === 1)
      return { top: "50%", left: "75%", transform: "translate(-50%, -50%) scale(0.85)", zIndex: 20, opacity: 1 };

    if (index === 2)
      return { top: "50%", left: "95%", transform: "translate(-50%, -50%) scale(0.65)", zIndex: 10, opacity: 0.6 };

    if (index === total - 1)
      return { top: "50%", left: "25%", transform: "translate(-50%, -50%) scale(0.85)", zIndex: 20, opacity: 1 };

    if (index === total - 2)
      return { top: "50%", left: "5%", transform: "translate(-50%, -50%) scale(0.65)", zIndex: 10, opacity: 0.6 };


    return { top: "50%", left: "50%", transform: "translate(-50%, -50%) scale(0)", zIndex: 0, opacity: 0 };
  };

  const getPositionStyle = (index: number, total: number) => {

    if (index === 0)
      return {
        top: "50%",
        left: "0%",
        width: "320px",
        height: "320px",
        zIndex: 30,
        transform: "translateY(-50%)",
        opacity: 1,
      };

    if (index === 1)
      return {
        top: "70%",
        left: "45%",
        width: "150px",
        height: "150px",
        zIndex: 20,
        transform: "none",
        opacity: 1,
      };

    if (index === 2)
      return {
        top: "90%",
        left: "85%",
        width: "150px",
        height: "150px",
        zIndex: 10,
        transform: "none",
        opacity: 1,
      };


    if (index === total - 1)
      return {
        top: "5%",
        left: "45%",
        width: "150px",
        height: "150px",
        zIndex: 20,
        transform: "none",
        opacity: 1,
      };

    if (index === total - 2)
      return {
        top: "-15%",
        left: "85%",
        width: "150px",
        height: "150px",
        zIndex: 10,
        transform: "none",
        opacity: 1,
      };


    return {
      top: "50%",
      left: "100%",
      width: "0px",
      height: "0px",
      zIndex: 0,
      transform: "translateY(-50%)",
      opacity: 0,
    };
  };

  return (
    <section className="relative w-full min-h-screen bg-white flex flex-col justify-center overflow-hidden py-20 px-4 md:px-10">


      <div className="w-full flex flex-col items-center md:hidden space-y-8">


        <h2 className="text-fluxion-rose text-5xl font-black uppercase tracking-tighter text-center">
          {title}
        </h2>


        <div className="relative w-full h-[320px] overflow-visible mt-6">
          {teamData.map((member, i) => {
            let relativeIndex = (i - activeIndex) % teamData.length;
            if (relativeIndex < 0) relativeIndex += teamData.length;
            const pos = getMobilePositionStyle(relativeIndex, teamData.length);

            return (
              <div
                key={member.id}
                onClick={() => animateTransition(i)}
                className="absolute rounded-2xl overflow-hidden transition-all duration-700 ease-in-out cursor-pointer"
                style={{
                  top: pos.top,
                  left: pos.left,
                  width: "160px",
                  height: "220px",
                  zIndex: pos.zIndex,
                  transform: pos.transform,
                  opacity: pos.opacity,
                }}
              >
                <Image src={member.img} alt={member.name} fill className="object-cover" />
              </div>
            );
          })}
        </div>


        <div className="team-text-anim flex flex-col items-center text-center space-y-4 px-4">
          <h3 className="text-4xl font-bold text-black">{activeMember.name}</h3>
          <p className="text-black text-base font-medium max-w-xs leading-tight">
            {activeMember.bio}
          </p>


          {socialLinks.length > 0 && (
            <div className="flex flex-row gap-4 pt-2">
              {socialLinks.map((item) => (
                <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-black transition-colors">
                  {item.icon}
                </a>
              ))}
            </div>
          )}
        </div>


        <div className="flex flex-row gap-6 pt-4">
          <button onClick={handlePrev} className="w-12 h-12 flex items-center justify-center bg-gray-300 rounded-full text-black hover:bg-black hover:text-white transition-colors">
            <ChevronLeft size={24} />
          </button>
          <button onClick={handleNext} className="w-12 h-12 flex items-center justify-center bg-gray-300 rounded-full text-black hover:bg-black hover:text-white transition-colors">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>


      <div className="container mx-auto hidden md:grid md:grid-cols-2 gap-10 items-center">

        <div className="z-10 space-y-12">
          <h2 className="text-fluxion-rose text-5xl md:text-7xl font-black uppercase tracking-tighter">
            {title}
          </h2>

          <div className="team-text-anim space-y-4">
            <h3 className="text-4xl md:text-6xl font-bold text-black">
              {activeMember.name}
            </h3>
            <p className="text-black text-lg font-medium max-w-sm leading-tight">
              {activeMember.bio}
            </p>


            {socialLinks.length > 0 && (
              <div className="flex flex-row gap-4 pt-2">
                {socialLinks.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-500 hover:text-black transition-colors"
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            )}
          </div>


          <div className="flex flex-row gap-4 w-fit pt-4">
            <button
              onClick={handlePrev}
              className="w-14 h-14 flex items-center justify-center bg-gray-400 rounded-full text-black hover:bg-black hover:text-white transition-colors"
            >
              <ChevronUp size={28} />
            </button>
            <button
              onClick={handleNext}
              className="w-14 h-14 flex items-center justify-center bg-gray-400 rounded-full text-black hover:bg-black hover:text-white transition-colors"
            >
              <ChevronDown size={28} />
            </button>
          </div>
        </div>


        <div className="relative w-full h-[600px]">
          {teamData.map((member, i) => {

            let relativeIndex = (i - activeIndex) % teamData.length;
            if (relativeIndex < 0) relativeIndex += teamData.length;

            const pos = getPositionStyle(relativeIndex, teamData.length);

            return (
              <div
                key={member.id}
                onClick={() => animateTransition(i)}
                className="absolute rounded-2xl overflow-hidden transition-all duration-700 ease-in-out cursor-pointer"
                style={{
                  top: pos.top,
                  left: pos.left,
                  width: pos.width,
                  height: pos.height,
                  zIndex: pos.zIndex,
                  transform: pos.transform,
                }}
              >
                <Image
                  src={member.img}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
