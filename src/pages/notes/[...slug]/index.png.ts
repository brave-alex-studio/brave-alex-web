import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { fontData, experimental_getFontFileURL } from "astro:assets";
import satori from "satori";
import sharp from "sharp";
import { getFontPathByWeight } from "@/utils/getFontPathByWeight";
import { getPostSlug } from "@/utils/getPostPaths";
import { postFilter } from "@/utils/postFilter";
import config from "@/config";

export async function getStaticPaths() {
  if (!config.features.dynamicOgImage) {
     return [];
   }

  const notes = await getCollection("blog").then(p =>
    p.filter(post => postFilter(post) && !post.data.ogImage)
  );

  return notes.map(note => ({
    params: { slug: getPostSlug(note.id, note.filePath) },
    props: note,
  }));
}

export const GET: APIRoute = async ({ props, url }) => {
  if (!config.features.dynamicOgImage) {
    return new Response(null, { status: 404, statusText: "Not found" });
  }

  const openSans = fontData["--font-open-sans"];
  const germaniaOne = fontData["--font-germania-one"];
  const openSansRegularPath = getFontPathByWeight(openSans, 400);
  const openSansBoldPath = getFontPathByWeight(openSans, 700);
  const germaniaOnePath = getFontPathByWeight(germaniaOne, 400);

  if (!openSansRegularPath || !openSansBoldPath || !germaniaOnePath) {
    throw new Error("Cannot find the font path.");
  }

  const [openSansRegular, openSansBold, germaniaOneData] = await Promise.all(
    [openSansRegularPath, openSansBoldPath, germaniaOnePath].map(path =>
      fetch(experimental_getFontFileURL(path, url)).then(res => res.arrayBuffer())
    )
  );

  const svg = await satori(
    {
      key: null,
      type: "div",
      props: {
        style: {
          background: "#fefbfb",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Open Sans",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                top: "-1px",
                right: "-1px",
                boxSizing: "border-box",
                border: "4px solid #000",
                background: "#ecebeb",
                opacity: "0.9",
                borderRadius: "4px",
                display: "flex",
                justifyContent: "center",
                margin: "2.5rem",
                width: "88%",
                height: "80%",
              },
            },
          },
          {
            type: "div",
            props: {
              style: {
                position: "relative",
                boxSizing: "border-box",
                border: "4px solid #000",
                background: "#fefbfb",
                borderRadius: "4px",
                display: "flex",
                justifyContent: "center",
                margin: "2rem",
                width: "88%",
                height: "80%",
              },
              children: {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    margin: "20px",
                    width: "90%",
                    height: "90%",
                  },
                  children: [
                    {
                      type: "p",
                      props: {
                        style: {
                          fontSize: 72,
                          fontWeight: "bold",
                          fontFamily: "Germania One",
                          margin: "17px 0 0",
                          maxHeight: "80%",
                          overflow: "hidden",
                        },
                        children: props.data.title,
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                          marginBottom: "8px",
                          fontSize: 28,
                        },
                        children: [
                          {
                            type: "span",
                            props: {
                              children: [
                                "by ",
                                {
                                  type: "span",
                                  props: {
                                    style: {
                                      overflow: "hidden",
                                      fontWeight: "bold",
                                    },
                                    children: props.data.author,
                                  },
                                },
                              ],
                            },
                          },
                          {
                            type: "span",
                            props: {
                              style: { overflow: "hidden", fontWeight: "bold" },
                              children: config.site.title,
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      embedFont: true,
      fonts: [
        { name: "Open Sans", data: openSansRegular, weight: 400, style: "normal" },
        { name: "Open Sans", data: openSansBold, weight: 700, style: "normal" },
        { name: "Germania One", data: germaniaOneData, weight: 400, style: "normal" },
      ],
    }
  );

  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(new Uint8Array(pngBuffer), {
    headers: { "Content-Type": "image/png" },
  });
};

// export const GET: APIRoute = async ({ props }) => {
//   if (!SITE.dynamicOgImage) {
//     return new Response(null, {
//       status: 404,
//       statusText: "Not found",
//     });
//   }

//   const buffer = await generateOgImageForPost(props as CollectionEntry<"blog">);
//   return new Response(new Uint8Array(buffer), {
//     headers: { "Content-Type": "image/png" },
//   });
// };
