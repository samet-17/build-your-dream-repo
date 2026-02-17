import { useState } from "react";
import { Plus, Pin, Trash2, Search, PinOff } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Note, NOTE_COLORS, generateId } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Notes = () => {
  const [notes, setNotes] = useLocalStorage<Note[]>("productive-notes", []);
  const [search, setSearch] = useState("");
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredNotes = notes
    .filter(
      (n) =>
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.content.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  const handleAddNote = () => {
    const note: Note = {
      id: generateId(),
      title: "Yeni Not",
      content: "",
      color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pinned: false,
    };
    setNotes((prev) => [note, ...prev]);
    setEditingNote(note);
    setDialogOpen(true);
  };

  const handleSaveNote = () => {
    if (!editingNote) return;
    const updated = { ...editingNote, updatedAt: new Date().toISOString() };
    setNotes((prev) => {
      const exists = prev.find((n) => n.id === updated.id);
      return exists ? prev.map((n) => (n.id === updated.id ? updated : n)) : [updated, ...prev];
    });
    setDialogOpen(false);
    setEditingNote(null);
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    setDialogOpen(false);
    setEditingNote(null);
  };

  const togglePin = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned, updatedAt: new Date().toISOString() } : n))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Notlar</h1>
          <p className="text-muted-foreground mt-1">Fikirlerini ve notlarını kaydet.</p>
        </div>
        <Button onClick={handleAddNote} className="gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" /> Yeni Not
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Notlarda ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-secondary border-border"
        />
      </div>

      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) setEditingNote(null); }}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading">Notu Düzenle</DialogTitle>
          </DialogHeader>
          {editingNote && (
            <div className="space-y-4 mt-2">
              <Input
                placeholder="Başlık"
                value={editingNote.title}
                onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                className="bg-secondary border-border text-lg font-semibold"
              />
              <Textarea
                placeholder="Not içeriği..."
                value={editingNote.content}
                onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                className="bg-secondary border-border min-h-[200px]"
              />
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Renk:</span>
                {NOTE_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setEditingNote({ ...editingNote, color: c })}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      editingNote.color === c ? "border-primary scale-125" : "border-transparent"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveNote} className="flex-1 gradient-primary text-primary-foreground">
                  Kaydet
                </Button>
                <Button onClick={() => handleDeleteNote(editingNote.id)} variant="destructive" size="icon">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {filteredNotes.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">Henüz not yok. Yeni bir not ekle!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="rounded-xl border border-border/40 p-4 cursor-pointer hover:border-primary/30 hover:shadow-glow transition-all duration-200 group"
              style={{ backgroundColor: note.color }}
              onClick={() => { setEditingNote(note); setDialogOpen(true); }}
            >
              <div className="flex items-start justify-between">
                <h3 className="text-sm font-semibold text-foreground truncate flex-1">{note.title}</h3>
                <button
                  onClick={(e) => { e.stopPropagation(); togglePin(note.id); }}
                  className="ml-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {note.pinned ? <Pin className="w-3.5 h-3.5 text-primary" /> : <PinOff className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 line-clamp-4 whitespace-pre-wrap">
                {note.content || "Boş not..."}
              </p>
              <p className="text-[10px] text-muted-foreground mt-3">
                {new Date(note.updatedAt).toLocaleDateString("tr-TR")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notes;
