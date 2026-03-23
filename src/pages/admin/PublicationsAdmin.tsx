import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Pencil, Trash2, Loader2, Eye, EyeOff, Calendar, Tag, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import FileUpload from "@/components/admin/FileUpload";

interface Publication {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  published_date: string | null;
  file_url: string | null;
  image_url: string | null;
  created_at: string;
}

const emptyForm = { title: "", description: "", category: "", status: "draft", published_date: "", file_url: null as string | null, image_url: null as string | null };

const PublicationsAdmin = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Publication | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: publications = [], isLoading } = useQuery({
    queryKey: ["admin-publications"],
    queryFn: async () => {
      const { data, error } = await supabase.from("publications").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Publication[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = { ...form, published_date: form.published_date || null, file_url: form.file_url || null, image_url: form.image_url || null };
      if (editing) {
        const { error } = await supabase.from("publications").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("publications").insert({ ...payload, created_by: user?.id });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-publications"] });
      toast.success(editing ? "Publication mise à jour" : "Publication créée");
      closeDialog();
    },
    onError: () => toast.error("Une erreur est survenue"),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, newStatus }: { id: string; newStatus: string }) => {
      const { error } = await supabase.from("publications").update({ status: newStatus }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, { newStatus }) => {
      queryClient.invalidateQueries({ queryKey: ["admin-publications"] });
      toast.success(newStatus === "published" ? "Publication publiée" : "Publication dépubliée");
    },
    onError: () => toast.error("Erreur lors du changement de statut"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("publications").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-publications"] });
      toast.success("Publication supprimée");
      setDeleteId(null);
    },
    onError: () => toast.error("Erreur lors de la suppression"),
  });

  const openCreate = () => { setEditing(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (p: Publication) => { setEditing(p); setForm({ title: p.title, description: p.description, category: p.category, status: p.status, published_date: p.published_date || "", file_url: p.file_url, image_url: p.image_url }); setOpen(true); };
  const closeDialog = () => { setOpen(false); setEditing(null); setForm(emptyForm); };

  const publishedCount = publications.filter(p => p.status === "published").length;
  const draftCount = publications.filter(p => p.status === "draft").length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Publications</h1>
            <p className="text-sm text-muted-foreground mt-1">Gérez les publications et documents</p>
          </div>
          <Button className="gap-2 shadow-sm" onClick={openCreate}>
            <Plus className="h-4 w-4" /> Nouvelle publication
          </Button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{publications.length}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Eye className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{publishedCount}</p>
                <p className="text-xs text-muted-foreground">Publiées</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                <EyeOff className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{draftCount}</p>
                <p className="text-xs text-muted-foreground">Brouillons</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Publications list */}
        {isLoading ? (
          <Card>
            <CardContent className="flex justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ) : publications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-muted-foreground/60" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Aucune publication</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">Créez votre première publication pour qu'elle apparaisse sur le site.</p>
              <Button className="mt-6 gap-2" onClick={openCreate}>
                <Plus className="h-4 w-4" /> Créer une publication
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {publications.map((p) => (
              <Card key={p.id} className="group border-border/50 hover:border-primary/20 hover:shadow-md transition-all duration-200">
                <CardContent className="p-0">
                  <div className="flex items-stretch">
                    {/* Thumbnail */}
                    <div className="w-28 sm:w-36 shrink-0 bg-muted/50 rounded-l-lg overflow-hidden">
                      {p.image_url ? (
                        <img src={p.image_url} alt="" className="w-full h-full object-cover min-h-[100px]" />
                      ) : (
                        <div className="w-full h-full min-h-[100px] flex items-center justify-center">
                          <FileText className="h-8 w-8 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-foreground truncate">{p.title}</h3>
                          {p.status === "published" ? (
                            <Badge className="bg-accent/15 text-accent border-accent/30 shrink-0">Publié</Badge>
                          ) : (
                            <Badge variant="secondary" className="shrink-0">Brouillon</Badge>
                          )}
                        </div>
                        {p.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{p.description}</p>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          {p.category && (
                            <span className="flex items-center gap-1">
                              <Tag className="h-3 w-3" /> {p.category}
                            </span>
                          )}
                          {p.published_date && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> {new Date(p.published_date).toLocaleDateString("fr-FR")}
                            </span>
                          )}
                          {p.file_url && (
                            <a href={p.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                              <ExternalLink className="h-3 w-3" /> PDF
                            </a>
                          )}
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1.5 text-xs"
                            onClick={() => toggleStatusMutation.mutate({ id: p.id, newStatus: p.status === "published" ? "draft" : "published" })}
                          >
                            {p.status === "published" ? (
                              <><EyeOff className="h-3.5 w-3.5" /> Dépublier</>
                            ) : (
                              <><Eye className="h-3.5 w-3.5" /> Publier</>
                            )}
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(p)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(p.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Modifier la publication" : "Nouvelle publication"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto pr-1">
            <div className="space-y-2">
              <label className="text-sm font-medium">Titre</label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Titre de la publication" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Résumé de la publication" rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Catégorie</label>
                <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="ex: Rapport" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Statut</label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="published">Publié</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date de publication</label>
              <Input type="date" value={form.published_date} onChange={(e) => setForm({ ...form, published_date: e.target.value })} />
            </div>
            <FileUpload value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} folder="publications" accept="image/*" label="Image de couverture" />
            <FileUpload value={form.file_url} onChange={(url) => setForm({ ...form, file_url: url })} folder="publications/docs" accept="application/pdf" label="Document PDF" />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={closeDialog}>Annuler</Button>
            <Button onClick={() => saveMutation.mutate()} disabled={!form.title || saveMutation.isPending}>
              {saveMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {editing ? "Mettre à jour" : "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Confirmer la suppression</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Cette action est irréversible. Voulez-vous vraiment supprimer cette publication ?</p>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteId(null)}>Annuler</Button>
            <Button variant="destructive" onClick={() => deleteId && deleteMutation.mutate(deleteId)} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default PublicationsAdmin;
