import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../utils/supabaseClient';
import toast from 'react-hot-toast';
import { Plus, LogOut, BookOpen } from 'lucide-react';
import FolderCard from '../components/FolderCard';
import AddFolderModal from '../components/AddFolderModal';
import ConfirmDialog from '../components/ConfirmDialog';

const Home = () => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editFolder, setEditFolder] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, folder: null });
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
    fetchFolders();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/');
    } else {
      setUser(user);
    }
  };

  const fetchFolders = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('folders')
        .select(`
          *,
          words(count)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const foldersWithCount = data.map(folder => ({
        ...folder,
        word_count: folder.words[0]?.count || 0
      }));

      setFolders(foldersWithCount);
    } catch (error) {
      toast.error('Error loading folders');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFolder = async (folderName) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (editFolder) {
        const { error } = await supabase
          .from('folders')
          .update({ name: folderName })
          .eq('id', editFolder.id);

        if (error) throw error;
        toast.success('Folder updated!');
      } else {
        const { error } = await supabase
          .from('folders')
          .insert([{ name: folderName, user_id: user.id }]);

        if (error) throw error;
        toast.success('Folder created!');
      }

      fetchFolders();
      setEditFolder(null);
    } catch (error) {
      toast.error('Error saving folder');
      console.error(error);
    }
  };

  const handleDeleteFolder = async () => {
    try {
      const { error } = await supabase
        .from('folders')
        .delete()
        .eq('id', deleteDialog.folder.id);

      if (error) throw error;
      toast.success('Folder deleted!');
      fetchFolders();
      setDeleteDialog({ isOpen: false, folder: null });
    } catch (error) {
      toast.error('Error deleting folder');
      console.error(error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-pink-100">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-text">My Folders</h1>
              <p className="text-text/60">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-text/70 hover:text-text hover:bg-white rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => {
            setEditFolder(null);
            setIsModalOpen(true);
          }}
          className="w-full mb-6 py-4 bg-gradient-to-r from-primary to-accent text-white rounded-2xl font-medium shadow-pink-100 hover:shadow-pink-200 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Folder
        </motion.button>

        {folders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold text-text mb-2">No folders yet</h2>
            <p className="text-text/60">Create your first folder to start learning!</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {folders.map((folder, index) => (
              <motion.div
                key={folder.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <FolderCard
                  folder={folder}
                  onClick={() => navigate(`/folder/${folder.id}`)}
                  onEdit={(folder) => {
                    setEditFolder(folder);
                    setIsModalOpen(true);
                  }}
                  onDelete={(folder) => setDeleteDialog({ isOpen: true, folder })}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AddFolderModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditFolder(null);
        }}
        onSave={handleSaveFolder}
        editFolder={editFolder}
      />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, folder: null })}
        onConfirm={handleDeleteFolder}
        title="Delete Folder?"
        message="This will permanently delete this folder and all its words. This action cannot be undone."
      />
    </div>
  );
};

export default Home;
