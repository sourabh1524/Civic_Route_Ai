
'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Inbox,
  Search,
  ChevronDown,
  MoreHorizontal,
  PieChart as PieChartIcon,
  AreaChart,
  Calendar
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import type { Complaint } from '@/lib/types';
import { Header } from '@/components/common/header';
import { Footer } from '@/components/common/footer';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { subDays, format, parseISO } from 'date-fns';

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const staticComplaints: Complaint[] = [
    { id: 'CMPT-1234', category: 'Potholes', date: '2024-07-28', status: 'In Progress', department: 'Municipal Corporation', isPriority: true },
    { id: 'CMPT-5678', category: 'Water Leakage', date: '2024-07-27', status: 'Resolved', department: 'Water Supply Authority' },
    { id: 'CMPT-9012', category: 'Streetlight Outage', date: '2024-07-26', status: 'Submitted', department: 'Electricity Board' },
    { id: 'CMPT-3456', category: 'Garbage Collection', date: '2024-07-25', status: 'Rejected', department: 'Municipal Corporation' },
  ];

  useEffect(() => {
    try {
      const localComplaints: Complaint[] = JSON.parse(localStorage.getItem('complaints') || '[]');
      const allComplaints = [...staticComplaints, ...localComplaints];
      // Remove duplicates
      const uniqueComplaints = allComplaints.filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i)
      setComplaints(uniqueComplaints);
    } catch (error) {
      setComplaints(staticComplaints);
    }
  }, []);

  const summaryStats = useMemo(() => {
    return {
      total: complaints.length,
      submitted: complaints.filter((c) => c.status === 'Submitted').length,
      inProgress: complaints.filter((c) => c.status === 'In Progress').length,
      resolved: complaints.filter((c) => c.status === 'Resolved').length,
      rejected: complaints.filter((c) => c.status === 'Rejected').length
    };
  }, [complaints]);

  const pieChartData = useMemo(() => {
    const categoryCounts: { [key: string]: number } = {};
    complaints.forEach(complaint => {
      categoryCounts[complaint.category] = (categoryCounts[complaint.category] || 0) + 1;
    });
    return Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));
  }, [complaints]);

  const trendData = useMemo(() => {
    const last30Days = new Map<string, number>();
    for (let i = 29; i >= 0; i--) {
        const date = format(subDays(new Date(), i), 'MMM d');
        last30Days.set(date, 0);
    }
    complaints.forEach(c => {
        const complaintDate = parseISO(c.date);
        if (complaintDate >= subDays(new Date(), 30)) {
            const formattedDate = format(complaintDate, 'MMM d');
            if (last30Days.has(formattedDate)) {
                last30Days.set(formattedDate, last30Days.get(formattedDate)! + 1);
            }
        }
    });
    return Array.from(last30Days.entries()).map(([date, count]) => ({ date, count }));
  }, [complaints]);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];


  const filteredComplaints = useMemo(() => {
    let filtered = complaints;

    if (statusFilter !== 'All') {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (c) =>
          c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.department.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [complaints, searchQuery, statusFilter]);

  const getStatusVariant = (status: Complaint['status']) => {
    switch (status) {
      case 'Resolved':
        return 'default';
      case 'In Progress':
        return 'secondary';
      case 'Rejected':
        return 'destructive';
      case 'Submitted':
      default:
        return 'outline';
    }
  };

  const summaryCards = [
    {
      title: 'Total Complaints',
      value: summaryStats.total,
      icon: <Inbox className="h-6 w-6 text-muted-foreground" />,
    },
    {
      title: 'Submitted',
      value: summaryStats.submitted,
      icon: <Clock className="h-6 w-6 text-muted-foreground" />,
    },
    {
      title: 'In Progress',
      value: summaryStats.inProgress,
      icon: <FileText className="h-6 w-6 text-muted-foreground" />,
    },
    {
      title: 'Resolved',
      value: summaryStats.resolved,
      icon: <CheckCircle className="h-6 w-6 text-muted-foreground" />,
    },
     {
      title: 'Rejected',
      value: summaryStats.rejected,
      icon: <XCircle className="h-6 w-6 text-muted-foreground" />,
    },
  ];

  return (
    <div className="flex flex-col min-h-dvh bg-muted/20">
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold font-headline mb-8">Admin Dashboard</h1>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-8">
            {summaryCards.map((card) => (
                <Card key={card.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                        {card.icon}
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{card.value}</div>
                    </CardContent>
                </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
             <Card className="lg:col-span-2">
                <CardHeader>
                    <div className="flex items-center gap-2">
                      <AreaChart className="h-6 w-6" />
                      <CardTitle>Complaint Trends</CardTitle>
                    </div>
                    <CardDescription>Number of complaints submitted in the last 30 days.</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                   <ResponsiveContainer width="100%" height={350}>
                       <LineChart data={trendData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                          <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--background))',
                                borderColor: 'hsl(var(--border))',
                            }}
                           />
                          <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                       </LineChart>
                    </ResponsiveContainer>
                </CardContent>
             </Card>
             <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                     <PieChartIcon className="h-6 w-6" />
                     <CardTitle>By Category</CardTitle>
                  </div>
                  <CardDescription>A breakdown of complaints by their type.</CardDescription>
                </CardHeader>
                <CardContent>
                   <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                          <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                                const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                                return (
                                <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
                                    {`${(percent * 100).toFixed(0)}%`}
                                </text>
                                );
                            }}
                          >
                            {pieChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--background))',
                                borderColor: 'hsl(var(--border))',
                            }}
                          />
                          <Legend wrapperStyle={{fontSize: "14px"}}/>
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
             </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                 <div>
                    <CardTitle>All Complaints</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Manage and track all citizen complaints.</p>
                 </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            placeholder="Search by ID, category..."
                            className="pl-10 w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex-shrink-0">
                                Status: {statusFilter} <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => setStatusFilter('All')}>All</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setStatusFilter('Submitted')}>Submitted</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setStatusFilter('In Progress')}>In Progress</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setStatusFilter('Resolved')}>Resolved</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setStatusFilter('Rejected')}>Rejected</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Complaint ID</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredComplaints.length > 0 ? (
                    filteredComplaints.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-mono">{c.id}</TableCell>
                        <TableCell>{c.category}</TableCell>
                        <TableCell>{c.department}</TableCell>
                        <TableCell>{c.date}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(c.status)}>
                            {c.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                           <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>View Details</DropdownMenuItem>
                                    <DropdownMenuItem>Assign Department</DropdownMenuItem>
                                    <DropdownMenuItem>Update Status</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-500">Reject</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <p className="font-semibold mb-2">No Complaints Found</p>
                        <p className="text-muted-foreground">Try adjusting your search or filter.</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
