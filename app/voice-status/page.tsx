
'use client';

import { useState } from 'react';
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
import { Search, Mic, Loader2, Volume2, AlertCircle } from 'lucide-react';
import { getComplaintStatus, GetComplaintStatusOutput } from '@/ai/flows/get-complaint-status';
import { useToast } from '@/hooks/use-toast';

export default function VoiceStatusPage() {
  const [trackingId, setTrackingId] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [statusResult, setStatusResult] = useState<GetComplaintStatusOutput | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const { toast } = useToast();

  const handleMicClick = () => {
    if (!('webkitSpeechRecognition' in window)) {
        toast({
            title: "Browser Not Supported",
            description: "Speech recognition is not supported in your browser. Please use Google Chrome.",
            variant: "destructive",
        });
        return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
      toast({
          title: "Speech Recognition Error",
          description: "Could not understand your speech. Please try again.",
          variant: "destructive",
      });
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      // Very basic parsing for a complaint ID. A more robust solution would use regex.
      const foundId = transcript.toUpperCase().split(' ').find((s:string) => s.startsWith('CMPT'));
      if (foundId) {
        setTrackingId(foundId);
        handleTrack(foundId);
      } else {
        toast({
            title: "Complaint ID Not Found",
            description: "Could not find a complaint ID in your speech. Please say something like 'Check status for CMPT-1234'.",
            variant: "destructive",
        });
      }
    };

    recognition.start();
  };


  const handleTrack = async (id: string) => {
    if (!id) {
      toast({
        title: "Missing ID",
        description: 'Please enter a valid tracking ID.',
        variant: 'destructive',
      });
      return;
    }

    setIsFetching(true);
    setStatusResult(null);
    setAudioUrl(null);
    try {
      const result = await getComplaintStatus({ trackingId: id });
      setStatusResult(result);
      if(result.audioResponse) {
          setAudioUrl(result.audioResponse);
          const audio = new Audio(result.audioResponse);
          audio.play();
      }
    } catch (e: any) {
       toast({
        title: "Error Fetching Status",
        description: e.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsFetching(false);
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
            <h1 className="text-4xl md:text-5xl font-bold font-headline">Check Status by Voice</h1>
            <p className="text-lg text-muted-foreground mt-2">
              Use your voice to ask for the status of your complaint.
            </p>
          </div>

          <Card className="max-w-2xl mx-auto shadow-lg">
            <CardHeader>
              <CardTitle>Say Your Complaint Tracking ID</CardTitle>
              <CardDescription>
                Click the microphone and say your tracking ID, for example, "Check status for CMPT-1234". You can also type it below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button onClick={handleMicClick} size="icon" className="h-12 w-12" disabled={isRecording || isFetching}>
                    <Mic className={`h-6 w-6 ${isRecording ? 'text-red-500 animate-pulse' : ''}`} />
                </Button>
                <div className="relative flex-grow">
                   <Input
                    type="text"
                    placeholder="e.g., CMPT-1234"
                    className="pl-4 pr-12 h-12 text-lg"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleTrack(trackingId)}
                    disabled={isFetching}
                  />
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                </div>
                <Button onClick={() => handleTrack(trackingId)} className="h-12 text-lg px-6 font-bold" disabled={isFetching}>
                    {isFetching ? <Loader2 className="animate-spin" /> : "Track"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {isFetching && (
            <div className="text-center mt-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                <p className="text-muted-foreground mt-2">Checking status...</p>
            </div>
          )}

          {statusResult && (
            <Card className="mt-8 animate-in fade-in-50">
              <CardHeader>
                 <CardTitle className="text-2xl flex items-center justify-between">
                    <span>Complaint Status</span>
                    {audioUrl && <Button variant="outline" size="icon" onClick={() => new Audio(audioUrl).play()}><Volume2/></Button>}
                 </CardTitle>
                 <CardDescription>Status for Complaint ID: <span className="font-mono text-primary">{statusResult.complaint.id}</span></CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                  <p className="text-lg">{statusResult.statusMessage}</p>
                   <div className="grid gap-4 md:grid-cols-2 pt-4 border-t">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Category</p>
                      <p className="font-semibold">{statusResult.complaint.category}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Date Submitted</p>
                      <p className="font-semibold">{statusResult.complaint.date}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Assigned Department</p>
                      <p className="font-semibold">{statusResult.complaint.department}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                      <Badge variant={getStatusVariant(statusResult.complaint.status)} className="text-base">{statusResult.complaint.status}</Badge>
                    </div>
                </div>
              </CardContent>
            </Card>
          )}

          {!isFetching && !statusResult && (
             <Card className="mt-8 text-center py-12">
                <CardContent>
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold">Awaiting Input</h3>
                    <p className="text-muted-foreground mt-2">Enter or say a complaint ID to check its status.</p>
                </CardContent>
             </Card>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}

