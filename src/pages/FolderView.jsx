import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../utils/supabaseClient';
import toast from 'react-hot-toast';
import { ArrowLeft, Plus, Search } from 'lucide-react';
import WordCard from '../components/WordCard';
import AddWordModal from '../components/AddWordModal';
import ConfirmDialog from '../components/ConfirmDialog';

const FolderView = () => {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const [folder, setFolder] = useState(null);
  const [words, setWords] = useState([]);
  const [filteredWords, setFilteredWords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editWord, setEditWord] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, word: null });

  useEffect(() => {
    fetchFolderAndWords();
  }, [folderId]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredWords(words);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = words.filter(
        (word) =>
          word.english_word.toLowerCase().includes(query) ||
          word.translation.toLowerCase().includes(query)
      );
      setFilteredWords(filtered);
    }
  }, [searchQuery, words]);

  const fetchFolderAndWords = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/');
        return;
      }

      const { data: folderData, error: folderError } = await supabase
        .from('folders')
        .select('*')
        .eq('id', folderId)
        .eq('user_id', user.id)
        .single();

      if (folderError) throw folderError;
      setFolder(folderData);

      const { data: wordsData, error: wordsError } = await supabase
        .from('words')
        .select('*')
        .eq('folder_id', folderId)
        .order('created_at', { ascending: false });

      if (wordsError) throw wordsError;
      setWords(wordsData);
      setFilteredWords(wordsData);
    } catch (error) {
      toast.error('Error loading folder');
      console.error(error);
      navigate('/home');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWord = async (wordData) => {
    try {
      if (editWord) {
        const { error } = await supabase
          .from('words')
          .update(wordData)
          .eq('id', editWord.id);

        if (error) throw error;
        toast.success('Word updated!');
      } else {
        const { error } = await supabase
          .from('words')
          .insert([{ ...wordData, folder_id: folderId }]);

        if (error) throw error;
        toast.success('Word added!');
      }

      fetchFolderAndWords();
      setEditWord(null);
    } catch (error) {
      toast.error('Error saving word');
      console.error(error);
    }
  };

  const handleDeleteWord = async () => {
    try {
      const { error } = await supabase
        .from('words')
        .delete()
        .eq('id', deleteDialog.word.id);

      if (error) throw error;
      toast.success('Word deleted!');
      fetchFolderAndWords();
      setDeleteDialog({ isOpen: false, word: null });
    } catch (error) {
      toast.error('Error deleting word');
      console.error(error);
    }
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
          className="mb-8"
        >
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 text-text/70 hover:text-text mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Folders</span>
          </button>

          <h1 className="text-3xl font-bold text-text mb-6">{folder?.name}</h1>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search words..."
                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors"
              />
            </div>
            <button
              onClick={() => {
                setEditWord(null);
                setIsModalOpen(true);
              }}
              className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-medium shadow-pink-100 hover:shadow-pink-200 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Word
            </button>
          </div>
        </motion.div>

        {filteredWords.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              {searchQuery ? (
                <Search className="w-10 h-10 text-primary" />
              ) : (
                <Plus className="w-10 h-10 text-primary" />
              )}
            </div>
            <h2 className="text-2xl font-semibold text-text mb-2">
              {searchQuery ? 'No words found' : 'No words yet'}
            </h2>
            <p className="text-text/60">
              {searchQuery
                ? 'Try a different search term'
                : 'Add your first word to start learning!'}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredWords.map((word, index) => (
              <motion.div
                key={word.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <WordCard
                  word={word}
                  onEdit={(word) => {
                    setEditWord(word);
                    setIsModalOpen(true);
                  }}
                  onDelete={(word) => setDeleteDialog({ isOpen: true, word })}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AddWordModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditWord(null);
        }}
        onSave={handleSaveWord}
        editWord={editWord}
      />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, word: null })}
        onConfirm={handleDeleteWord}
        title="Delete Word?"
        message="This will permanently delete this word. This action cannot be undone."
      />
    </div>
  );
};

export default FolderView;
