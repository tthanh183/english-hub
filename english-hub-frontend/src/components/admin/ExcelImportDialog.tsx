import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { DialogHeader } from '../ui/dialog';
import { Download, FileSpreadsheet, Upload } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

type ExcelImportDialogProps = {
  isImportDialogOpen: boolean;
  setIsImportDialogOpen: (open: boolean) => void;
};

export default function ExcelImportDialog({
  isImportDialogOpen,
  setIsImportDialogOpen,
}: ExcelImportDialogProps) {
  return (
    <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Import Questions from Excel</DialogTitle>
          <DialogDescription>
            Upload an Excel file to import questions for this exam.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 text-center">
            <FileSpreadsheet className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">Upload Questions Excel File</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop your Excel file here, or click to browse
            </p>
            <Input
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              id="question-file-upload"
            />
            <label htmlFor="question-file-upload">
              <Button variant="outline" className="cursor-pointer">
                <Upload className="mr-2 h-4 w-4" />
                Select File
              </Button>
            </label>
          </div>
          <div className="flex justify-between items-center">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download Template
            </Button>
            <Button size="sm">Upload and Process</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
