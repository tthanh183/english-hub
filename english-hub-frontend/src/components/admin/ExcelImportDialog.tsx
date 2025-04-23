import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { DialogHeader } from '../ui/dialog';
import { Download, Folder, Upload } from 'lucide-react';
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
  const handleFolderUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const excelFile = Array.from(files).find(
      file => file.name.endsWith('.xlsx') || file.name.endsWith('.xls')
    );
    const imageFolders = Array.from(files).filter(file =>
      file.type.startsWith('image/')
    );

    console.log('Excel File:', excelFile);
    console.log('Image Files:', imageFolders);

    // Process the files as needed
  };

  return (
    <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Import Questions from Folder</DialogTitle>
          <DialogDescription>
            Upload a folder containing an Excel file and images for this exam.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 text-center">
            <Folder className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">Upload Folder</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop your folder here, or click to browse
            </p>
            <Input
              type="file"
              webkitdirectory="true"
              directory="true"
              multiple
              className="hidden"
              id="folder-upload"
              onChange={handleFolderUpload}
            />
            <label htmlFor="folder-upload">
              <Button variant="outline" className="cursor-pointer">
                <Upload className="mr-2 h-4 w-4" />
                Select Folder
              </Button>
            </label>
          </div>
          <div className="flex justify-between items-center">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download Template
            </Button>
            <Button size="sm">Process Folder</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
