export async function GET() {
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
  <ShortName>Docmaker</ShortName>
  <Description>Search Docmaker — Free PDF tools and AI document generator</Description>
  <InputEncoding>UTF-8</InputEncoding>
  <Image width="16" height="16" type="image/png">https://docmaker.io/favicon-16x16.png</Image>
  <Url type="text/html" template="https://docmaker.io/search?q={searchTerms}"/>
</OpenSearchDescription>`.trim();

  return new Response(xml, {
    headers: {
      "Content-Type": "application/opensearchdescription+xml",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
