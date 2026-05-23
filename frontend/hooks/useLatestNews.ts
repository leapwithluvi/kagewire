"use client";

import { getANNDetails, getANNReport } from "@/lib/api";
import { NewsArticle } from "@/types/news";
import { XMLParser } from "fast-xml-parser";
import { useEffect, useState } from "react";

export function useLatestNews(reportId = 155, maxItems = 24) {
  const [data, setData] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchNews() {
      try {
        setLoading(true);
        const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "" });

        const reportsXml = await getANNReport(reportId, "anime");
        if (!mounted) return;
        const parsed = parser.parse(reportsXml);
        const rawItems = parsed?.report?.item;
        console.debug("useLatestNews: report items raw:", Array.isArray(rawItems) ? rawItems.length : rawItems ? 1 : 0);
        const items = Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : [];

        const slice = items.slice(0, maxItems);
        function asObj(u: unknown): { [k: string]: unknown } | null {
          return typeof u === "object" && u !== null ? (u as { [k: string]: unknown }) : null;
        }

        function getText(obj: { [k: string]: unknown } | null | undefined, keys: string[] = ["#text", "text", "@_text", "$text"]): string | undefined {
          if (!obj) return undefined;
          for (const k of keys) {
            const v = obj[k];
            if (typeof v === "string") return v;
            if (typeof v === "number") return String(v);
          }
          return undefined;
        }

        function extractIdFromItem(it: unknown): number | null {
          const o = asObj(it);
          if (!o) return null;
          const idVal = o.id;
          if (typeof idVal === "string" || typeof idVal === "number") {
            const n = Number(idVal);
            return Number.isFinite(n) ? n : null;
          }
          if (typeof idVal === "object" && idVal !== null) {
            // fast-xml-parser may produce nested representations
            const maybe = getText(asObj(idVal));
            if (maybe !== undefined) {
              const n = Number(maybe);
              return Number.isFinite(n) ? n : null;
            }
          }
          // fallback: try top-level numeric-ish keys
          const fallback = Object.values(o).find(v => typeof v === 'string' || typeof v === 'number');
          if (typeof fallback === 'string' || typeof fallback === 'number') {
            const n = Number(fallback);
            return Number.isFinite(n) ? n : null;
          }
          return null;
        }

        const ids = slice
          .map((it) => extractIdFromItem(it))
          .filter((n): n is number => typeof n === 'number' && Number.isFinite(n));
        console.debug("useLatestNews: ids to fetch:", ids.length, ids.slice(0, 6));
        if (ids.length === 0) {
          setData([]);
          setError("No items in ANN report");
          return;
        }

        const detailsXml = await getANNDetails(ids, "anime");
        if (!mounted) return;
        const parsedDetails = parser.parse(detailsXml);

        const results: NewsArticle[] = [];
        if (parsedDetails.ann && parsedDetails.ann.anime) {
          const animeRaw = parsedDetails.ann.anime;
          const animeArr = Array.isArray(animeRaw) ? animeRaw : [animeRaw];

          // Build a map from id -> raw detail so we can preserve the report order
          const detailsMap = new Map<string, unknown>();
          animeArr.forEach(aRaw => {
            const aObj = asObj(aRaw) || {};
            const aid = aObj.id;
            let aidStr = "";
            if (typeof aid === 'string' || typeof aid === 'number') aidStr = String(aid);
            else if (typeof aid === 'object' && aid !== null) aidStr = getText(asObj(aid)) ?? "";
            if (aidStr) detailsMap.set(aidStr, aRaw);
          });

          // Iterate requested ids in order to produce results
          ids.forEach((reqId) => {
            const aRaw = detailsMap.get(String(reqId));
            if (!aRaw) return; // skip missing
            const a = asObj(aRaw) || {};
            const infoRaw = a.info;
            const infoArray: unknown[] = Array.isArray(infoRaw) ? infoRaw : infoRaw ? [infoRaw] : [];
            let plot = "";
            let image = "";
            const genres: string[] = [];

            infoArray.forEach((infoItem) => {
              const info = asObj(infoItem) || {};
              const type = typeof info.type === 'string' ? info.type : undefined;
              if (type === "Plot Summary") {
                const txt = getText(info);
                if (txt) plot = txt;
              } else if (type === "Picture") {
                const img = info.img;
                if (Array.isArray(img)) {
                  const first = asObj(img[0]);
                  const last = asObj(img[img.length - 1]);
                  const firstSrc = getText(first, ['src', '#text']);
                  const lastSrc = getText(last, ['src', '#text']);
                  const srcFromInfo = getText(info, ['src', '#text']);
                  const _src = firstSrc || lastSrc || srcFromInfo || undefined;
                  if (_src) image = _src;
                } else if (typeof img === 'object' && img !== null) {
                  const imgObj = asObj(img);
                  const _src = getText(imgObj, ['src', '#text']) || getText(info, ['src', '#text']);
                  if (_src) image = _src;
                } else {
                  const srcFromInfo = getText(info, ['src', '#text']);
                  if (srcFromInfo) image = srcFromInfo;
                }
              } else if (type === "Genres") {
                const txt = getText(info);
                if (txt) genres.push(txt);
              }
            });

            const words = plot ? plot.split(/\s+/).length : 0;
            const readingTime = Math.max(2, Math.ceil(words / 180));

            // vintage/date extraction
            let vintageText = "";
            const vintageItem = infoArray.find((it) => {
              const oi = asObj(it) || {};
              return oi.type === "Vintage";
            });
            if (vintageItem) {
              const vt = getText(asObj(vintageItem));
              if (vt) vintageText = vt;
            }

            const idVal = (a as { [k: string]: unknown }).id;
            const idStr = typeof idVal === "string" || typeof idVal === "number" ? String(idVal) : (typeof a === 'object' && a !== null ? String(((a as { [k: string]: unknown }).id) ?? reqId) : String(reqId));
            const nameVal = (a as { [k: string]: unknown }).name;
            const title = typeof nameVal === "string" || typeof nameVal === "number" ? String(nameVal) : "Untitled";

            const firstGenre = genres[0];
            const precisionVal = (a as { [k: string]: unknown }).precision;
            const category = typeof firstGenre === "string"
              ? firstGenre
              : typeof precisionVal === "string" || typeof precisionVal === "number"
              ? String(precisionVal)
              : "News";

            results.push({
              id: idStr,
              title,
              excerpt: plot || "",
              date: vintageText || "",
              category,
              image: image || undefined,
              icon: "📰",
              author: "ANN Encyclopedia",
              readingTime,
            });
          });
        }

        if (mounted) {
          console.debug("useLatestNews: parsed results:", results.length);
          setData(results);
          setError(null);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error("useLatestNews fetch error", msg);
        if (mounted) setError(msg || "Failed to fetch latest news");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchNews();

    return () => {
      mounted = false;
    };
  }, [reportId, maxItems]);

  return { data, loading, error };
}
