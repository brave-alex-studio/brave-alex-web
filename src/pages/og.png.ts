import type { APIRoute } from "astro";
import satori from "satori";
import sharp from "sharp";
import { fontData, experimental_getFontFileURL } from "astro:assets";
import { getFontPathByWeight } from "@/utils/getFontPathByWeight";
import config from "@/config";

export const GET: APIRoute = async context => {
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
      fetch(experimental_getFontFileURL(path, context.url)).then(res =>
        res.arrayBuffer()
      )
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
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "90%",
                          maxHeight: "90%",
                          overflow: "hidden",
                          textAlign: "center",
                        },
                        children: [
                          {
                            type: "p",
                            props: {
                              style: {
                                fontSize: 72,
                                fontWeight: "bold",
                                fontFamily: "Germania One",
                                margin: "0 0 31px",
                                width: "100%",
                              },
                              children: config.site.title,
                            },
                          },
                          {
                            type: "p",
                            props: {
                              style: { fontSize: 28, margin: 0, width: "100%" },
                              children: config.site.description,
                            },
                          },
                        ],
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                          justifyContent: "flex-end",
                          width: "100%",
                          marginBottom: "8px",
                          fontSize: 28,
                        },
                        children: {
                          type: "span",
                          props: {
                            style: { overflow: "hidden", fontWeight: "bold" },
                            children: new URL(config.site.url).hostname,
                          },
                        },
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
