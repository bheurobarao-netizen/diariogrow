import { useState } from 'react';
import { Entry } from '@/lib/db';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PlantGalleryProps {
  entries: Entry[];
}

interface MediaItem {
  url: string;
  type: 'photo' | 'video';
  entryId?: number;
  entryDate?: string;
}

const PlantGallery = ({ entries }: PlantGalleryProps) => {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Flatten all photos and videos from entries
  const allMedia: MediaItem[] = entries.flatMap((entry) => [
    ...entry.photos.map((photo) => ({
      url: photo,
      type: 'photo' as const,
      entryId: entry.id,
      entryDate: entry.date,
    })),
    ...entry.videos.map((video) => ({
      url: video,
      type: 'video' as const,
      entryId: entry.id,
      entryDate: entry.date,
    })),
  ]);

  const openLightbox = (media: MediaItem, index: number) => {
    setSelectedMedia(media);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedMedia(null);
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setSelectedMedia(allMedia[newIndex]);
    }
  };

  const goToNext = () => {
    if (currentIndex < allMedia.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setSelectedMedia(allMedia[newIndex]);
    }
  };

  if (allMedia.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhuma foto ou vídeo disponível
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {allMedia.map((media, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group hover:opacity-90 transition-opacity"
            onClick={() => openLightbox(media, index)}
          >
            {media.type === 'photo' ? (
              <img
                src={media.url}
                alt={`Foto ${index + 1}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="relative w-full h-full">
                <video
                  src={media.url}
                  className="w-full h-full object-cover"
                  muted
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                    <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-primary border-b-8 border-b-transparent ml-1" />
                  </div>
                </div>
              </div>
            )}
            {media.entryDate && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                <p className="text-white text-xs">
                  {format(new Date(media.entryDate), 'dd/MM/yyyy', { locale: ptBR })}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <Dialog open={!!selectedMedia} onOpenChange={closeLightbox}>
        <DialogContent className="max-w-5xl h-[90vh] p-0 bg-black/95">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
              onClick={closeLightbox}
            >
              <X className="w-6 h-6" />
            </Button>

            {/* Navigation buttons */}
            {currentIndex > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 z-50 text-white hover:bg-white/20"
                onClick={goToPrevious}
              >
                <ChevronLeft className="w-8 h-8" />
              </Button>
            )}

            {currentIndex < allMedia.length - 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 z-50 text-white hover:bg-white/20"
                onClick={goToNext}
              >
                <ChevronRight className="w-8 h-8" />
              </Button>
            )}

            {/* Media content */}
            {selectedMedia && (
              <div className="w-full h-full flex flex-col items-center justify-center p-8">
                {selectedMedia.type === 'photo' ? (
                  <img
                    src={selectedMedia.url}
                    alt="Foto em tela cheia"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <video
                    src={selectedMedia.url}
                    controls
                    autoPlay
                    className="max-w-full max-h-full"
                  />
                )}
                {selectedMedia.entryDate && (
                  <div className="mt-4 text-white text-sm">
                    {format(new Date(selectedMedia.entryDate), "dd 'de' MMMM 'de' yyyy", {
                      locale: ptBR,
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
              {currentIndex + 1} / {allMedia.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PlantGallery;
