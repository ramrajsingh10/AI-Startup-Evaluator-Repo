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
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

interface Startup {
  id: string;
  name: string;
  description: string;
  website: string;
  sector: "AI/ML" | "HealthTech" | "CleanTech" | "FinTech" | "SaaS";
  stage: "Pre-Seed" | "Seed" | "Series A" | "Series B" | "Growth";
  risk: {
    market: "low" | "medium" | "high";
    tech: "low" | "medium" | "high";
    team: "low" | "medium" | "high";
  };
}

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

export default function InvestorClient() {
  const [startups, setStartups] = React.useState<Startup[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [sectorFilter, setSectorFilter] = React.useState("all");
  const [stageFilter, setStageFilter] = React.useState("all");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sort, setSort] = React.useState("recent");
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();

  React.useEffect(() => {
    const fetchStartups = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const token = await user.getIdToken();
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/startups`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch startups.");
        }

        const data = await response.json();
        setStartups(data);
        setError(null);
      } catch (err) {
        setError("An error occurred while fetching startups.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStartups();
  }, [user]);

  const filteredStartups = startups
    .filter((s) => sectorFilter === "all" || s.sector === sectorFilter)
    .filter((s) => stageFilter === "all" || s.stage === stageFilter)
    .filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

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
                        {/* The traction sort option could be hidden or disabled as well if desired */}
                        <DropdownMenuCheckboxItem checked={sort === 'traction'} onSelect={() => setSort('traction')}>
                        Traction (Mock)
                        </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </CardHeader>
        <CardContent>
            {loading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full mt-2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-10 w-full" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12 text-destructive">{error}</div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredStartups.map(startup => (
                        <Card key={startup.id} className="flex flex-col">
                            <CardHeader>
                                <CardTitle className="flex justify-between items-start">
                                    <Link href={`/memo/${startup.id}`} className="hover:underline">{startup.name}</Link>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreVertical className="h-4 w-4"/>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem asChild><Link href={`/memo/${startup.id}`}><FileText className="mr-2 h-4 w-4"/> View Memo</Link></DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleConnect(startup.name)}><MessageSquare className="mr-2 h-4 w-4"/> Connect with Founder</DropdownMenuItem>
                                            <DropdownMenuItem onClick={handleSchedule}><CalendarPlus className="mr-2 h-4 w-4"/> Schedule 1:1</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </CardTitle>
                                <CardDescription>{startup.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow space-y-4">
                                <div className="flex gap-2">
                                   <Badge>{startup.sector}</Badge>
                                   <Badge variant="secondary">{startup.stage}</Badge>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold mb-2">Risk Heatmap</h4>
                                    <div className="flex gap-4 text-sm">
                                        <div className="flex items-center gap-2">Market <RiskBadge level={startup.risk?.market || 'low'} /></div>
                                        <div className="flex items-center gap-2">Tech <RiskBadge level={startup.risk?.tech || 'low'} /></div>
                                        <div className="flex items-center gap-2">Team <RiskBadge level={startup.risk?.team || 'low'} /></div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                               <Button className="w-full" asChild>
                                    <Link href={`/memo/${startup.id}`}>View Memo</Link>
                               </Button>
                            </CardFooter>
                        </Card>
                    ))}
                    {filteredStartups.length === 0 && (
                        <div className="col-span-full text-center py-12 text-muted-foreground">
                            No startups match your criteria.
                        </div>
                    )}
                </div>
            )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
