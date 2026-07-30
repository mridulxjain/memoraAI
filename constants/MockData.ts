export const MockFiles = [
  { id: '1', name: 'Q3 Financial Report.pdf', size: '2.4 MB', date: 'Oct 12, 2026', type: 'document', aiFlag: true },
  { id: '2', name: 'Vacation_Maui_01.jpg', size: '4.1 MB', date: 'Sep 28, 2026', type: 'image', aiFlag: false },
  { id: '3', name: 'App Prototype Demo.mp4', size: '124.5 MB', date: 'Sep 15, 2026', type: 'video', aiFlag: true },
  { id: '4', name: 'Tax_Returns_2025.zip', size: '18.2 MB', date: 'Apr 10, 2026', type: 'archive', aiFlag: true },
  { id: '5', name: 'Meeting Recording.m4a', size: '32.1 MB', date: 'Oct 18, 2026', type: 'audio', aiFlag: true },
  { id: '6', name: 'Project_Assets_Final.fig', size: '45.0 MB', date: 'Oct 05, 2026', type: 'document', aiFlag: false },
];

export const MockInsights = [
  { id: 'i1', title: '24 Duplicate Files', subtitle: 'Tap to review and clean', type: 'warning' },
  { id: 'i2', title: '1.8 GB Freeable', subtitle: 'Large unused files found', type: 'success' },
  { id: 'i3', title: 'Old Downloads', subtitle: 'Over 6 months old', type: 'danger' },
];

export const MockAIRecommendations = [
  { id: 'r1', title: 'Archive Semester Notes', description: "These files haven't been opened in 6 months.", priority: 'high', type: 'archive' },
  { id: 'r2', title: 'Compress Large Videos', description: 'You have 3 videos taking up 4GB. Compressing them will save 2.5GB.', priority: 'high', type: 'compress' },
  { id: 'r3', title: 'Review Unsorted Documents', description: 'AI found 12 documents that look like receipts.', priority: 'medium', type: 'organize' },
  { id: 'r4', title: 'Delete Failed Downloads', description: 'Found 4 incomplete files.', priority: 'low', type: 'delete' },
];

export const MockProfileStats = {
  version: '2.1.0-build.45',
  aiStatus: 'Online',
  model: 'Memora-Vision-Pro-v2',
  storageUsed: 42.5,
  storageTotal: 128,
};
