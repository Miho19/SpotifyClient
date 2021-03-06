import React, { useState, useRef, useEffect } from "react";
import PlaylistTop from "./PlaylistTop";
import ScrollingHeader from "./ScrollingHeader";

export default function StickyHeader({ color, imgSource, playlistName }) {
  const [isSticky, setSticky] = useState(false);
  const headerReference = useRef();

  useEffect(() => {
    const ref = headerReference.current;

    const observerCallback = ([entries]) => {
      setSticky(entries.boundingClientRect.y < 0);
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: [1],
    });

    observer.observe(ref);

    return () => {
      observer.unobserve(ref);
    };
  }, [isSticky]);

  return (
    <section ref={headerReference} className={`sticky top-[-1px]`}>
      {isSticky ? (
        <ScrollingHeader
          playlistName={playlistName}
          imgSource={imgSource}
          color={color ?? "#0f0f0f"}
        />
      ) : (
        <PlaylistTop
          imgSource={imgSource}
          playlistName={playlistName}
          color={color ?? "#0f0f0f"}
        />
      )}
    </section>
  );
}
