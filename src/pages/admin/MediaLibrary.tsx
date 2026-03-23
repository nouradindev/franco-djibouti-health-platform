import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Image } from "lucide-react";

const MediaLibrary = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Médiathèque</h1>
            <p className="text-sm text-muted-foreground mt-1">Gérez vos images et fichiers</p>
          </div>
          <Button className="gap-2">
            <Upload className="h-4 w-4" /> Uploader un fichier
          </Button>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Image className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground">Médiathèque vide</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Uploadez des images et des documents pour les utiliser dans vos pages.
            </p>
            <Button className="mt-4 gap-2">
              <Upload className="h-4 w-4" /> Uploader votre premier fichier
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default MediaLibrary;
