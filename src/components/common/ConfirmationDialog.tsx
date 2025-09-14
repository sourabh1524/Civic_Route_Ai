
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { SubmittedComplaint } from "@/lib/types";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { CategoryIcon } from "./CategoryIcon";

interface ConfirmationDialogProps {
  complaint: SubmittedComplaint | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConfirmationDialog({ complaint, isOpen, onOpenChange }: ConfirmationDialogProps) {
  if (!complaint) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
            <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
          <DialogTitle className="text-center text-2xl">Submission Successful!</DialogTitle>
          <DialogDescription className="text-center">
            Your grievance has been received. You can track its status using the Case ID.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 px-6 my-4 rounded-lg bg-muted/50">
            <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Case ID</span>
                <span className="text-sm font-mono font-semibold">{complaint.id}</span>
            </div>
             <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Category</span>
                <div className="flex items-center gap-2">
                   <CategoryIcon category={complaint.category} className="h-4 w-4" />
                   <span className="text-sm font-semibold">{complaint.category}</span>
                </div>
            </div>
             <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status</span>
                {complaint.isPriority ? (
                    <Badge variant="destructive" className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" /> High Priority
                    </Badge>
                ) : (
                    <Badge variant="outline">{complaint.status}</Badge>
                )}
            </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="w-full">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
