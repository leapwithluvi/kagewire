import axios from "axios";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// In-memory cache to prevent rate-limiting on ANN API (which enforces a strict 1 req/sec limit)
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes
interface CacheEntry {
  data: string;
  timestamp: number;
}

const reportCache = new Map<string, CacheEntry>();
const detailsCache = new Map<string, CacheEntry>();

function logToFile(msg: string) {
  try {
    const logPath = "c:\\Users\\lkscy\\Documents\\leapwithluvi\\kagewire\\scratch\\proxy_log.txt";
    fs.appendFileSync(logPath, `[${new Date().toISOString()}] ${msg}\n`);
  } catch {
    // ignore logging failures
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const id = searchParams.get("id");
    const type = searchParams.get("type") || "anime";
    const ids = searchParams.get("ids");

    logToFile("Incoming request: action=" + String(action) + ", id=" + String(id) + ", type=" + String(type) + ", ids=" + String(ids));

    const baseUrl = "https://cdn.animenewsnetwork.com/encyclopedia";

    if (action === "report") {
      const cacheKey = `${id}-${type}`;
      const cached = reportCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        logToFile("[Report Cache HIT] Serving key: " + String(cacheKey));
        return new NextResponse(cached.data, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }

      const targetUrl = `${baseUrl}/reports.xml`;
      logToFile("[Report Cache MISS] Fetching from: " + String(targetUrl) + " with id=" + String(id) + ", type=" + String(type));
      
      try {
        const response = await axios.get(targetUrl, {
          params: {
            id,
            type,
            nlist: "all",
          },
          headers: {
            "Accept": "application/xml, text/xml, */*",
          },
          timeout: 20000,
        });

        reportCache.set(cacheKey, {
          data: response.data,
          timestamp: Date.now(),
        });

        // write raw response for debugging
        try {
          const dumpPath = "c:\\Users\\lkscy\\Documents\\leapwithluvi\\kagewire\\scratch\\ann_reports_latest.xml";
          fs.writeFileSync(dumpPath, response.data, { encoding: "utf8" });
          logToFile("[Report Dumped] " + String(dumpPath));
        } catch (e) {
          logToFile("[Report Dump ERROR] " + String(e));
        }

        logToFile("[Report Fetch SUCCESS] Key: " + String(cacheKey) + ", size: " + String(response.data.length) + " bytes");

        return new NextResponse(response.data, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
          },
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        logToFile("[Report Fetch ERROR] Failed for key: " + String(cacheKey) + ". Error: " + String(msg));
        if (cached) {
          logToFile("[Report Cache STALE Fallback] Serving stale for key: " + String(cacheKey));
          return new NextResponse(cached.data, {
            headers: {
              "Content-Type": "application/xml; charset=utf-8",
              "Access-Control-Allow-Origin": "*",
            },
          });
        }
        throw err;
      }
    } else if (action === "details") {
      // Normalize IDs list to make cache key deterministic.
      // Accept either comma-separated or slash-separated incoming values (client may send either).
      const normalizedIdsArray = (ids || "").split(/[,\/]/).map(s => s.trim()).filter(Boolean);
      const sortedIds = normalizedIdsArray.slice().sort().join(",");
      const cacheKey = `${type}-${sortedIds}`;
      const cached = detailsCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        logToFile("[Details Cache HIT] Serving key: " + String(cacheKey));
        return new NextResponse(cached.data, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }

      const targetUrl = `${baseUrl}/api.xml`;
      // For the external API, pass a slash-separated list for best compatibility (ANN accepts both, but slashes are common).
      const idsForRequest = normalizedIdsArray.join("/");
      logToFile("[Details Cache MISS] Fetching from: " + String(targetUrl) + " with " + String(type) + "=" + String(idsForRequest));

      try {
        const response = await axios.get(targetUrl, {
          params: {
            [type]: idsForRequest,
          },
          headers: {
            "Accept": "application/xml, text/xml, */*",
          },
          timeout: 20000,
        });

        detailsCache.set(cacheKey, {
          data: response.data,
          timestamp: Date.now(),
        });

        // write raw details response for debugging
        try {
          const dumpPath = "c:\\Users\\lkscy\\Documents\\leapwithluvi\\kagewire\\scratch\\ann_details_latest.xml";
          fs.writeFileSync(dumpPath, response.data, { encoding: "utf8" });
          logToFile("[Details Dumped] " + String(dumpPath));
        } catch (e) {
          logToFile("[Details Dump ERROR] " + String(e));
        }

        logToFile("[Details Fetch SUCCESS] Key: " + String(cacheKey) + ", size: " + String(response.data.length) + " bytes");

        return new NextResponse(response.data, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
          },
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        logToFile("[Details Fetch ERROR] Failed for key: " + String(cacheKey) + ". Error: " + String(msg));
        if (cached) {
          logToFile("[Details Cache STALE Fallback] Serving stale for key: " + String(cacheKey));
          return new NextResponse(cached.data, {
            headers: {
              "Content-Type": "application/xml; charset=utf-8",
              "Access-Control-Allow-Origin": "*",
            },
          });
        }
        throw err;
      }
    } else {
      logToFile("[Invalid Action] action=" + String(action));
      return NextResponse.json(
        { error: "Invalid action parameter. Must be 'report' or 'details'." },
        { status: 400 }
      );
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    // Try to recover a status code if it's an AxiosError-like object without using `any`
    function extractStatus(err: unknown): number {
      if (typeof err === "object" && err !== null) {
        const maybe = (err as { response?: { status?: number } }).response;
        if (maybe && typeof maybe.status === "number") return maybe.status;
      }
      return 500;
    }
    const status = extractStatus(error);
    logToFile("[Proxy Exception] Error: " + String(msg));
    return NextResponse.json(
      { error: msg || "Failed to fetch from AnimeNewsNetwork API" },
      { status }
    );
  }
}

