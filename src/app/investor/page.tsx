"use client";

import Link from "next/link";
import * as React from "react";
import { DashboardLayout } from "@/components/shared/dashboard-layout";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ListFilter, MoreVertical, Search, MessageSquare, CalendarPlus, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api-client";
import { Startup } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

const RiskBadge = ({
  level,
}: {
  level: "low" | "medium" | "high";
}) => {
  return (
    <Badge
      variant="outline"
      className={cn(
        "capitalize",
        level === "low" && "border-green-400 text-green-700 bg-green-100",
        level === "medium" && "border-yellow-400 text-yellow-700 bg-yellow-100",
        level === "high" && "border-red-400 text-red-700 bg-red-100",
      )}
    >
      {level}
    </Badge>
  );
};

const StartupCardSkeleton = () => (
    <Card className="flex flex-col">
        <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full mt-2" />
        </CardHeader>
        <CardContent className="flex-grow space-y-4">
            <div className="flex gap-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-24" />
            </div>
            <div>
                <Skeleton className="h-4 w-1/3 mb-2" />
                <div className="flex gap-4">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-20" />
                </div>
            </div>
        </CardContent>
        <CardFooter>
            <Skeleton className="h-10 w-full" />
        </CardFooter>
    </Card>
)

export default function InvestorPage() {
  const [startups, setStartups] = React.useState<Startup[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [sectorFilter, setSectorFilter] = React.useState("all");
  const [stageFilter, setStageFilter] = React.useState("all");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sort, setSort] = React.useState("recent");
  const { toast } = useToast();
  const router = useRouter();

  React.useEffect(() => {
    const fetchStartups = async () => {
      try {
        setIsLoading(true);
        const data = await apiClient.get("/api/startups");
        // Convert Firestore timestamps to Date objects
        const formattedData = data.map((s: any) => ({
            ...s,
            submittedAt: s.submittedAt ? new Date(s.submittedAt._seconds * 1000) : new Date(),
        }));
        setStartups(formattedData);
        setError(null);
      } catch (err) {
        setError("Failed to fetch startups. Please try again later.");
        toast({
            title: "Error",
            description: "Could not fetch startup data.",
            variant: "destructive"
        })
      } finally {
        setIsLoading(false);
      }
    };
    fetchStartups();
  }, [toast]);

  const approvedStartups = startups.filter((s) => s.status === "Approved");

  const filteredStartups = approvedStartups
    .filter((s) => sectorFilter === "all" || s.sector === sectorFilter)
    .filter((s) => stageFilter === "all" || s.stage === stageFilter)
    .filter((s) => s.company.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
        if (sort === 'recent' && a.submittedAt && b.submittedAt) {
            return b.submittedAt.getTime() - a.submittedAt.getTime();
        }
        if (sort === 'traction') {
            return (b.traction?.mrr || 0) - (a.traction?.mrr || 0);
        }
        return 0;
    });

    const handleConnect = (company: string) => {
        toast({ title: "Connection Request Sent", description: `You requested to connect with ${company}.`})
    }
    const handleSchedule = () => {
        router.push("/meet?mode=1-on-1")
    }

  return (
    <DashboardLayout>
      <PageHeader
        title="Browse Startups"
        description="Discover and analyze curated investment opportunities."
      />
      <Card>
        <CardHeader>
            <div className="flex flex-col md:flex-row gap-4 justify-between">
                <div className="relative flex-1 md:grow-0">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search by company name..."
                        className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Select value={sectorFilter} onValueChange={setSectorFilter}>
                        <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder="Filter by Sector" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Sectors</SelectItem>
                            <SelectItem value="AI/ML">AI/ML</SelectItem>
                            <SelectItem value="HealthTech">HealthTech</SelectItem>
                            <SelectItem value="CleanTech">CleanTech</SelectItem>
                            <SelectItem value="FinTech">FinTech</SelectItem>
                            <SelectItem value="SaaS">SaaS</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={stageFilter} onValueChange={setStageFilter}>
                        <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder="Filter by Stage" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Stages</SelectItem>
                            <SelectItem value="Pre-Seed">Pre-Seed</SelectItem>
                            <SelectItem value="Seed">Seed</SelectItem>
                            <SelectItem value="Series A">Series A</SelectItem>
                            <SelectItem value="Series B">Series B</SelectItem>
                        </SelectContent>
                    </Select>
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-10 gap-1">
                        <ListFilter className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Sort
                        </span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem checked={sort === 'recent'} onSelect={() => setSort('recent')}>
                        Recent
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem checked={sort === 'traction'} onSelect={() => setSort('traction')}>
                        Traction
                        </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </CardHeader>
        <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {isLoading ? (
                    Array.from({ length: 6 }).map((_, index) => <StartupCardSkeleton key={index} />)
                ) : error ? (
                    <div className="col-span-full text-center py-12 text-destructive">
                        {error}
                    </div>
                ) : filteredStartups.length > 0 ? (
                    filteredStartups.map(startup => (
                        <Card key={startup.id} className="flex flex-col">
                            <CardHeader>
                                <CardTitle className="flex justify-between items-start">
                                    <Link href={`/memo/${startup.id}`} className="hover:underline">{startup.company}</Link>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreVertical className="h-4 w-4"/>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem asChild><Link href={`/memo/${startup.id}`}><FileText className="mr-2 h-4 w-4"/> View Memo</Link></DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleConnect(startup.company)}><MessageSquare className="mr-2 h-4 w-4"/> Connect with Founder</DropdownMenuItem>
                                            <DropdownMenuItem onClick={handleSchedule}><CalendarPlus className="mr-2 h-4 w-4"/> Schedule 1:1</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </CardTitle>
                                <CardDescription>{startup.oneLiner}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow space-y-4">
                                <div className="flex gap-2">
                                   <Badge>{startup.sector}</Badge>
                                   <Badge variant="secondary">{startup.stage}</Badge>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold mb-2">Risk Heatmap</h4>
                                    <div className="flex gap-4 text-sm">
                                        <div className="flex items-center gap-2">Market <RiskBadge level={startup.risk.market} /></div>
                                        <div className="flex items-center gap-2">Tech <RiskBadge level={startup.risk.tech} /></div>
                                        <div className="flex items-center gap-2">Team <RiskBadge level={startup.risk.team} /></div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                               <Button className="w-full" asChild>
                                    <Link href={`/memo/${startup.id}`}>View Memo</Link>
                               </Button>
                            </CardFooter>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        No startups match your criteria.
                    </div>
                )}
            </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}