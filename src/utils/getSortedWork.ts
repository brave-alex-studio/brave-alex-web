import type { CollectionEntry } from "astro:content";

const getSortedWork = (work: CollectionEntry<"work">[]) => {
  return work.sort(
    (a, b) =>
      Math.floor(new Date(b.data.date).getTime() / 1000) -
      Math.floor(new Date(a.data.date).getTime() / 1000)
  );
};

export default getSortedWork;
