import { motion } from 'framer-motion';
import { Volume2, Edit2, Trash2 } from 'lucide-react';
import { speakWord } from '../utils/speechUtils';

const WordCard = ({ word, onEdit, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-pink-100 hover:shadow-pink-200 transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-bold text-text">{word.english_word}</h3>
            <button
              onClick={() => speakWord(word.english_word)}
              className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
            >
              <Volume2 className="w-5 h-5 text-primary" />
            </button>
          </div>
          <p className="text-text/70 mt-2 text-lg">{word.translation}</p>
        </div>
        
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(word)}
            className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4 text-primary" />
          </button>
          <button
            onClick={() => onDelete(word)}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default WordCard;
