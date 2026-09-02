import React from 'react';
import { useParams } from 'react-router-dom';

export const EditPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold tracking-tight mb-2">Edit Post #{id}</h2>
      <p className="text-muted-foreground">Ubah isi artikel dan simpan perubahan.</p>
    </div>
  );
};
