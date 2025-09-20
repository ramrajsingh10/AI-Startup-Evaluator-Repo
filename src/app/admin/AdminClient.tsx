"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MoreHorizontal, FileText, Search } from "lucide-react";
import { DashboardLayout } from "@/components/shared/dashboard-layout";
import { PageHeader } from "@/components/shared/page-header";
import { users, startups, memos } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { cn, formatDate } from "@/lib/utils";

function AccessControlTab() {
    const { toast } = useToast();
    const handleAction = (action: string, email: string) => {
        toast({
            title: "Action Triggered",
            description: `${action} for ${email}`
        })
    }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Access Control</CardTitle>
        <CardDescription>Manage user roles and permissions.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      user.status === "Active"
                        ? "default"
                        : user.status === "Pending"
                        ? "secondary"
                        : "destructive"
                    }
                    className={cn(user.status === 'Active' && 'bg-green-500/20 text-green-700 border-green-500/30 hover:bg-green-500/30', user.status === 'Pending' && 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30 hover:bg-yellow-500/30')}
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onSelect={() => handleAction('Grant Access', user.email)}>Grant Access</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => handleAction('Revoke Access', user.email)}>Revoke Access</DropdownMenuItem>
                      <DropdownMenuSeparator />
                       <DropdownMenuItem onSelect={() => handleAction(user.status === 'Deactivated' ? 'Reactivate' : 'Deactivate', user.email)} className={cn(user.status === 'Deactivated' && 'text-green-600 focus:text-green-600')}>{user.status === 'Deactivated' ? 'Reactivate' : 'Deactivate'}</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function SubmissionsTab() {
    const { toast } = useToast();
    const handleAction = (action: string, company: string) => {
        toast({
            title: "Action Triggered",
            description: `${action} for ${company}`
        })
    }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Startup Submissions</CardTitle>
        <CardDescription>Review and manage all incoming startup applications.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Sector</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Submitted On</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {startups.map((startup) => (
              <TableRow key={startup.id}>
                <TableCell className="font-medium">{startup.company}</TableCell>
                <TableCell>{startup.sector}</TableCell>
                <TableCell>{startup.stage}</TableCell>
                <TableCell>{formatDate(startup.submittedAt)}</TableCell>
                <TableCell>
                  <Badge variant={startup.status === "Approved" ? "default" : startup.status === 'Pending' ? 'secondary' : "destructive"}
                  className={cn(startup.status === 'Approved' && 'bg-green-500/20 text-green-700 border-green-500/30 hover:bg-green-500/30', startup.status === 'Pending' && 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30 hover:bg-yellow-500/30')}
                  >
                    {startup.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onSelect={() => handleAction('Approve', startup.company)}>Approve</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => handleAction('Reject', startup.company)} className="text-red-600 focus:text-red-600">Reject</DropdownMenuItem>
                       <DropdownMenuSeparator />
                        <Link href={`/memo/${memos.find(m => m.startupId === startup.id)?.id || 'm1'}`}><DropdownMenuItem>View Memo</DropdownMenuItem></Link>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function MemosTab() {
    const [searchTerm, setSearchTerm] = React.useState("");
    const filteredMemos = memos.filter(memo => {
        const startup = startups.find(s => s.id === memo.startupId);
        return startup?.company.toLowerCase().includes(searchTerm.toLowerCase()) || memo.type.toLowerCase().includes(searchTerm.toLowerCase());
    });

  return (
    <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search memos..." 
            className="pl-8 sm:w-1/3" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredMemos.map(memo => {
              const startup = startups.find(s => s.id === memo.startupId);
              return (
                <Link href={`/memo/${memo.id}`} key={memo.id}>
                    <Card className="hover:bg-accent/50 transition-colors h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>{startup?.company}</span>
                                <FileText className="h-5 w-5 text-muted-foreground" />
                            </CardTitle>
                            <CardDescription>{memo.type}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Badge variant={memo.status === 'Completed' ? "default" : 'secondary'} className={cn(memo.status === 'Completed' ? 'bg-green-500/20 text-green-700 border-green-500/30 hover:bg-green-500/30' : 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30 hover:bg-yellow-500/30')}>
                                {memo.status}
                            </Badge>
                        </CardContent>
                    </Card>
                </Link>
              )
          })}
        </div>
    </div>
  );
}

function SystemTab() {
  return (
     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Region</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">us-central1</div>
              <p className="text-xs text-muted-foreground">Primary compute region</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Storage Buckets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">Active GCS buckets</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">API Endpoints</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Exposed API endpoints</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Model</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Gemini 2.5</div>
              <p className="text-xs text-muted-foreground">Model for memo generation</p>
            </CardContent>
          </Card>
        </div>
  );
}

export default function AdminClient() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Admin Dashboard"
        description="Oversee and manage the entire StartupVerse ecosystem."
      />
      <Tabs defaultValue="access-control">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
          <TabsTrigger value="access-control">Access Control</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="memos">Memos</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>
        <TabsContent value="access-control" className="mt-4">
          <AccessControlTab />
        </TabsContent>
        <TabsContent value="submissions" className="mt-4">
          <SubmissionsTab />
        </TabsContent>
        <TabsContent value="memos" className="mt-4">
          <MemosTab />
        </TabsContent>
        <TabsContent value="system" className="mt-4">
          <SystemTab />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
