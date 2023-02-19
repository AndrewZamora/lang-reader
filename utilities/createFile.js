export function jsonToCsv(json) {
  const header = Object.keys(json[0]).join(",") + "\n";
  const rows = json.map((obj) => Object.values(obj).join(",") + "\n");
  return header + rows.join("");
}

