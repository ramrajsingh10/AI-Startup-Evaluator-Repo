'use server';

import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { startups } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, CartesianGrid, XAxis, YAxis, BarChart as ReBarChart, LabelList, Cell } from 'recharts';

const chartConfig = {
  views: {
    label: 'Views',
  },
  downloads: {
    label: 'Downloads',
    color: 'hsl(var(--chart-2))',
  },
  'Team Strength': {
    label: 'Team Strength',
    color: 'hsl(var(--chart-1))',
  },
  'Market Potential': {
    label: 'Market Potential',
    color: 'hsl(var(--chart-2))',
  },
  'Financial Viability': {
    label: 'Financial Viability',
    color: 'hsl(var(--chart-3))',
  },
  'Problem Significance': {
    label: 'Problem Significance',
    color: 'hsl(var(--chart-4))',
  },
  'Solution Uniqueness': {
    label: 'Solution Uniqueness',
    color: 'hsl(var(--chart-5))',
  },
} satisfies ChartConfig;

export default async function MemoPageContent({ id }: { id: string }) {
  const startup = startups.find(
    (startup) => startup.id === id
  );

  if (!startup) {
    notFound();
  }

  const chartData = [
    {
      name: 'Team Strength',
      value: startup.scores['Team Strength'],
      fill: 'var(--color-1)',
    },
    {
      name: 'Market Potential',
      value: startup.scores['Market Potential'],
      fill: 'var(--color-2)',
    },
    {
      name: 'Financial Viability',
      value: startup.scores['Financial Viability'],
      fill: 'var(--color-3)',
    },
    {
      name: 'Problem Significance',
      value: startup.scores['Problem Significance'],
      fill: 'var(--color-4)',
    },
    {
      name: 'Solution Uniqueness',
      value: startup.scores['Solution Uniqueness'],
      fill: 'var(--color-5)',
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title={startup.name}
        description={`by ${startup.founder}`}
      >
        <Button>
          <Eye className="w-4 h-4 mr-2" />
          Request full access
        </Button>
      </PageHeader>
      <div className="grid grid-cols-4 gap-4">
        <Card className="col-span-1">
          <CardHeader className="items-center">
            <Avatar className="w-32 h-32">
              <AvatarImage
                src={startup.logo}
                alt={startup.name}
              />
              <AvatarFallback>{startup.name[0]}</AvatarFallback>
            </Avatar>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-2">
            <h1 className="text-2xl font-bold">{startup.name}</h1>
            <p className="text-lg text-gray-500">{startup.founder}</p>
            <div className="flex flex-col gap-2 w-full mt-4">
              <div className="w-full">
                <p className="font-bold">Industry</p>
                <p>{startup.industry}</p>
              </div>
              <Separator />
              <div className="w-full">
                <p className="font-bold">Founded</p>
                <p>{startup.founded}</p>
              </div>
              <Separator />
              <div className="w-full">
                <p className="font-bold">Employees</p>
                <p>{startup.employees}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{startup.summary}</p>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Business Model</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{startup.businessModel}</p>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Funding History</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{startup.fundingHistory}</p>
            </CardContent>
          </Card>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Investment Memo</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{startup.memo}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="min-h-96 w-full"
          >
            <ReBarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{ left: 20, top: 20, right: 20, bottom: 20 }}
            >
              <CartesianGrid
                vertical={true}
                horizontal={false}
              />
              <YAxis
                dataKey="name"
                type="category"
                tickLine={true}
                tickMargin={10}
                axisLine={true}
                tickFormatter={(value) =>
                  chartConfig[value as keyof typeof chartConfig]?.label
                }
                className="capitalize"
              />
              <XAxis
                dataKey="value"
                type="number"
                hide
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value, name) => (
                      <>
                        <Badge
                          variant="outline"
                          className="capitalize"
                        >
                          {name}
                        </Badge>
                        <div className="flex items-end gap-2">
                          <span className="text-4xl font-bold tabular-nums">
                            {value as number}
                          </span>
                          <span className="text-muted-foreground">/ 100</span>
                        </div>
                      </>
                    )}
                  />
                }
              />
              <Bar
                dataKey="value"
                layout="vertical"
                radius={5}
              >
                <LabelList
                  dataKey="value"
                  position="right"
                  offset={10}
                  className="fill-foreground"
                  fontSize={12}
                />
                {chartData.map((item) => (
                  <Cell
                    key={item.name}
                    fill={item.fill}
                  />
                ))}
              </Bar>
            </ReBarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
