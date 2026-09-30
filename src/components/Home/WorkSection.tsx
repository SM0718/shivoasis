// import { useLayoutEffect, useRef } from "react";
// import type { FC } from "react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import WorkItem from "./WorkItem";
// import { PROJECTS } from "../data/projects";

// gsap.registerPlugin(ScrollTrigger);

// const WorkSection: FC = () => {
//   const sectionRef = useRef<HTMLElement | null>(null);

//   useLayoutEffect(() => {
//     const section = sectionRef.current;
//     if (!section) return;

//     const ctx = gsap.context(() => {
//       const workItems = gsap.utils.toArray<HTMLElement>('[data-work="item"]');
//       const ghostItems = gsap.utils.toArray<HTMLElement>("[data-ghost]");

//       // Initial setup
//       gsap.set(workItems, {
//         position: "fixed",
//         top: "0",
//         clipPath: "inset(100% 0 0% 0)",
//       });

//       workItems.forEach((element, index) => {
//         const ghost = ghostItems[index];
//         if (!ghost) return;

//         const lines = element.querySelectorAll<HTMLElement>("[data-line]");
//         const workImage = element.querySelector<HTMLElement>(
//           '[data-work="image"]',
//         );
//         const videoContainer = element.querySelectorAll<HTMLElement>(
//           '[data-work="video"]',
//         );
//         const overlay = element.querySelectorAll<HTMLElement>(
//           '[data-work="item-overlay"]',
//         );

//         // Set initial image scale
//         gsap.set(workImage, { scale: 1.4, yPercent: 10 });

//         // Main reveal animations
//         const stStarting: ScrollTrigger.Vars = {
//           trigger: ghost,
//           scrub: true,
//           start: "top bottom",
//           end: "+75vh top",
//         };
//         gsap.to(element, {
//           clipPath: "inset(0% 0 0 0)",
//           scrollTrigger: stStarting,
//         });
//         gsap.to(workImage, {
//           yPercent: 10,
//           scale: 1.2,
//           scrollTrigger: stStarting,
//         });

//         // Text lines animation
//         gsap.from(lines, {
//           yPercent: 125,
//           rotate: 2.5,
//           ease: "power2.inOut",
//           duration: 1.25,
//           scrollTrigger: {
//             trigger: ghost,
//             start: "top 75%",
//             toggleActions: "play reverse restart reverse",
//           },
//         });

//         // Image blur effect
//         gsap.to(workImage, {
//           filter: "blur(10px)",
//           opacity: 0.3,
//           ease: "power2.inOut",
//           scrollTrigger: {
//             trigger: ghost,
//             scrub: true,
//             start: "0 top",
//             end: "35% top",
//           },
//         });

//         // Video container slide in
//         gsap.from(videoContainer, {
//           x: index % 2 === 0 ? "100vw" : "-100vw",
//           scrollTrigger: {
//             trigger: ghost,
//             scrub: true,
//             start: "0 top",
//             end: "65% top",
//             onLeave: () => {
//               gsap.set(overlay, { display: "flex", opacity: 0 });
//             },
//           },
//         });

//         // Final animations
//         const stFinal: ScrollTrigger.Vars = {
//           trigger: ghost,
//           scrub: true,
//           start: "105% bottom",
//           toggleActions: "play reverse play reverse",
//         };
//         gsap.fromTo(
//           overlay,
//           { opacity: 0 },
//           { opacity: 1, scrollTrigger: stFinal },
//         );
//         gsap.to(videoContainer, { yPercent: 15, scrollTrigger: stFinal });
//         gsap.to(element, { filter: "blur(1px)", scrollTrigger: stFinal });
//       });
//     }, section);

//     return () => ctx.revert();
//   }, []);

//   return (
//     <section className="work_section" data-work="section" ref={sectionRef}>
//       <div className="work_container">
//         {PROJECTS.map((project) => (
//           <WorkItem key={project.id} project={project} />
//         ))}
//       </div>

//       {/* Ghost elements for scroll tracking */}
//       <div className="ghost_work-container">
//         {PROJECTS.map((project) => (
//           <div className="ghost_work-item" data-ghost key={project.id} />
//         ))}
//       </div>
//     </section>
//   );
// };

// export default WorkSection;
