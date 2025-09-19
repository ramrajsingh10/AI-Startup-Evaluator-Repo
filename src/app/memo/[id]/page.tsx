import { DashboardLayout } from "@/components/shared/dashboard-layout";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { memos, startups } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { File, Link as LinkIcon, AlertTriangle } from "lucide-react";
import { notFound } from "next/navigation";

function MemoSection({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div>
            <h3 className="text-lg font-semibold font-headline mb-2">{title}</h3>
            <p className="text-muted-foreground whitespace-pre-line">{children}</p>
        </div>
    )
}

export default function MemoPage({ params }: { params: { id: string } }) {
  const memo = memos.find((m) => m.id === params.id);
  if (!memo) {
    notFound();
  }
  const startup = startups.find((s) => s.id === memo.startupId);
  if (!startup) {
    notFound();
  }

  return (
    <DashboardLayout>
      <PageHeader
        title={`${startup.company}: ${memo.type}`}
        description={`Investment memo generated for ${startup.company}.`}
      >
        <Badge variant={memo.status === 'Completed' ? "default" : 'secondary'} className={cn(memo.status === 'Completed' ? 'bg-green-500/20 text-green-700 border-green-500/30' : 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30')}>
            {memo.status}
        </Badge>
      </PageHeader>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <Card>
                <CardContent className="pt-6 space-y-6">
                    <MemoSection title="Founder & Team">{memo.content.founderAndTeam}</MemoSection>
                    <Separator/>
                    <MemoSection title="Problem & Market">{memo.content.problemAndMarket}</MemoSection>
                    <Separator/>
                    <MemoSection title="Differentiation">{memo.content.differentiation}</MemoSection>
                    <Separator/>
                    <MemoSection title="Business & Traction">{memo.content.businessAndTraction}</MemoSection>
                    <Separator/>
                    <MemoSection title="Comparables">{memo.content.comparables}</MemoSection>
                    
                    {memo.type === "Memo 2" && memo.content.callInsights && (
                        <>
                            <Separator/>
                            <MemoSection title="Call Insights">{memo.content.callInsights}</MemoSection>
                        </>
                    )}
                    
                    <Separator/>
                    
                    <div>
                        <h3 className="text-lg font-semibold font-headline mb-2 flex items-center gap-2 text-destructive/80"><AlertTriangle className="h-5 w-5"/>Risk Flags</h3>
                        <p className="text-destructive/90 bg-destructive/10 p-3 rounded-md border border-destructive/20">{memo.content.riskFlags}</p>
                    </div>

                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-1">
            <Card className="sticky top-20">
                <CardHeader>
                    <CardTitle>Sources</CardTitle>
                    <CardDescription>Files and links used for memo generation.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        {memo.sources.map((source, index) => (
                            <li key={index} className="flex items-center gap-3">
                                {source.startsWith('http') ? <LinkIcon className="h-4 w-4 text-muted-foreground"/> : <File className="h-4 w-4 text-muted-foreground"/>}
                                <a href={source} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline truncate">
                                    {source.split('/').pop()}
                                </a>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
