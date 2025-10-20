import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookPlus } from 'lucide-react';

const AddWordModal = ({ isOpen, onClose, onSave, editWord }) => {
  const [englishWord, setEnglishWord] = useState('');
  const [translation, setTranslation] = useState('');

  useEffect(() => {
    if (editWord) {
      setEnglishWord(editWord.english_word);
      setTranslation(editWord.translation);
    } else {
      setEnglishWord('');
      setTranslation('');
    }
  }, [editWord, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (englishWord.trim() && translation.trim()) {
      onSave({
        english_word: englishWord.trim(),
        translation: translation.trim(),
      });
      setEnglishWord('');
      setTranslation('');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-pink-200 p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                    <BookPlus className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-text">
                    {editWord ? 'Edit Word' : 'Add Word'}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-text/60" />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      English Word
                    </label>
                    <input
                      type="text"
                      value={englishWord}
                      onChange={(e) => setEnglishWord(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors"
                      placeholder="e.g., Beautiful"
                      autoFocus
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      Translation
                    </label>
                    <input
                      type="text"
                      value={translation}
                      onChange={(e) => setTranslation(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors"
                      placeholder="e.g., جميل"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 border-2 border-gray-200 text-text rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-medium shadow-pink-100 hover:shadow-pink-200 transition-all"
                  >
                    {editWord ? 'Save' : 'Add'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddWordModal;
