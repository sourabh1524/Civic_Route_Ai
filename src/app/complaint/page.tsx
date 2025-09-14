

'use client';

import { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/common/header';
import { Footer } from '@/components/common/footer';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  File,
  Mic,
  MessageSquare,
  UploadCloud,
  Bot,
  FileAudio,
  Loader2,
  Search,
  Trash2,
} from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';
import type { Complaint, SubmittedComplaint } from '@/lib/types';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';

import { useToast } from '@/hooks/use-toast';

export default function ComplaintPage() {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [submittedComplaint, setSubmittedComplaint] = useState<SubmittedComplaint | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [complaintToDelete, setComplaintToDelete] = useState<string | null>(null);

  useEffect(() => {
    const storedComplaints = JSON.parse(localStorage.getItem('complaints') || '[]');
    setComplaints(storedComplaints);
  }, []);

  const refreshComplaints = () => {
    const storedComplaints = JSON.parse(localStorage.getItem('complaints') || '[]');
    setComplaints(storedComplaints);
  };

  const handleDeleteComplaint = (id: string) => {
    const updatedComplaints = complaints.filter(c => c.id !== id);
    localStorage.setItem('complaints', JSON.stringify(updatedComplaints));
    setComplaints(updatedComplaints);
    setComplaintToDelete(null);
  };


  // Simple department routing logic
  const getDepartment = (category: string): string => {
    switch (category) {
      case 'Potholes':
        return 'Municipal Corporation';
      case 'Water Leakage':
        return 'Water Supply Authority';
      case 'Streetlight Outage':
        return 'Electricity Board';
      case 'Garbage Collection':
        return 'Municipal Corporation';
      default:
        return 'Municipal Corporation';
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const category = formData.get('category') as string;
    const location = formData.get('location') as string;
    const description = formData.get('description') as string;

    try {
      let department = getDepartment(category);
      
      // Try AI routing via API as fallback enhancement
      try {
        const response = await fetch('/api/route-complaint', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            complaintText: description,
            complaintCategory: category,
            location: location,
          }),
        });
        
        if (response.ok) {
          const aiResult = await response.json();
          department = aiResult.department;
        }
      } catch (aiError) {
        console.log('AI routing failed, using fallback department:', department);
      }

      const newCaseId = `CMPT-${Math.floor(1000 + Math.random() * 9000)}`;
      const isPriority = Math.random() > 0.8;
      const newComplaintData: Complaint = {
        id: newCaseId,
        category: category || 'Other',
        date: new Date().toISOString().split('T')[0],
        status: 'Submitted',
        department: department,
        isPriority: isPriority,
      };

      setSubmittedComplaint({
        id: newComplaintData.id,
        category: newComplaintData.category,
        status: newComplaintData.status,
        isPriority: newComplaintData.isPriority,
      });

      const existingComplaints = JSON.parse(localStorage.getItem('complaints') || '[]');
      localStorage.setItem('complaints', JSON.stringify([newComplaintData, ...existingComplaints]));

      setShowSuccessDialog(true);
      refreshComplaints();
      (event.target as HTMLFormElement).reset();

      toast({
        title: "Complaint Submitted Successfully!",
        description: `Your complaint ID is ${newCaseId}. We'll keep you updated on the progress.`,
      });

    } catch (error) {
      console.error("Failed to submit complaint:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your complaint. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogClose = () => {
    setShowSuccessDialog(false);
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

  const filteredComplaints = useMemo(() => {
    if (!searchQuery) {
      return complaints;
    }
    return complaints.filter(
      (complaint) =>
        complaint.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        complaint.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [complaints, searchQuery]);


  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">
                Submit Your Complaint
              </CardTitle>
              <CardDescription className="text-center text-lg">
                Choose your preferred method to file a complaint. We are here to
                help.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="web-form" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="web-form">
                    <File className="mr-2 h-4 w-4" /> Web Form
                  </TabsTrigger>
                  <TabsTrigger value="voice-call">
                    <Mic className="mr-2 h-4 w-4" /> Voice Complaint
                  </TabsTrigger>
                  <TabsTrigger value="whatsapp">
                    <MessageSquare className="mr-2 h-4 w-4" /> WhatsApp
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="web-form" className="mt-6">
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <Label htmlFor="full-name">Full Name</Label>
                        <Input
                          id="full-name"
                          name="fullName"
                          placeholder="Enter your full name"
                          required
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          name="email"
                          placeholder="name@example.com"
                          required
                        />
                      </div>
                       <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="flex items-center">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-background text-sm text-muted-foreground h-10">
                            +91
                          </span>
                          <Input
                            id="phone"
                            type="tel"
                            name="phone"
                            placeholder="Enter your 10-digit phone number"
                            className="rounded-l-none"
                            maxLength={10}
                            pattern="\d{10}"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Complaint Category</Label>
                      <Select required name="category" defaultValue="">
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Potholes">Potholes</SelectItem>
                          <SelectItem value="Water Leakage">
                            Water Leakage
                          </SelectItem>
                          <SelectItem value="Streetlight Outage">
                            Streetlight Outage
                          </SelectItem>
                          <SelectItem value="Garbage Collection">
                            Garbage Collection
                          </SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        name="location"
                        placeholder="e.g., Near City Park, Main Street"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Complaint Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Please describe the issue in detail."
                        rows={5}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="attachment">
                        Attach Files (Image or Document)
                      </Label>
                      <div className="flex items-center justify-center w-full">
                        <Label
                          htmlFor="attachment-input"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground">
                              <span className="font-semibold">
                                Click to upload
                              </span>{' '}
                              or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">
                              PNG, JPG, PDF (MAX. 10MB)
                            </p>
                          </div>
                          <Input
                            id="attachment-input"
                            name="attachment"
                            type="file"
                            className="hidden"
                          />
                        </Label>
                      </div>
                    </div>
                    <Button type="submit" className="w-full font-bold text-lg" disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
                    </Button>
                  </form>
                </TabsContent>
                <TabsContent value="voice-call" className="mt-6">
                  <div className="space-y-6">
                    <div className="text-center">
                      <Mic className="mx-auto h-12 w-12 text-primary mb-4" />
                      <h3 className="text-xl font-bold mb-2">
                        Submit a Voice Complaint
                      </h3>
                      <p className="text-muted-foreground">
                        Record your complaint and upload the audio file. Our AI
                        will transcribe and process it.
                      </p>
                    </div>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="voice-full-name">Full Name</Label>
                        <Input
                          id="voice-full-name"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="voice-email">Email Address</Label>
                        <Input
                          id="voice-email"
                          type="email"
                          placeholder="name@example.com"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="audio-upload">
                          Upload Audio File
                        </Label>
                        <div className="flex items-center justify-center w-full">
                          <Label
                            htmlFor="audio-upload-input"
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80"
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <FileAudio className="w-10 h-10 mb-3 text-muted-foreground" />
                              <p className="mb-2 text-sm text-muted-foreground">
                                <span className="font-semibold">
                                  Click to upload
                                </span>{' '}
                                or drag and drop
                              </p>
                              <p className="text-xs text-muted-foreground">
                                MP3, WAV, M4A (MAX. 15MB)
                              </p>
                            </div>
                            <Input
                              id="audio-upload-input"
                              type="file"
                              className="hidden"
                              accept="audio/*"
                              required
                            />
                          </Label>
                        </div>
                      </div>
                      <Button
                        type="submit"
                        className="w-full font-bold text-lg"
                      >
                        Submit Voice Complaint
                      </Button>
                    </form>
                  </div>
                </TabsContent>
                <TabsContent value="whatsapp" className="mt-6">
                  <div className="text-center p-8 border-2 border-dashed rounded-lg">
                    <Bot className="mx-auto h-12 w-12 text-primary mb-4" />
                    <h3 className="text-xl font-bold mb-2">
                      Use our WhatsApp Chatbot
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Start a conversation with our AI-powered chatbot on
                      WhatsApp. You can send text and images to file your
                      complaint quickly and easily.
                    </p>
                    <Button asChild>
                      <a
                        href="https://wa.me/1234567890?text=I%20want%20to%20file%20a%20complaint"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageSquare className="mr-2 h-5 w-5" /> Start Chat
                      </a>
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-3xl font-bold">
                            Your Submissions
                        </CardTitle>
                        <CardDescription>
                            Track the status of your submitted complaints.
                        </CardDescription>
                    </div>
                </div>
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search by Complaint ID or keyword..."
                    className="pl-10 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Complaint ID</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Date Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredComplaints.length > 0 ? (
                    filteredComplaints.map((complaint) => (
                      <TableRow key={complaint.id}>
                        <TableCell className="font-medium">
                          {complaint.id}
                        </TableCell>
                        <TableCell>{complaint.category}</TableCell>
                        <TableCell>{complaint.department}</TableCell>
                        <TableCell>{complaint.date}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(complaint.status)}>
                            {complaint.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                           <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  onClick={() => setComplaintToDelete(complaint.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              {complaintToDelete === complaint.id && (
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete this complaint
                                      and remove its data from our servers.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => setComplaintToDelete(null)}>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteComplaint(complaint.id)}>
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              )}
                            </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No complaints found.
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
      <ConfirmationDialog
        isOpen={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        complaint={submittedComplaint}
      />
    </div>
  );
}
