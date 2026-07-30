import { useState, useEffect, useCallback } from 'react';
import { FilesRepository, ScannedFile } from '../database/repositories/FilesRepository';

export function useFilesDatabase() {
  const [files, setFiles] = useState<ScannedFile[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Sorting state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Sort Types: 'Newest', 'Oldest', 'Largest', 'Smallest', 'Alphabetical'
  const [sortBy, setSortBy] = useState('Newest');

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    const allFiles = await FilesRepository.getAllFiles();
    setFiles(allFiles);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const parseSemanticSearch = (query: string, file: ScannedFile) => {
    if (!query) return true;
    const q = query.toLowerCase();
    let matches = true;

    // Local Intent Parser: Size heuristics
    if (q.includes('large') || q.includes('huge') || q.includes('big')) {
      if (file.size < 100 * 1024 * 1024) matches = false; // less than 100MB
    } else if (q.includes('small') || q.includes('tiny')) {
      if (file.size > 10 * 1024 * 1024) matches = false; // more than 10MB
    }

    // Local Intent Parser: Age heuristics
    const daysOld = (Date.now() - file.createdAt) / (1000 * 60 * 60 * 24);
    if (q.includes('old')) {
      if (daysOld < 365) matches = false;
    } else if (q.includes('recent') || q.includes('new')) {
      if (daysOld > 7) matches = false;
    }

    // Local Intent Parser: Category/Type heuristics
    if (q.includes('video') || q.includes('movie')) {
      if (file.category !== 'Videos') matches = false;
    } else if (q.includes('image') || q.includes('photo') || q.includes('picture')) {
      if (file.category !== 'Images') matches = false;
    } else if (q.includes('pdf') || q.includes('document')) {
      if (file.category !== 'Documents') matches = false;
    } else if (q.includes('music') || q.includes('audio') || q.includes('song')) {
      if (file.category !== 'Audio') matches = false;
    } else if (q.includes('archive') || q.includes('zip') || q.includes('compressed')) {
      if (file.category !== 'Archives') matches = false;
    } else {
      // If no strong semantic intent is found, fallback to name/extension match
      if (!file.name.toLowerCase().includes(q) && !(file.extension && q.includes(file.extension.toLowerCase()))) {
        matches = false;
      }
    }

    return matches;
  };

  const displayedFiles = files
    .filter(file => activeCategory === 'All' || file.category === activeCategory)
    .filter(file => parseSemanticSearch(searchQuery, file))
    .sort((a, b) => {
      switch (sortBy) {
        case 'Newest': return b.createdAt - a.createdAt;
        case 'Oldest': return a.createdAt - b.createdAt;
        case 'Largest': return b.size - a.size;
        case 'Smallest': return a.size - b.size;
        case 'Alphabetical': return a.name.localeCompare(b.name);
        default: return 0;
      }
    });

  return {
    files: displayedFiles,
    totalCount: files.length,
    loading,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    sortBy,
    setSortBy,
    refreshFiles: fetchFiles,
  };
}
