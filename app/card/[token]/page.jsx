import PublicVisitingCardClient from "./PublicVisitingCardClient";

export default async function PublicVisitingCardPage({ params }) {
  const { token } = await params;
  return <PublicVisitingCardClient token={token} />;
}
