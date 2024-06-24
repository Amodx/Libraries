export const FileContentMap: Record<string, string> = {
  //divine binary object
  dbo: "application/octet-stream",

  // Text formats
  html: "text/html",
  js: "text/javascript",
  css: "text/css",
  json: "application/json",
  txt: "text/plain",
  xml: "application/xml",
  csv: "text/csv",

  // Image formats
  png: "image/png",
  jpg: "image/jpeg", // Correct MIME type for JPEG images
  jpeg: "image/jpeg",
  gif: "image/gif",
  svg: "image/svg+xml",
  bmp: "image/bmp",
  webp: "image/webp",

  // Audio formats
  mp3: "audio/mpeg",
  wav: "audio/wav",
  ogg: "audio/ogg",
  m4a: "audio/mp4",
  aac: "audio/aac",

  // Video formats
  mp4: "video/mp4",
  avi: "video/x-msvideo",
  mov: "video/quicktime",
  wmv: "video/x-ms-wmv",
  flv: "video/x-flv",
  webm: "video/webm",

  // Application-specific formats
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  zip: "application/zip",
  rar: "application/x-rar-compressed",
  exe: "application/x-msdownload",
  msi: "application/x-msi",
  bin: "application/octet-stream",

  // Others
  ico: "image/x-icon",
  ttf: "font/ttf",
  otf: "font/otf",
  woff: "font/woff",
  woff2: "font/woff2",
};
