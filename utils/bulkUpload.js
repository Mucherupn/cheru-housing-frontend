import * as XLSX from "xlsx";
import { apiRequest } from "./adminApi";

const normalizeHeader = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");

const headerMap = {
  title: "title",
  description: "description",
  price: "price",
  type: "type",
  location: "location",
  housesize: "houseSize",
  landsize: "landSize",
  bedrooms: "bedrooms",
  bathrooms: "bathrooms",
  yearbuilt: "yearBuilt",
  floor: "floor",
  apartmentname: "apartmentName",
  amenities: "amenities",
};

const mapRow = (row) => {
  const mapped = {};
  Object.entries(row).forEach(([key, value]) => {
    const normalized = normalizeHeader(key);
    const mappedKey = headerMap[normalized];
    if (mappedKey) {
      mapped[mappedKey] = value;
    }
  });
  return mapped;
};

export const uploadListingsFromExcel = async (file) => {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rawRows = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
  const rows = rawRows.map(mapRow);

  return apiRequest("/api/admin/bulk-upload", {
    method: "POST",
    body: JSON.stringify({ rows }),
  });
};
