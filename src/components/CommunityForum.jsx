import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import hook
import {
  Users, MessageSquare, ThumbsUp, Search, PlusCircle,
  UserCircle, Flame, Clock, HelpCircle, User, X, Send, Tag, MessageCircle, ArrowLeft, Languages
} from 'lucide-react';
import { translations } from '../data/translations';
import { localizedForum } from '../data/localizedForum';

const CommunityForum = ({ language, setLanguage }) => {
  const t = translations[language] || translations.en;
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Trending');
  const [showModal, setShowModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // --- STATE: Form Data ---
  const [newPost, setNewPost] = useState({ title: '', desc: '', tag: 'General' });
  const [newComment, setNewComment] = useState('');

  // --- STATE: Posts Data (Expanded with Comments Array) ---
  const [posts, setPosts] = useState(localizedForum[language] || localizedForum.en);

  React.useEffect(() => {
    // When language changes, update the mock data but keep the current structure
    setPosts(localizedForum[language] || localizedForum.en);
  }, [language]);

  // --- LOGIC: Filtering & Sorting ---
  const getFilteredPosts = () => {
    let filtered = [...posts];

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (activeTab) {
      case 'Trending': return filtered.sort((a, b) => b.likes - a.likes);
      case 'Newest': return filtered.sort((a, b) => b.id - a.id);
      case 'Unanswered': return filtered.filter(p => p.comments.length === 0);
      case 'My Posts': return filtered.filter(p => p.author === 'You');
      default: return filtered;
    }
  };

  // --- LOGIC: Like Post ---
  const handleLikePost = (id) => {
    setPosts(posts.map(post => {
      if (post.id === id) {
        return { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 };
      }
      return post;
    }));
  };

  // --- LOGIC: Create Post ---
  const handleSubmitPost = (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.desc) return;

    const newPostObj = {
      id: Date.now(), // Unique ID
      author: 'You',
      role: 'Farmer',
      title: newPost.title,
      desc: newPost.desc,
      likes: 0,
      comments: [],
      tag: newPost.tag,
      time: 'Just now',
      liked: false
    };

    setPosts([newPostObj, ...posts]);
    setNewPost({ title: '', desc: '', tag: 'General' });
    setShowModal(false);
    setActiveTab('Newest');
  };

  // --- LOGIC: Open Comment Modal ---
  const openComments = (post) => {
    setSelectedPost(post);
    setShowCommentModal(true);
  };

  // --- LOGIC: Submit Comment ---
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const commentObj = {
      id: Date.now(),
      author: 'You',
      text: newComment,
      likes: 0
    };

    // Update Local State for Modal
    const updatedPost = { ...selectedPost, comments: [...selectedPost.comments, commentObj] };
    setSelectedPost(updatedPost);

    // Update Global Posts State
    setPosts(posts.map(p => p.id === selectedPost.id ? updatedPost : p));

    setNewComment('');
  };

  // Helper for Tag Colors
  const getTagColor = (tag) => {
    switch (tag) {
      case 'Disease Alert': return 'bg-red-100 text-red-600 border-red-200';
      case 'Success Story': return 'bg-green-100 text-green-600 border-green-200';
      case 'Expert Advice': return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'Market Price': return 'bg-orange-100 text-orange-600 border-orange-200';
      default: return 'bg-teal-50 text-teal-600 border-teal-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">

      {/* HEADER with Back Button */}
      <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 rounded-3xl p-8 text-white mb-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-10 -translate-y-10">
          <MessageSquare size={200} />
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
          <div className="flex items-center gap-4">
            {/* BACK BUTTON ADDED HERE */}
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <div className="flex-1">
              <h1 className="text-4xl font-extrabold flex items-center gap-3 tracking-tight">
                <Users className="w-10 h-10" />
                {t.forum?.title || "Community Forum"}
              </h1>
              <p className="mt-2 text-teal-50 text-lg font-medium opacity-90">
                Join 50,000+ farmers discussing solutions, prices, and success stories.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 ml-auto">
            <div className="flex items-center space-x-2 bg-white/20 px-3 py-1.5 rounded-xl border border-white/30 backdrop-blur-sm relative z-20">
              <Languages className="w-5 h-5 text-white" />
              <select
                value={language || 'en'}
                onChange={(e) => setLanguage && setLanguage(e.target.value)}
                className="bg-transparent focus:outline-none text-white font-medium cursor-pointer [&>option]:text-gray-800"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="od">ଓଡ଼ିଆ</option>
                <option value="te">తెలుగు</option>
              </select>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="bg-white text-teal-700 px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-teal-50 hover:scale-105 transition-all shadow-lg active:scale-95 whitespace-nowrap"
            >
              <PlusCircle className="w-6 h-6" />
              Ask Question
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* LEFT SIDEBAR (Filters) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-5 rounded-3xl shadow-lg border border-teal-50">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics..."
                className="w-full pl-10 p-3 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500 border border-gray-100 transition-all"
              />
            </div>

            <div className="space-y-2">
              {[
                { id: 'Trending', icon: Flame, color: 'text-orange-500' },
                { id: 'Newest', icon: Clock, color: 'text-blue-500' },
                { id: 'Unanswered', icon: HelpCircle, color: 'text-red-500' },
                { id: 'My Posts', icon: User, color: 'text-purple-500' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-all ${activeTab === item.id
                    ? 'bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-700 border border-teal-200 shadow-sm'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                    }`}
                >
                  <item.icon className={`w-5 h-5 ${activeTab === item.id ? item.color : 'text-gray-400'}`} />
                  {item.id}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-5 rounded-3xl border border-indigo-100 shadow-inner">
            <h4 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
              <span className="bg-indigo-200 p-1 rounded">🏆</span> Top Contributors
            </h4>
            <div className="space-y-4">
              {[
                { name: 'Dr. Swaminathan', points: '12.5k', role: 'Expert' },
                { name: 'Ravi Kishan', points: '8.2k', role: 'Farmer' },
                { name: 'Amit Patel', points: '5.1k', role: 'Farmer' }
              ].map((user, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-sm shadow-sm border-2 border-white">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.role} • {user.points} pts</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MAIN FEED */}
        <div className="lg:col-span-3 space-y-5">
          {getFilteredPosts().map(post => (
            <div
              key={post.id}
              className="bg-white p-6 rounded-3xl shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border-2 border-teal-50">
                    <UserCircle className="w-full h-full text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{post.author}</h3>
                    <p className="text-xs text-gray-500 font-medium">{post.role} • {post.time}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getTagColor(post.tag)}`}>
                  {post.tag}
                </span>
              </div>

              <h2
                onClick={() => openComments(post)}
                className="text-xl font-bold text-gray-800 mb-2 group-hover:text-teal-600 transition-colors cursor-pointer"
              >
                {post.title}
              </h2>
              <p className="text-gray-600 mb-5 leading-relaxed">
                {post.desc}
              </p>

              <div className="flex items-center gap-6 pt-4 border-t border-gray-50">
                <button
                  onClick={() => handleLikePost(post.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${post.liked
                    ? 'bg-red-50 text-red-500 font-bold'
                    : 'text-gray-500 hover:bg-gray-100'
                    }`}
                >
                  <ThumbsUp className={`w-5 h-5 ${post.liked ? 'fill-current' : ''}`} />
                  <span>{post.likes}</span>
                </button>

                <button
                  onClick={() => openComments(post)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-all"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>{post.comments.length} Comments</span>
                </button>

                <button onClick={() => openComments(post)} className="ml-auto text-gray-400 hover:text-teal-600">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}

          {getFilteredPosts().length === 0 && (
            <div className="text-center py-12 bg-white rounded-3xl shadow-sm border border-dashed border-gray-300">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-500">No posts found</h3>
              <p className="text-gray-400">Try changing your filters or search query.</p>
            </div>
          )}
        </div>

      </div>

      {/* --- MODAL: ASK QUESTION --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 relative animate-scaleIn">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
              <PlusCircle className="text-teal-600" />
              Ask Community
            </h2>

            <form onSubmit={handleSubmitPost} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                  placeholder="e.g., How to control pests in brinjal?"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Category (Tag)</label>
                <select
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none bg-white cursor-pointer"
                  value={newPost.tag}
                  onChange={(e) => setNewPost({ ...newPost, tag: e.target.value })}
                >
                  <option>General</option>
                  <option>Wheat</option>
                  <option>Rice</option>
                  <option>Pest Control</option>
                  <option>Market Price</option>
                  <option>Machinery</option>
                  <option>Schemes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows="4"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all resize-none"
                  placeholder="Describe your issue in detail..."
                  value={newPost.desc}
                  onChange={(e) => setNewPost({ ...newPost, desc: e.target.value })}
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-teal-200 transition-all active:scale-[0.98]"
              >
                Post Question
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: VIEW COMMENTS --- */}
      {showCommentModal && selectedPost && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[80vh] animate-scaleIn">

            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50 rounded-t-3xl">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{selectedPost.title}</h3>
                <p className="text-sm text-gray-500 mt-1">Posted by {selectedPost.author} • {selectedPost.time}</p>
              </div>
              <button
                onClick={() => setShowCommentModal(false)}
                className="text-gray-400 hover:text-gray-600 bg-white p-2 rounded-full shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comments List (Scrollable) */}
            <div className="p-6 overflow-y-auto flex-grow bg-white">
              <p className="text-gray-700 mb-6 p-4 bg-teal-50 rounded-xl border border-teal-100">
                {selectedPost.desc}
              </p>

              <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-teal-600" />
                Discussion ({selectedPost.comments.length})
              </h4>

              {selectedPost.comments.length === 0 ? (
                <div className="text-center py-8 text-gray-400 italic">
                  No comments yet. Be the first to reply!
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedPost.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 animate-fadeIn">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-xs text-gray-600 shrink-0">
                        {comment.author.charAt(0)}
                      </div>
                      <div className="bg-gray-50 p-3 rounded-2xl rounded-tl-none w-full border border-gray-100">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-sm text-gray-800">{comment.author}</span>
                          <span className="text-xs text-gray-400">Just now</span>
                        </div>
                        <p className="text-gray-700 text-sm">{comment.text}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button className="text-xs text-gray-500 hover:text-teal-600 flex items-center gap-1">
                            <ThumbsUp className="w-3 h-3" /> Like
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Input Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-3xl">
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a helpful reply..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="bg-teal-600 hover:bg-teal-700 text-white p-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default CommunityForum;