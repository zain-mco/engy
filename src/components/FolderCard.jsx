import { motion } from 'framer-motion';
import { Folder, Edit2, Trash2 } from 'lucide-react';

const FolderCard = ({ folder, onClick, onEdit, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-2xl p-6 shadow-pink-100 hover:shadow-pink-200 transition-all cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
            <Folder className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-text text-lg">{folder.name}</h3>
            <p className="text-text/60 text-sm">
              {folder.word_count || 0} {folder.word_count === 1 ? 'word' : 'words'}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(folder);
            }}
            className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4 text-primary" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(folder);
            }}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default FolderCard;
