"use client";

import Image from "next/image";

export default function AboutVisual() {
  return (
    <section className="w-full bg-gradient-to-b from-white via-white to-[#ffd5db]">
      <div className="relative">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(201,9,73,0.10),transparent_55%)]" />

        <div className="fluxion-container relative">

          <div className="relative h-[220px] sm:h-[260px] md:h-[320px] lg:h-[360px]">
            <Image
              src="/images/about/team-cutout.png"
              alt="Notre equipe"
              fill
              className="object-contain object-bottom"
              sizes="100vw"
              priority={false}
            />
          </div>
        </div>


        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#ffd5db] to-transparent" />
      </div>
    </section>
  );
}