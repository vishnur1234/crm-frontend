import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, MessageSquare, Send, CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import Badge from '../Badge';

const formatDate = (dateVal) => {
  if (!dateVal) return '—';
  if (dateVal && typeof dateVal.toDate === 'function') {
    try {
      return dateVal.toDate().toISOString().split('T')[0];
    } catch (e) {
      return '—';
    }
  }
  if (dateVal && typeof dateVal.seconds === 'number') {
    try {
      return new Date(dateVal.seconds * 1000).toISOString().split('T')[0];
    } catch (e) {
      return '—';
    }
  }
  return typeof dateVal === 'string' ? dateVal.split('T')[0] : String(dateVal);
};

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, projects, updateTask, addComment } = useApp();
  const { user, users } = useAuth();

  const [commentText, setCommentText] = useState('');

  const task = tasks.find(t => t.id === id);
  if (!task) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-100 mb-2">Task Not Found</h3>
        <p className="text-slate-400 mb-6">The task you are looking for does not exist or has been deleted.</p>
        <button onClick={() => navigate('/tasks')} className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Tasks
        </button>
      </div>
    );
  }

  const project = projects.find(p => p.id === task.projectId);
  const assignee = users.find(u => u.id === task.assignedTo || u.name === task.assignedTo);
  const userMap = Object.fromEntries(users.map(u => [u.id, u]));

  const handleStatusToggle = () => {
    const nextStatus = task.status === 'Completed' ? 'To Do' : 'Completed';
    updateTask(task.id, { status: nextStatus });
  };

  const handleStatusChange = (e) => {
    updateTask(task.id, { status: e.target.value });
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(task.id, {
      userId: user.id,
      text: commentText.trim()
    });
    setCommentText('');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-all">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-100">Task Details</h2>
          <p className="text-slate-500 text-xs mt-0.5">{project?.name || project?.projectName || 'No Project'}</p>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 space-y-6">
        {/* Title & Checkbox */}
        <div className="flex items-start gap-4">
          <button
            onClick={handleStatusToggle}
            className="mt-1 text-slate-500 hover:text-indigo-400 transition-colors flex-shrink-0"
          >
            {task.status === 'Completed' ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            ) : (
              <Circle className="w-6 h-6" />
            )}
          </button>
          <div className="flex-1 min-w-0">
            <h3 className={`text-xl font-bold text-slate-100 leading-tight ${task.status === 'Completed' ? 'line-through text-slate-500' : ''}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-slate-400 text-sm mt-3 leading-relaxed whitespace-pre-wrap">{task.description}</p>
            )}
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-700/50">
          <div>
            <p className="text-xs text-slate-500 font-medium">Priority</p>
            <div className="mt-1.5"><Badge label={task.priority} /></div>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Status</p>
            <div className="mt-1">
              <select
                value={task.status}
                onChange={handleStatusChange}
                className="bg-transparent text-slate-300 text-sm font-medium focus:outline-none cursor-pointer hover:text-indigo-400 transition-colors"
              >
                <option value="To Do" className="bg-slate-800">To Do</option>
                <option value="In Progress" className="bg-slate-800">In Progress</option>
                <option value="Completed" className="bg-slate-800">Completed</option>
              </select>
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Due Date</p>
            <p className="text-slate-300 text-sm font-semibold mt-1">{formatDate(task.dueDate)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium flex items-center gap-1"><User className="w-3.5 h-3.5" /> Assignee</p>
            {assignee ? (
              <div className="flex items-center gap-2 mt-1">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-[10px] font-bold">
                  {assignee.avatar}
                </div>
                <span className="text-slate-300 text-sm font-medium">{assignee.name.split(' ')[0]}</span>
              </div>
            ) : (
              <p className="text-slate-500 text-sm mt-1">Unassigned</p>
            )}
          </div>
        </div>

        {task.recurrence && task.recurrence !== 'None' && (
          <div className="flex items-center gap-2 px-4 py-3 bg-teal-500/10 border border-teal-500/20 rounded-xl text-teal-400 text-xs font-medium">
            <Clock className="w-4 h-4" />
            Recurring {task.recurrence}: When completed, a new occurrence will automatically generate.
          </div>
        )}
      </div>

      {/* Comments Section */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 space-y-6">
        <h4 className="font-semibold text-slate-100 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-indigo-400" />
          Comments ({task.comments?.length || 0})
        </h4>

        {/* Comment list */}
        <div className="space-y-4">
          {(!task.comments || task.comments.length === 0) ? (
            <p className="text-slate-500 text-sm py-4 text-center">No comments yet. Start the conversation!</p>
          ) : (
            task.comments.map(c => {
              const commenter = userMap[c.userId];
              return (
                <div key={c.id} className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {commenter?.avatar || 'U'}
                  </div>
                  <div className="flex-1 bg-slate-900/40 border border-slate-700/50 rounded-xl px-4 py-3 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-slate-200 text-xs font-bold truncate">{commenter?.name || 'Unknown User'}</span>
                      <span className="text-slate-500 text-[10px] whitespace-nowrap">{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-300 text-sm break-words leading-relaxed">{c.text}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Comment Input */}
        <form onSubmit={handleAddComment} className="flex items-center gap-2 pt-4 border-t border-slate-700/50">
          <input
            id="comment-input"
            type="text"
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            placeholder="Add a comment…"
            className="flex-1 px-4 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
          <button
            type="submit"
            id="comment-submit"
            className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
