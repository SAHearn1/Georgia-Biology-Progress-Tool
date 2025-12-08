import AssessmentContent from "./assessment-content";

export default async function AssessmentPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  
  return <AssessmentContent sessionId={sessionId} />;
}
