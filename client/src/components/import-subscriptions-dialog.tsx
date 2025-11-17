import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload, FileSpreadsheet, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ImportResult {
  success: number;
  failed: number;
  errors: string[];
}

export function ImportSubscriptionsDialog() {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const importMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/subscriptions/import", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to import subscriptions");
      }

      return response.json() as Promise<ImportResult>;
    },
    onSuccess: (result) => {
      setImportResult(result);
      
      if (result.success > 0) {
        queryClient.invalidateQueries({ queryKey: ["/api/subscriptions"] });
        toast({
          title: "Import completed",
          description: `Successfully imported ${result.success} subscription${result.success !== 1 ? 's' : ''}`,
        });
      }

      if (result.failed > 0) {
        toast({
          title: "Some imports failed",
          description: `${result.failed} subscription${result.failed !== 1 ? 's' : ''} could not be imported`,
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      console.error("Import error:", error);
      toast({
        title: "Import failed",
        description: error.message || "An unexpected error occurred during import",
        variant: "destructive",
      });
      setImportResult({
        success: 0,
        failed: 0,
        errors: [error.message || "Unknown error occurred"],
      });
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ".xlsx",
        ".xls",
      ];
      const isValidType = validTypes.some(
        (type) => file.type === type || file.name.endsWith(type)
      );

      if (!isValidType) {
        toast({
          title: "Invalid file type",
          description: "Please select an Excel file (.xlsx or .xls)",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      setImportResult(null);
    }
  };

  const handleImport = () => {
    if (selectedFile) {
      importMutation.mutate(selectedFile);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFile(null);
    setImportResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Upload className="h-4 w-4 mr-2" />
          Import from Excel
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Import Subscriptions from Excel</DialogTitle>
          <DialogDescription>
            Upload an Excel file (.xlsx or .xls) with your subscription data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* File Upload Section */}
          <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <FileSpreadsheet className="h-12 w-12 text-muted-foreground" />
            
            {selectedFile ? (
              <div className="text-center space-y-2">
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center">
                No file selected
              </p>
            )}
            
            <Button onClick={handleBrowse} variant="secondary">
              Browse Files
            </Button>
          </div>

          {/* Expected Format Info */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <strong>Required:</strong> Tool Name, Subscription Expiry Date<br/>
              <strong>Optional:</strong> Subscription Cost, Type, Notes, Pro's, Con's, Status, How I'm Using It, Related Projects, Official Website, Recommendation Score
            </AlertDescription>
          </Alert>

          {/* Import Results */}
          {importResult && (
            <div className="space-y-3">
              <div className="flex items-center gap-4 text-sm">
                {importResult.success > 0 && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{importResult.success} imported</span>
                  </div>
                )}
                {importResult.failed > 0 && (
                  <div className="flex items-center gap-2 text-red-600">
                    <XCircle className="h-4 w-4" />
                    <span>{importResult.failed} failed</span>
                  </div>
                )}
              </div>

              {importResult.errors.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Errors:</p>
                  <ScrollArea className="h-32 rounded border p-2">
                    <div className="space-y-1">
                      {importResult.errors.map((error, index) => (
                        <p key={index} className="text-xs text-red-600">
                          {error}
                        </p>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            {importResult ? "Close" : "Cancel"}
          </Button>
          {!importResult && (
            <Button
              onClick={handleImport}
              disabled={!selectedFile || importMutation.isPending}
            >
              {importMutation.isPending ? "Importing..." : "Import"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
