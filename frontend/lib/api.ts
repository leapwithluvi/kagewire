import axios from "axios";

// Query our local Next.js Route Handler proxy to bypass CORS and access server environment variables safely.
export const annClient = axios.create({
  baseURL: "/api",
  timeout: 20000,
  headers: {
    "Accept": "application/xml, text/xml, */*",
  },
});

annClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("[ANN Client Proxy Error]:", {
      message: error.message,
      url: error.config?.url,
      params: error.config?.params,
      status: error.response?.status,
    });
    return Promise.reject(error);
  }
);

export interface ANNReportResult {
  id: string;
  name: string;
  type: "anime" | "manga";
  precision?: string;
}

export interface ANNReport {
  report_id: number;
  type: "anime" | "manga";
  results: ANNReportResult[];
}

export interface ANNAnimeDetails {
  id: string;
  title: string;
  type: "anime" | "manga";
  features?: Record<string, any>;
  info?: any[];
}

export async function getANNReport(
  id: number,
  type: "anime" | "manga" = "anime"
): Promise<string> {
  const response = await annClient.get("/ann", {
    params: {
      action: "report",
      id,
      type,
    },
  });
  return response.data;
}

export async function getANNDetails(
  id: number | number[],
  type: "anime" | "manga" = "anime"
): Promise<string> {
  const idsStr = Array.isArray(id) ? id.join("/") : id;
  const response = await annClient.get("/ann", {
    params: {
      action: "details",
      type,
      ids: idsStr,
    },
  });
  return response.data;
}

