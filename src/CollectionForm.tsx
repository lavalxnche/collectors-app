import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { FileUploader } from "@aws-amplify/ui-react-storage";
import "@aws-amplify/ui-react/styles.css";

export type CollectionFormFields = {
  title: string;
  description?: string;
  // file: File;
  // key?: string;
  filename?: string;
};

type CollectionFormProps = {
  open: boolean;
  handleClose: (data: CollectionFormFields | null) => void;
  userId: string;
};

const processFile = (key: string, file: File, userId: string) => {
  const newKey = `pictures/${userId}-${key}`;
  return { key: newKey, file };
};

export function CollectionForm({ open, handleClose, userId }: CollectionFormProps) {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  // const [uploadedFile, setUploadedFile] = React.useState<File | null>(null);
  // const [uploadKey, setUploadKey] = React.useState("");
  const [uploadedFilename, setUploadedFilename] = React.useState("");


  const handleSubmit = () => {
    if (!title || !uploadedFilename) {
      alert("Please enter a title and upload an image.");
      return;
    }

    handleClose({
      title: title,
      description,
      // file: uploadedFile,
      // key: uploadKey,
      filename: uploadedFilename,
    });
  };

  return (
    <Dialog open={open} onClose={() => handleClose(null)}>
      <DialogTitle>Add Your Collection</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Enter details for your new collection and upload an image.
        </DialogContentText>

        <TextField
          autoFocus
          required
          margin="dense"
          id="title"
          label="Title"
          type="text"
          fullWidth
          variant="standard"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          margin="dense"
          id="description"
          label="Description (optional)"
          type="text"
          fullWidth
          variant="standard"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mb: 2 }}
        />

        <FileUploader
          acceptedFileTypes={["image/*"]}
          path="pictures/"
          maxFileCount={1}
          isResumable
          processFile={({ key, file }: { key: string; file: File }) =>
            processFile(key, file, userId)
          }
          onUploadSuccess={({ key }) => {
            // setUploadedFile(key);
            if (key) setUploadedFilename(key);
          }}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={() => handleClose(null)}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
}
