"use client";

import { useState, useEffect } from "react";
import { XMLParser } from "fast-xml-parser";
import { getANNReport, getANNDetails } from "@/lib/api";
import { FeaturedAnime } from "@/types/anime";

// Map genre/theme to beautiful Ghibli-esque icon emojis
function getCozyIcon(genres: string[], type: string): string {
  const gLower = genres.map(g => g.toLowerCase());
  if (gLower.includes("fantasy") || gLower.includes("magic")) return "🧙‍♂️";
  if (gLower.includes("adventure") || gLower.includes("nature")) return "🏞️";
  if (gLower.includes("drama") || gLower.includes("slice of life")) return "🎭";
  if (type.toLowerCase() === "movie") return "🎬";
  return "📺";
}

export function useFeaturedAnime() {
  const [data, setData] = useState<FeaturedAnime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchFeatured() {
      try {
        setLoading(true);
        
        const parser = new XMLParser({
          ignoreAttributes: false,
          attributeNamePrefix: "",
        });

        // 1. DYNAMICALLY FETCH REPORTS LIST (First Step to absolute dynamism)
        // Reports ID 155 is the active list of anime titles
        const reportsXml = await getANNReport(155, "anime");
        if (!isMounted) return;

        const parsedReports = parser.parse(reportsXml);

        // Extract items from report safely
        const rawItems = parsedReports?.report?.item;
        const items = Array.isArray(rawItems)
          ? rawItems
          : rawItems
          ? [rawItems]
          : [];

        if (items.length === 0) {
          throw new Error("Invalid or empty reports from ANN API.");
        }

        // Take a larger slice (top 6 newest items) to ensure we always have 3 fully-formed items with images
        const top6Items = items.slice(0, 6);
        const dynamicIds = top6Items.map((item: any) => Number(item.id));

        if (dynamicIds.length === 0) {
          throw new Error("No valid anime IDs found in ANN reports.");
        }

        // 2. DYNAMICALLY FETCH ANIME DETAILS FOR THESE SPECIFIC IDs
        const xmlDetailsData = await getANNDetails(dynamicIds, "anime");
        if (!isMounted) return;

        const parsedDetails = parser.parse(xmlDetailsData);
        const animeList: FeaturedAnime[] = [];

        if (parsedDetails.ann && parsedDetails.ann.anime) {
          // If there is only one anime returned, fast-xml-parser returns an object instead of an array
          const rawAnimeArray = Array.isArray(parsedDetails.ann.anime)
            ? parsedDetails.ann.anime
            : [parsedDetails.ann.anime];

          rawAnimeArray.forEach((anime: any) => {
            const infoArray = Array.isArray(anime.info)
              ? anime.info
              : anime.info
              ? [anime.info]
              : [];

            let plot = "";
            let image = "";
            const genres: string[] = [];
            let vintage = "";

            infoArray.forEach((info: any) => {
              const type = info.type;
              if (type === "Plot Summary") {
                plot = info["#text"] || "";
              } else if (type === "Picture") {
                if (Array.isArray(info.img)) {
                  const maxImg = info.img.find((img: any) => img.src && img.src.includes("max500x600")) || info.img[info.img.length - 1];
                  image = maxImg?.src || info.src || "";
                } else if (info.img && info.img.src) {
                  image = info.img.src;
                } else {
                  image = info.src || "";
                }
              } else if (type === "Genres" && info["#text"]) {
                genres.push(info["#text"]);
              } else if (type === "Vintage" && info["#text"]) {
                vintage = info["#text"];
              }
            });

            // Clean up vintage text (extract first year)
            const yearMatch = vintage.match(/\d{4}/);
            const formattedDate = yearMatch ? `Released in ${yearMatch[0]}` : "Classic Chronicle";

            // Determine dynamic category
            const category = genres[0] || (anime.precision ? anime.precision : "Classic");

            // Calculate reading time based on plot length
            const words = plot.split(/\s+/).length;
            const readingTime = Math.max(3, Math.ceil(words / 180));

            animeList.push({
              id: anime.id,
              category,
              icon: getCozyIcon(genres, anime.type || ""),
              title: anime.name || "Untitled Chronicle",
              excerpt: plot || "Explore details about this magnificent watercolor chronicle.",
              date: formattedDate,
              author: "ANN Encyclopedia",
              readingTime,
              image,
              genres,
              precision: anime.precision,
            });
          });
        }

        // Sort items back to their dynamic reports order and filter out ones without an image or plot if possible, then take top 3
        const orderedList = dynamicIds
          .map(id => animeList.find(a => Number(a.id) === id))
          .filter(Boolean) as FeaturedAnime[];

        // Prioritize items that have images to keep the UI extremely premium and wowing
        const withImages = orderedList.filter(a => a.image);
        const withoutImages = orderedList.filter(a => !a.image);
        const best3Items = [...withImages, ...withoutImages].slice(0, 3);

        if (isMounted) {
          setData(best3Items);
          setError(null);
        }
      } catch (err: any) {
        console.error("Error dynamically fetching and parsing ANN API:", err);
        if (isMounted) {
          setError(err.message || "Failed to fetch live dynamic chronicles.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchFeatured();

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, loading, error };
}
