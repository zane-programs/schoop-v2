const schoopInfoAPIFetcher = (path: string) =>
  fetch(
    `https://sheet.best/api/sheets/31be4cac-f1f5-4992-a33e-86108c276f6d${path}`
  ).then((r) => r.json());
export default schoopInfoAPIFetcher;
