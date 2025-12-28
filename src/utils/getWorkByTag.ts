import type { CollectionEntry } from "astro:content";
import getSortedWork from "./getSortedWork";
import { slugifyAll } from "./slugify";

const getWorkByTag = (work: CollectionEntry<"work">[], tag: string) =>
  getSortedWork(work.filter(item => slugifyAll(item.data.tags).includes(tag)));

export default getWorkByTag;
