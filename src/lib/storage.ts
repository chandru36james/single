import { firestoreStorage } from './firestoreStorage';

export const storage = {
  // Site Content
  getContent: async (id: string) => {
    return await firestoreStorage.getContent(id);
  },
  saveContent: async (id: string, content: any) => {
    await firestoreStorage.saveContent(id, content);
  },

  // Leads
  getLeads: async () => {
    return await firestoreStorage.getLeads();
  },
  addLead: async (lead: any) => {
    return await firestoreStorage.addLead(lead);
  },
  updateLeadStatus: async (id: string, status: string) => {
    await firestoreStorage.updateLeadStatus(id, status);
  },
  deleteLead: async (id: string) => {
    await firestoreStorage.deleteLead(id);
  },

  // Pages
  getPages: async () => {
    return await firestoreStorage.getPages();
  },
  savePage: async (id: string | null, page: any) => {
    await firestoreStorage.savePage(id, page);
  },
  deletePage: async (id: string) => {
    await firestoreStorage.deletePage(id);
  },

  // Posts
  getPosts: async () => {
    return await firestoreStorage.getPosts();
  },
  savePost: async (id: string | null, post: any) => {
    await firestoreStorage.savePost(id, post);
  },
  deletePost: async (id: string) => {
    await firestoreStorage.deletePost(id);
  },

  // Settings
  getSettings: async (id: string = 'global') => {
    return await firestoreStorage.getSettings(id);
  },
  saveSettings: async (id: string, settings: any) => {
    await firestoreStorage.saveSettings(id, settings);
  },
  
  // Export all data
  getBrochures: () => firestoreStorage.getBrochures(),
  addBrochure: (brochure: any) => firestoreStorage.addBrochure(brochure),
  deleteBrochure: (id: string) => firestoreStorage.deleteBrochure(id),
  getAllData: async () => {
    const leads = await firestoreStorage.getLeads();
    const pages = await firestoreStorage.getPages();
    const posts = await firestoreStorage.getPosts();
    const settings = await firestoreStorage.getSettings();
    return { leads, pages, posts, settings };
  }
};
