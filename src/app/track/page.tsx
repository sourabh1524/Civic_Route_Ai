
'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/common/header';
import { Footer } from '@/components/common/footer';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { Complaint } from '@/lib/types';
import { Search, Smartphone, MessageSquare, Phone } from 'lucide-react';
import Link from 'next/link';

export default function TrackComplaintPage() {
  const [trackingId, setTrackingId] = useState('');
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [error, setError] = useState('');

  const handleTrack = () => {
    if (!trackingId) {
      setError('Please enter a valid tracking ID.');
      setComplaint(null);
      return;
    }

    const storedComplaints: Complaint[] = JSON.parse(localStorage.getItem('complaints') || '[]');
    const foundComplaint = storedComplaints.find(c => c.id.toLowerCase() === trackingId.toLowerCase());

    if (foundComplaint) {
      setComplaint(foundComplaint);
      setError('');
    } else {
      setComplaint(null);
      setError('No complaint found with this ID. Please check the ID and try again.');
    }
  };
  
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

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1 py-12 px-4 bg-muted/20">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-headline">Track Your Complaint</h1>
            <p className="text-lg text-muted-foreground mt-2">
              Monitor the status of your complaint in real-time with a unique tracking ID.
            </p>
          </div>

          <Card className="max-w-2xl mx-auto shadow-lg">
            <CardHeader>
              <CardTitle>Enter Your Complaint Tracking ID</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <div className="relative flex-grow">
                   <Input
                    type="text"
                    placeholder="e.g., CMPT-1234"
                    className="pl-4 pr-12 h-12 text-lg"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
                  />
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                </div>
                <Button onClick={handleTrack} className="h-12 text-lg px-6 font-bold">Track</Button>
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </CardContent>
          </Card>

          {complaint && (
            <Card className="mt-8 animate-in fade-in-50">
              <CardHeader>
                <CardTitle className="text-2xl">Complaint Details</CardTitle>
                 <CardDescription>Status for Complaint ID: <span className="font-mono text-primary">{complaint.id}</span></CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Category</p>
                  <p className="font-semibold">{complaint.category}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Date Submitted</p>
                  <p className="font-semibold">{complaint.date}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Assigned Department</p>
                  <p className="font-semibold">{complaint.department}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge variant={getStatusVariant(complaint.status)} className="text-base">{complaint.status}</Badge>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mt-16">
            <h3 className="text-2xl font-bold text-center mb-4">Real-time Updates</h3>
            <p className="text-center text-muted-foreground mb-8 max-w-xl mx-auto">
              Stay informed about your complaint's progress through multiple channels.
              Citizens can check status by voice, text, or the app.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <Link href="/voice-status" className="flex flex-col items-center">
                <Phone className="h-10 w-10 mb-4 text-primary" />
                <h4 className="font-bold text-lg">Voice</h4>
                <p className="text-muted-foreground">Call our hotline to get automated voice updates.</p>
              </Link>
              <div className="flex flex-col items-center">
                <MessageSquare className="h-10 w-10 mb-4 text-primary" />
                <h4 className="font-bold text-lg">Text/SMS</h4>
                <p className="text-muted-foreground">Receive SMS notifications at key stages of resolution.</p>
              </div>
              <div className="flex flex-col items-center">
                <Smartphone className="h-10 w-10 mb-4 text-primary" />
                <h4 className="font-bold text-lg">App</h4>
                <p className="text-muted-foreground">Use this portal for the most detailed, up-to-the-minute information.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

