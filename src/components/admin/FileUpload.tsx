import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Upload, X, FileText, Image, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface FileUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  folder: string;
  accept?: string;
  label?: string;
}

const FileUpload = ({ value, onChange, folder, accept = "image/*,application/pdf", label = "Fichier" }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Le fichier ne doit pas dépasser 10 Mo");
      return;
    }

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${folder}/${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage.from("media").upload(path, file);
    if (error) {
      toast.error("Erreur lors de l'upload");
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from("media").getPublicUrl(path);
    onChange(publicUrl);
    setUploading(false);
    toast.success("Fichier uploadé");
  };

  const remove = () => {
    onChange(null);
  };

  const isImage = value?.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i);
  const isPdf = value?.match(/\.pdf(\?|$)/i);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      {value ? (
        <div className="relative rounded-lg border border-border p-3 bg-muted/30">
          <div className="flex items-center gap-3">
            {isImage ? (
              <img src={value} alt="" className="w-16 h-16 object-cover rounded-md" />
            ) : (
              <div className="w-16 h-16 rounded-md bg-primary/10 flex items-center justify-center">
                {isPdf ? <FileText className="h-6 w-6 text-primary" /> : <Image className="h-6 w-6 text-primary" />}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground truncate">{value.split("/").pop()}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={remove} className="text-destructive shrink-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mx-auto" />
          ) : (
            <>
              <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Cliquez pour sélectionner un fichier</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Images ou PDF · Max 10 Mo</p>
            </>
          )}
        </div>
      )}
      <input ref={inputRef} type="file" accept={accept} onChange={upload} className="hidden" />
    </div>
  );
};

export default FileUpload;
