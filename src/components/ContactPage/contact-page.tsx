import { useRef } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import { useGSAP } from "@gsap/react";

import "./contact-page.css";

gsap.registerPlugin(ScrollTrigger, SplitText);

interface Studio {
  city: string;
  address: string;
  phone: string;
}

const STUDIOS: Studio[] = [
  {
    city: "Kolkata",
    address: "12 Southern Avenue, Alipore 700019",
    phone: "+91 33 4000 1200",
  },
  {
    city: "Naoshima",
    address: "3 Setouchi, Kagawa 764-0511",
    phone: "+81 87 600 4410",
  },
  {
    city: "Reykjavik",
    address: "Hafnarstræti 14, 101 Reykjavik",
    phone: "+354 551 8820",
  },
];

const PROJECT_TYPES = [
  "Architectural design",
  "Interior design",
  "Design & construction",
  "Conservation & heritage",
  "Planning application",
];

const BADGE_TEXT = "GET IN TOUCH • STUDIO ENQUIRIES • ";

export function ContactPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<SVGSVGElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const tallyRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      /*
       * Everything below is gated behind a single flag so the reduced
       * motion path renders the finished layout rather than a page
       * frozen at the start of every tween.
       */

      if (prefersReducedMotion) {
        return;
      }

      const ctx = gsap.context(() => {
        /*
         * --------------------------------------------------
         * HERO CHARACTER REVEAL
         * --------------------------------------------------
         */

        const headline = rootRef.current?.querySelector<HTMLElement>(
          ".contact-page__headline",
        );

        if (headline) {
          /*
           * Characters rather than words, because the mask has to
           * travel far enough to hide each glyph completely.
           */

          const split = SplitText.create(headline, {
            type: "chars",
            mask: "chars",
            charsClass: "contact-page__char",
            aria: "auto",
          });

          gsap.set(split.chars, {
            yPercent: 110,
            opacity: 0,
          });

          gsap.set(".contact-page__hero-meta > *", {
            y: 18,
            opacity: 0,
          });

          gsap.set(".contact-page__badge", {
            scale: 0.7,
            opacity: 0,
          });

          const intro = gsap.timeline({
            defaults: { ease: "power3.out" },
            delay: 0.15,
          });

          intro
            .to(split.chars, {
              yPercent: 0,
              opacity: 1,
              duration: 1.1,
              stagger: 0.018,
            })
            .to(
              ".contact-page__hero-meta > *",
              {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.08,
              },
              "-=0.55",
            )
            .to(
              ".contact-page__badge",
              {
                scale: 1,
                opacity: 1,
                duration: 0.9,
                ease: "back.out(1.7)",
              },
              "-=0.6",
            );

          /*
           * The badge keeps turning forever once it is on screen.
           * A plain repeat tween rather than a tween attached to the
           * intro timeline, so the intro easing does not fight it.
           */

          intro.eventCallback("onComplete", () => {
            gsap.to(badgeRef.current, {
              rotate: 360,
              duration: 22,
              ease: "none",
              repeat: -1,
            });
          });
        }

        /*
         * --------------------------------------------------
         * HERO IMAGE PARALLAX
         * --------------------------------------------------
         */

        if (heroRef.current) {
          gsap.fromTo(
            ".contact-page__hero-image",
            { yPercent: -8, scale: 1.12 },
            {
              yPercent: 8,
              scale: 1.02,
              ease: "none",
              scrollTrigger: {
                trigger: ".contact-page__hero",
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        }

        /*
         * --------------------------------------------------
         * GENERIC SCROLL REVEALS
         * --------------------------------------------------
         */

        gsap.utils.toArray<HTMLElement>(".contact-page__reveal").forEach(
          (element) => {
            gsap.from(element, {
              y: 44,
              opacity: 0,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: element,
                start: "top 88%",
                toggleActions: "play none none none",
              },
            });
          },
        );

        /*
         * Staggering from each element's own anchor keeps a grid of
         * cards cascading left to right instead of all at once.
         */

        gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach(
          (container) => {
            const children = container.children;

            gsap.from(children, {
              y: 30,
              opacity: 0,
              duration: 0.9,
              ease: "power3.out",
              stagger: 0.09,
              scrollTrigger: {
                trigger: container,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            });
          },
        );

        /*
         * --------------------------------------------------
         * FORM FIELDS
         * --------------------------------------------------
         */

        /*
         * The underline and label states are pure CSS transitions, so
         * GSAP stays out of them. Seeding them here would write inline
         * styles that outrank the stylesheet and break focus styling.
         */

        if (formRef.current) {
          gsap.from(".contact-page__field", {
            y: 34,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: {
              trigger: formRef.current,
              start: "top 82%",
              toggleActions: "play none none none",
            },
          });
        }

        /*
         * --------------------------------------------------
         * TALLY COUNTER
         * --------------------------------------------------
         */

        if (tallyRef.current) {
          const node = tallyRef.current;

          const tally = { value: 0 };

          gsap.to(tally, {
            value: 7,
            duration: 1.6,
            ease: "power2.out",
            snap: { value: 1 },
            onUpdate: () => {
              node.textContent = String(tally.value);
            },
            scrollTrigger: {
              trigger: node,
              start: "top 92%",
              toggleActions: "play none none none",
            },
          });
        }

        /*
         * --------------------------------------------------
         * SCROLL HINT FADE
         * --------------------------------------------------
         */

        gsap.to(".contact-page__scroll-hint", {
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: ".contact-page__hero",
            start: "top top",
            end: "18% top",
            scrub: true,
          },
        });

        /*
         * --------------------------------------------------
         * MAGNETIC SUBMIT BUTTON
         * --------------------------------------------------
         */

        if (buttonRef.current) {
          const button = buttonRef.current;

          const quickX = gsap.quickTo(button, "x", {
            duration: 0.45,
            ease: "power3.out",
          });

          const quickY = gsap.quickTo(button, "y", {
            duration: 0.45,
            ease: "power3.out",
          });

          const onMove = (event: MouseEvent) => {
            const bounds = button.getBoundingClientRect();

            quickX(
              (event.clientX - (bounds.left + bounds.width / 2)) * 0.28,
            );

            quickY(
              (event.clientY - (bounds.top + bounds.height / 2)) * 0.34,
            );
          };

          const onLeave = () => {
            quickX(0);
            quickY(0);
          };

          button.addEventListener("mousemove", onMove);
          button.addEventListener("mouseleave", onLeave);

          return () => {
            button.removeEventListener("mousemove", onMove);
            button.removeEventListener("mouseleave", onLeave);
          };
        }
      }, rootRef);

      return () => ctx.revert();
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="contact-page">
      {/* -------------------------------------------------- */}
      {/* GRAIN */}
      {/* -------------------------------------------------- */}

      <div className="contact-page__grain" aria-hidden />

      {/* -------------------------------------------------- */}
      {/* HERO */}
      {/* -------------------------------------------------- */}

      <section ref={heroRef} className="contact-page__hero">
        <div className="contact-page__hero-media" aria-hidden>
          <img
            src="/landing-pages/Architect.png"
            alt=""
            className="contact-page__hero-image"
          />

          <div className="contact-page__hero-scrim" />
        </div>

        <div className="contact-page__hero-body">
          <div className="contact-page__hero-meta">
            <span className="contact-page__eyebrow">Contact</span>

            <span className="contact-page__availability">
              <span className="contact-page__dot" />

              Commissions for 2027 are open
            </span>
          </div>

          <h1 className="contact-page__headline">
            Let&rsquo;s build something that outlasts us
          </h1>

          <p className="contact-page__lede">
            Send us the site, the brief, and the constraint you think is
            impossible. We will tell you whether it is.
          </p>
        </div>

        <svg
          ref={badgeRef}
          className="contact-page__badge"
          viewBox="0 0 200 200"
          aria-hidden
        >
          <defs>
            <path
              id="contact-badge-circle"
              d="M 100,100 m -74,0 a 74,74 0 1,1 148,0 a 74,74 0 1,1 -148,0"
            />
          </defs>

          <text className="contact-page__badge-text">
            <textPath href="#contact-badge-circle">
              {BADGE_TEXT}
            </textPath>
          </text>
        </svg>

        <div className="contact-page__scroll-hint" aria-hidden>
          <span>Scroll</span>

          <span className="contact-page__scroll-line" />
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* ENQUIRY FORM */}
      {/* -------------------------------------------------- */}

      <section className="contact-page__section">
        <div className="contact-page__section-head">
          <h2 className="contact-page__section-title">Start a project</h2>

          <p className="contact-page__section-note">
            We reply to every enquiry within five working days.
          </p>
        </div>

        <form ref={formRef} className="contact-page__form">
          <div className="contact-page__field">
            <label className="contact-page__label" htmlFor="contact-name">
              Your name
            </label>

            <input
              id="contact-name"
              name="name"
              type="text"
              className="contact-page__input"
              autoComplete="name"
              placeholder="Jane Doe"
            />

            <span className="contact-page__field-rule" aria-hidden />
          </div>

          <div className="contact-page__field">
            <label className="contact-page__label" htmlFor="contact-email">
              Email
            </label>

            <input
              id="contact-email"
              name="email"
              type="email"
              className="contact-page__input"
              autoComplete="email"
              placeholder="jane@studio.com"
            />

            <span className="contact-page__field-rule" aria-hidden />
          </div>

          <div className="contact-page__field">
            <label className="contact-page__label" htmlFor="contact-type">
              Discipline
            </label>

            <select
              id="contact-type"
              name="discipline"
              className="contact-page__input contact-page__select"
              defaultValue=""
            >
              <option value="" disabled>
                Select one
              </option>

              {PROJECT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <span className="contact-page__field-rule" aria-hidden />
          </div>

          <div className="contact-page__field contact-page__field--wide">
            <label className="contact-page__label" htmlFor="contact-message">
              The brief
            </label>

            <textarea
              id="contact-message"
              name="message"
              rows={4}
              className="contact-page__input contact-page__textarea"
              placeholder="Site, programme, budget band, and the part you are unsure about."
            />

            <span className="contact-page__field-rule" aria-hidden />
          </div>

          <div className="contact-page__submit-row">
            <button
              ref={buttonRef}
              type="submit"
              className="contact-page__submit"
            >
              Send enquiry
            </button>

            <p className="contact-page__submit-note">
              No newsletter, no mailing list. Only a reply from a partner.
            </p>
          </div>
        </form>
      </section>

      {/* -------------------------------------------------- */}
      {/* STUDIOS */}
      {/* -------------------------------------------------- */}

      <section className="contact-page__section">
        <div className="contact-page__section-head">
          <h2 className="contact-page__section-title">Studios</h2>

          <p className="contact-page__section-note">
            Three rooms, one studio. Visits by appointment.
          </p>
        </div>

        <div className="contact-page__studios" data-stagger>
          {STUDIOS.map((studio) => (
            <article key={studio.city} className="contact-page__studio">
              <span className="contact-page__studio-index">
                {STUDIOS.indexOf(studio) + 1}
              </span>

              <h3 className="contact-page__studio-city">{studio.city}</h3>

              <p className="contact-page__studio-address">{studio.address}</p>

              <a
                className="contact-page__studio-phone"
                href={`tel:${studio.phone.replace(/\s/g, "")}`}
              >
                {studio.phone}
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* DIRECT */}
      {/* -------------------------------------------------- */}

      <section className="contact-page__direct">
        <div>
          <span className="contact-page__eyebrow">Direct</span>

          <a
            className="contact-page__email"
            href="mailto:studio@shivoasis.arch"
          >
            studio@shivoasis.arch
          </a>
        </div>

        <div>
          <span className="contact-page__eyebrow">Commissions taken</span>

          <p className="contact-page__tally">
            <span ref={tallyRef}>7</span> of 12 slots filled
          </p>
        </div>
      </section>
    </div>
  );
}