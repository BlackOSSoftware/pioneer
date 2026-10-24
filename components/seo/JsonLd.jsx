/** Server-safe JSON-LD script tag */
export default function JsonLd({ data, id = "json-ld" }) {
  if (!data) return null;
  const payload = Array.isArray(data) ? data : [data];
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload.length === 1 ? payload[0] : payload) }}
    />
  );
}
