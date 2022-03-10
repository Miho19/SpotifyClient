import clsx from "clsx";
import React, { useState, useRef, useEffect } from "react";
import UserDisplay from "../Common/UserDisplay";

import PlaylistTop from "./PlaylistTop";
import ScrollingHeader from "./ScrollingHeader";

export default function StickyHeader({ color, imgSource, playlistName }) {
  const [isSticky, setSticky] = useState(false);
  const headerReference = useRef();

  useEffect(() => {
    const ref = headerReference.current;

    const observerCallback = ([entries]) => {
      console.log(entries.boundingClientRect.y < 0);

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

  console.log(color);

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
