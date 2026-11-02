import { Player, type PlayerRef } from "@remotion/player";
import { useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  SHOWCASE_FPS,
  SHOWCASE_FRAMES,
  formatPrice,
  groupLabels,
  packageById,
  sceneIndexAt,
  sceneTarget,
  showcaseGroups,
  type ShowcaseGroup,
} from "../data/site";
import { NAV_HEIGHT, useMediaQuery } from "../hooks";
import { ServiceShowcaseComposition } from "../remotion/ServiceShowcaseComposition";

type QuoteHandler = (packageId: string) => void;

const COMP_WIDTH = 1200;

export function ServiceShowcase({ onQuote }: { onQuote: QuoteHandler }) {
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  const narrow = useMediaQuery("(max-width: 899px)");
  const still = reduce || narrow;

  return (
    <section className="showcase" id="services" aria-labelledby="services-title">
      <div className="showcase-intro wrap">
        <p className="label">Services</p>
        <h2 id="services-title">Exterior, interior and ceramic coating.</h2>
        <p className="lede">Nine packages in three groups. Scroll through each one, or jump straight to the full list.</p>
        <a className="skip-link" href="#packages">
          Skip to all packages
        </a>
      </div>
      {showcaseGroups.map((group, i) =>
        still ? (
          <StackedGroup key={group.id} group={group} onQuote={onQuote} />
        ) : (
          <PinnedGroup key={group.id} group={group} flip={i % 2 === 1} onQuote={onQuote} />
        ),
      )}
    </section>
  );
}

function GroupHeading({ group }: { group: ShowcaseGroup }) {
  return (
    <div className="group-heading">
      <h3 id={`group-${group.id}`}>{groupLabels[group.id]}</h3>
      <p>{group.intro}</p>
    </div>
  );
}

function SceneCopy({ group, index, onQuote }: { group: ShowcaseGroup; index: number; onQuote: QuoteHandler }) {
  const pkg = packageById(group.scenes[index].packageId)!;
  return (
    <>
      <p className="scene-count">
        {String(index + 1).padStart(2, "0")} / {String(group.scenes.length).padStart(2, "0")}
      </p>
      <h4>{pkg.name}</h4>
      <p className="scene-price">{formatPrice(pkg.price)}</p>
      {pkg.price !== null ? <p className="scene-summary">{pkg.summary}</p> : <div className="scene-summary" />}
      <button type="button" className="btn btn-dark" onClick={() => onQuote(pkg.id)}>
        Request a quote<span className="sr-only"> for {pkg.name}</span>
      </button>
    </>
  );
}

function StackedGroup({ group, onQuote }: { group: ShowcaseGroup; onQuote: QuoteHandler }) {
  return (
    <div className="stacked wrap" aria-labelledby={`group-${group.id}`}>
      <GroupHeading group={group} />
      {group.scenes.map((scene, i) => (
        <article className="stacked-scene" key={scene.packageId}>
          <figure>
            <img
              src={scene.image}
              alt={scene.alt}
              style={{ objectPosition: scene.objectPosition }}
              loading="lazy"
              decoding="async"
            />
            {scene.note ? <figcaption className="stage-note">{scene.note}</figcaption> : null}
          </figure>
          <div className="scene-copy">
            <SceneCopy group={group} index={i} onQuote={onQuote} />
          </div>
        </article>
      ))}
    </div>
  );
}

function PinnedGroup({ group, flip, onQuote }: { group: ShowcaseGroup; flip: boolean; onQuote: QuoteHandler }) {
  const { scenes } = group;
  const trackRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<PlayerRef>(null);
  const frameRef = useRef(0);
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [compHeight, setCompHeight] = useState(1080);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: [`start ${NAV_HEIGHT}px`, "end end"],
  });

  const inputProps = useMemo(
    () => ({ layers: scenes.map(({ image, objectPosition, hold }) => ({ image, objectPosition, hold })) }),
    [scenes],
  );

  const sync = (progress: number) => {
    const p = Math.min(1, Math.max(0, progress));
    const frame = Math.round(p * (SHOWCASE_FRAMES - 1));
    if (frame !== frameRef.current) {
      frameRef.current = frame;
      playerRef.current?.seekTo(frame);
    }
    setActive(sceneIndexAt(scenes, p));
  };

  useMotionValueEvent(scrollYProgress, "change", sync);

  useEffect(() => {
    const el = visualRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setCompHeight(Math.round((COMP_WIDTH * height) / width / 2) * 2);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true);
          io.disconnect();
        }
      },
      { rootMargin: "800px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!mounted) return;
    let cancelled = false;
    Promise.all(
      scenes.map(
        (s) =>
          new Promise<boolean>((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = s.image;
          }),
      ),
    ).then((loaded) => {
      if (!cancelled && loaded.every(Boolean)) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [mounted, scenes]);

  useEffect(() => {
    if (!ready) return;
    const id = requestAnimationFrame(() => {
      frameRef.current = -1;
      sync(scrollYProgress.get());
    });
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const goTo = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const top = track.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
    const distance = track.offsetHeight - window.innerHeight + NAV_HEIGHT;
    window.scrollTo({ top: top + sceneTarget(scenes, index) * distance, behavior: "smooth" });
  };

  const still = scenes[active];

  return (
    <div className={`pinned${flip ? " is-flipped" : ""}`} ref={trackRef} aria-labelledby={`group-${group.id}`}>
      <div className="pinned-stage">
        <div className="stage-visual" ref={visualRef}>
          <img className="stage-still" src={still.image} alt="" style={{ objectPosition: still.objectPosition }} />
          {mounted && ready ? (
            <div className="stage-player" aria-hidden="true">
              <Player
                ref={playerRef}
                component={ServiceShowcaseComposition}
                inputProps={inputProps}
                durationInFrames={SHOWCASE_FRAMES}
                fps={SHOWCASE_FPS}
                compositionWidth={COMP_WIDTH}
                compositionHeight={compHeight}
                style={{ width: "100%", height: "100%" }}
                controls={false}
                autoPlay={false}
                loop={false}
                clickToPlay={false}
                doubleClickToFullscreen={false}
                spaceKeyToPlayOrPause={false}
                initiallyShowControls={false}
              />
            </div>
          ) : null}
          {still.note ? <p className="stage-note">{still.note}</p> : null}
          <p className="sr-only" aria-live="polite">
            Showing {still.alt}
          </p>
        </div>

        <div className="stage-copy">
          <GroupHeading group={group} />
          <nav className="scene-nav" aria-label={`${groupLabels[group.id]} packages`}>
            {scenes.map((scene, i) => (
              <button
                key={scene.packageId}
                type="button"
                className={i === active ? "is-active" : undefined}
                aria-current={i === active ? "step" : undefined}
                onClick={() => goTo(i)}
              >
                {packageById(scene.packageId)!.name}
              </button>
            ))}
          </nav>
          <div className="scene-copy" key={active}>
            <SceneCopy group={group} index={active} onQuote={onQuote} />
          </div>
        </div>
      </div>
    </div>
  );
}
