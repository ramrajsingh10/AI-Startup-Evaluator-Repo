"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/shared/dashboard-layout";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { meetings } from "@/lib/mock-data";
import { formatDate, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function MeetPage() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") || "1-on-1";
  const { toast } = useToast();
  
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [time, setTime] = React.useState<string | undefined>("10:00");
  const [meetingType, setMeetingType] = React.useState<"Voice" | "Video">("Video");

  const handleSchedule = () => {
    toast({
      title: "Meeting Scheduled!",
      description: "A calendar invite with a meeting link has been sent.",
    });
  };
  
  const handleAction = (action: string, title: string) => {
    toast({
        title: `Meeting ${action}`,
        description: `The meeting "${title}" has been ${action.toLowerCase()}.`
    })
  }

  const timeSlots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

  return (
    <DashboardLayout>
      <PageHeader
        title="Schedule a Meeting"
        description={
          mode === "Agent"
            ? "Schedule a call with our AI agent to generate your investment memo."
            : "Schedule a 1-on-1 call with a founder or investor."
        }
      />
      <div className="grid gap-8 md:grid-cols-5">
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>
                {mode === "Agent" ? "Schedule with AI Agent" : "Schedule 1-on-1"}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
                <div>
                    <Label className="mb-2 block">Select a Date</Label>
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border p-0"
                    />
                </div>
                <div className="space-y-4">
                    <div>
                        <Label>Select a Time</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            {timeSlots.map(slot => (
                                <Button 
                                    key={slot} 
                                    variant={time === slot ? "default" : "outline"}
                                    onClick={() => setTime(slot)}
                                >
                                    {slot}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <Label>Meeting Type</Label>
                        <RadioGroup defaultValue="Video" className="mt-2 flex gap-4" onValueChange={(value: "Voice" | "Video") => setMeetingType(value)}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Video" id="r-video" />
                                <Label htmlFor="r-video">Video Call</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Voice" id="r-voice" />
                                <Label htmlFor="r-voice">Voice Call</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full md:w-auto" onClick={handleSchedule}>Schedule Meeting</Button>
            </CardFooter>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
                <CardTitle>Meetings</CardTitle>
                <CardDescription>Your upcoming and past meetings.</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="space-y-4">
                    {meetings.map(meeting => (
                        <li key={meeting.id}>
                            <div className="flex items-start justify-between">
                               <div>
                                 <p className="font-semibold">{meeting.title}</p>
                                 <p className="text-sm text-muted-foreground">{formatDate(meeting.time, { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                               </div>
                               <Badge variant={meeting.status === 'Upcoming' ? 'default' : 'secondary'} className={cn(meeting.status === 'Upcoming' && 'bg-blue-500/20 text-blue-700 border-blue-500/30')}>{meeting.status}</Badge>
                            </div>
                            {meeting.status === 'Upcoming' && (
                                <div className="mt-2 flex gap-2">
                                    <Button size="sm" variant="outline" onClick={() => handleAction('Rescheduled', meeting.title)}>Reschedule</Button>
                                    <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleAction('Cancelled', meeting.title)}>Cancel</Button>
                                </div>
                            )}
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
