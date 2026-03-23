import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Video, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface TestimonialVideo {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string | null;
  status: string;
  created_at: string;
}

const emptyForm = { title: "", description: "", video_url: "", thumbnail_url: "", status: "draft" };

const TestimonialsAdmin = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState<TestimonialVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<TestimonialVideo | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchVideos = async () => {
    const { data } = await supabase
      .from("testimonial_videos")
      .select("*")
      .order("created_at", { ascending: false });
    setVideos((data as TestimonialVideo[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchVideos(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (v: TestimonialVideo) => {
    setEditing(v);
    setForm({ title: v.title, description: v.description, video_url: v.video_url, thumbnail_url: v.thumbnail_url || "", status: v.status });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.video_url.trim()) {
      toast.error("Le titre et l'URL vidéo sont obligatoires");
      return;
    }
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      video_url: form.video_url.trim(),
      thumbnail_url: form.thumbnail_url.trim() || null,
      status: form.status,
      created_by: user?.id || null,
    };

    if (editing) {
      const { error } = await supabase.from("testimonial_videos").update(payload).eq("id", editing.id);
      if (error) { toast.error(error.message); } else { toast.success("Vidéo mise à jour"); }
    } else {
      const { error } = await supabase.from("testimonial_videos").insert(payload);
      if (error) { toast.error(error.message); } else { toast.success("Vidéo ajoutée"); }
    }
    setSaving(false);
    setDialogOpen(false);
    fetchVideos();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette vidéo ?")) return;
    const { error } = await supabase.from("testimonial_videos").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Vidéo supprimée"); fetchVideos(); }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Video className="h-6 w-6 text-primary" /> Témoignages Vidéo
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Gérez les témoignages vidéo du site</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" /> Ajouter
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Video className="h-12 w-12 mx-auto mb-4 opacity-40" />
          <p>Aucune vidéo pour le moment</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {videos.map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="font-medium max-w-xs truncate">{v.title}</TableCell>
                  <TableCell>
                    <Badge variant={v.status === "published" ? "default" : "secondary"}>
                      {v.status === "published" ? "Publié" : "Brouillon"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(v.created_at).toLocaleDateString("fr-FR")}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(v)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(v.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Modifier la vidéo" : "Ajouter une vidéo"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Titre *</label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Titre du témoignage" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">URL Vidéo * (YouTube ou lien direct)</label>
              <Input value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} placeholder="https://youtube.com/watch?v=..." />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">URL Miniature (optionnel)</label>
              <Input value={form.thumbnail_url} onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })} placeholder="https://..." />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Description</label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Description du témoignage" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Statut</label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="published">Publié</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {editing ? "Enregistrer" : "Ajouter"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default TestimonialsAdmin;
