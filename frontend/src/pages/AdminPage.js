import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  Users, Settings, LogOut, Trash2, Check, 
  Phone, Calendar, Send, RefreshCw, Edit3, Save, X, Image, Upload
} from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const MEDIA_BASE = 'https://customer-assets.emergentagent.com/job_arch-beauty-lab/artifacts/';

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post(`${API}/admin/login`, {}, {
        auth: { username, password }
      });
      localStorage.setItem('adminAuth', btoa(`${username}:${password}`));
      onLogin();
    } catch (err) {
      setError('Неверный логин или пароль');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-pribega-bg flex items-center justify-center px-6">
      <motion.div className="w-full max-w-sm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading text-3xl font-light text-pribega-text text-center mb-2">PRIBEGA</h1>
        <p className="font-body text-xs uppercase tracking-[0.2em] text-pribega-text-secondary text-center mb-10">Admin Panel</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="font-body text-[10px] uppercase tracking-[0.2em] text-pribega-text-secondary block mb-2">Логин</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)}
              className="w-full bg-pribega-surface border border-pribega-border px-4 py-3 font-body text-sm text-pribega-text focus:border-pribega-accent focus:outline-none transition-colors" />
          </div>
          <div>
            <label className="font-body text-[10px] uppercase tracking-[0.2em] text-pribega-text-secondary block mb-2">Пароль</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-pribega-surface border border-pribega-border px-4 py-3 font-body text-sm text-pribega-text focus:border-pribega-accent focus:outline-none transition-colors" />
          </div>
          {error && <p className="font-body text-xs text-red-500 text-center">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-pribega-text text-pribega-bg py-3 font-body text-[10px] uppercase tracking-[0.25em] hover:bg-pribega-accent transition-colors duration-300 disabled:opacity-50">
            {loading ? '...' : 'Войти'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function Dashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('contacts');
  const [stats, setStats] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [services, setServices] = useState([]);
  const [settings, setSettings] = useState({ chat_id: '' });
  const [media, setMedia] = useState({ portfolio: [], instagram: [] });
  const [loading, setLoading] = useState(true);
  const [editingServices, setEditingServices] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  const getAuthHeader = () => {
    const auth = localStorage.getItem('adminAuth');
    return { Authorization: `Basic ${auth}` };
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, contactsRes, servicesRes, settingsRes, mediaRes] = await Promise.all([
        axios.get(`${API}/admin/stats`, { headers: getAuthHeader() }),
        axios.get(`${API}/admin/contacts`, { headers: getAuthHeader() }),
        axios.get(`${API}/admin/services`, { headers: getAuthHeader() }),
        axios.get(`${API}/admin/settings`, { headers: getAuthHeader() }),
        axios.get(`${API}/admin/media`, { headers: getAuthHeader() }),
      ]);
      setStats(statsRes.data);
      setContacts(contactsRes.data);
      setServices(servicesRes.data);
      setSettings(settingsRes.data);
      setMedia(mediaRes.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        localStorage.removeItem('adminAuth');
        onLogout();
      }
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const updateContactStatus = async (id, status) => {
    try {
      await axios.patch(`${API}/admin/contacts/${id}?status=${status}`, {}, { headers: getAuthHeader() });
      setContacts(contacts.map(c => c.id === id ? { ...c, status } : c));
    } catch (err) { console.error(err); }
  };

  const deleteContact = async (id) => {
    if (!window.confirm('Удалить эту заявку?')) return;
    try {
      await axios.delete(`${API}/admin/contacts/${id}`, { headers: getAuthHeader() });
      setContacts(contacts.filter(c => c.id !== id));
    } catch (err) { console.error(err); }
  };

  const saveSettings = async () => {
    try {
      await axios.put(`${API}/admin/settings`, { telegram_chat_id: settings.chat_id }, { headers: getAuthHeader() });
      alert('Настройки сохранены');
    } catch (err) { console.error(err); }
  };

  const testTelegram = async () => {
    try {
      const res = await axios.post(`${API}/admin/test-telegram`, {}, { headers: getAuthHeader() });
      alert(res.data.success ? 'Сообщение отправлено!' : 'Ошибка отправки');
    } catch (err) { alert('Ошибка отправки'); }
  };

  const saveServices = async () => {
    try {
      await axios.put(`${API}/admin/services`, services, { headers: getAuthHeader() });
      setEditingServices(false);
      alert('Услуги сохранены');
    } catch (err) { console.error(err); }
  };

  const updateServiceItem = (catIndex, itemIndex, field, value) => {
    const newServices = [...services];
    newServices[catIndex].items[itemIndex][field] = value;
    setServices(newServices);
  };

  const updatePhoto = async (type, position) => {
    if (!newPhotoUrl.trim()) return;
    try {
      // Extract filename from full URL or use as-is
      let filename = newPhotoUrl;
      if (newPhotoUrl.includes('/')) {
        filename = newPhotoUrl.split('/').pop();
      }
      
      const endpoint = type === 'instagram' 
        ? `${API}/admin/media/instagram/${position}?src=${encodeURIComponent(filename)}`
        : `${API}/admin/media/portfolio/${position}?src=${encodeURIComponent(filename)}`;
      
      await axios.put(endpoint, {}, { headers: getAuthHeader() });
      
      // Update local state
      const newMedia = { ...media };
      newMedia[type][position].src = filename;
      setMedia(newMedia);
      
      setEditingPhoto(null);
      setNewPhotoUrl('');
      alert('Фото обновлено! Обновите страницу сайта чтобы увидеть изменения.');
    } catch (err) {
      console.error(err);
      alert('Ошибка при обновлении фото');
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  const tabs = [
    { id: 'contacts', label: 'Заявки', icon: Users },
    { id: 'media', label: 'Фото', icon: Image },
    { id: 'services', label: 'Услуги', icon: Edit3 },
    { id: 'settings', label: 'Настройки', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-pribega-bg">
      <header className="bg-pribega-surface border-b border-pribega-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="font-heading text-xl font-light text-pribega-text">PRIBEGA</h1>
            <span className="font-body text-[10px] uppercase tracking-[0.15em] text-pribega-text-secondary">Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={fetchData} className="p-2 text-pribega-text-secondary hover:text-pribega-accent transition-colors">
              <RefreshCw size={16} />
            </button>
            <button onClick={onLogout} className="p-2 text-pribega-text-secondary hover:text-red-500 transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {stats && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-pribega-surface border border-pribega-border p-6">
              <p className="font-heading text-3xl font-light text-pribega-text">{stats.total_contacts}</p>
              <p className="font-body text-[10px] uppercase tracking-[0.15em] text-pribega-text-secondary mt-1">Всего заявок</p>
            </div>
            <div className="bg-pribega-surface border border-pribega-border p-6">
              <p className="font-heading text-3xl font-light text-pribega-accent">{stats.new_contacts}</p>
              <p className="font-body text-[10px] uppercase tracking-[0.15em] text-pribega-text-secondary mt-1">Новых</p>
            </div>
            <div className="bg-pribega-surface border border-pribega-border p-6">
              <p className="font-heading text-3xl font-light text-pribega-text">{stats.total_quiz}</p>
              <p className="font-body text-[10px] uppercase tracking-[0.15em] text-pribega-text-secondary mt-1">Квиз</p>
            </div>
          </div>
        )}

        <div className="flex gap-1 mb-6 border-b border-pribega-border">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-body text-xs uppercase tracking-[0.15em] transition-colors border-b-2 -mb-px ${
                activeTab === tab.id ? 'text-pribega-accent border-pribega-accent' : 'text-pribega-text-secondary border-transparent hover:text-pribega-text'
              }`}>
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-6 h-6 border-2 border-pribega-accent border-t-transparent rounded-full mx-auto" />
          </div>
        ) : (
          <>
            {/* Contacts Tab */}
            {activeTab === 'contacts' && (
              <div className="space-y-3">
                {contacts.length === 0 ? (
                  <p className="text-center py-10 font-body text-sm text-pribega-text-secondary">Нет заявок</p>
                ) : (
                  contacts.map(contact => (
                    <motion.div key={contact.id}
                      className={`bg-pribega-surface border p-4 flex items-center gap-4 ${contact.status === 'new' ? 'border-pribega-accent' : 'border-pribega-border'}`}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <p className="font-heading text-base font-light text-pribega-text">{contact.name}</p>
                          {contact.status === 'new' && (
                            <span className="px-2 py-0.5 bg-pribega-accent/10 text-pribega-accent font-body text-[9px] uppercase tracking-wider">Новая</span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <a href={`tel:${contact.phone}`} className="flex items-center gap-1 font-body text-sm text-pribega-text hover:text-pribega-accent">
                            <Phone size={12} />{contact.phone}
                          </a>
                          <span className="flex items-center gap-1 font-body text-xs text-pribega-text-secondary">
                            <Calendar size={12} />{formatDate(contact.created_at)}
                          </span>
                          <span className="font-body text-[10px] uppercase tracking-wider text-pribega-text-secondary">{contact.source}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {contact.status === 'new' && (
                          <button onClick={() => updateContactStatus(contact.id, 'processed')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors" title="Обработано">
                            <Check size={16} />
                          </button>
                        )}
                        <button onClick={() => deleteContact(contact.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors" title="Удалить">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}

            {/* Media Tab */}
            {activeTab === 'media' && (
              <div className="space-y-8">
                {/* Instagram Section */}
                <div className="bg-pribega-surface border border-pribega-border p-6">
                  <h3 className="font-heading text-lg font-light text-pribega-text mb-4">Instagram (8 фото)</h3>
                  <p className="font-body text-xs text-pribega-text-secondary mb-4">Нажмите на фото чтобы заменить</p>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {media.instagram.map((item, i) => (
                      <div key={i} className="relative group">
                        <img src={`${MEDIA_BASE}${item.src}`} alt={`Instagram ${i+1}`}
                          className="w-full aspect-square object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => { setEditingPhoto({ type: 'instagram', position: i }); setNewPhotoUrl(''); }} />
                        <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1 rounded">{i+1}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Portfolio Section */}
                <div className="bg-pribega-surface border border-pribega-border p-6">
                  <h3 className="font-heading text-lg font-light text-pribega-text mb-4">Портфолио ({media.portfolio.length} фото/видео)</h3>
                  <p className="font-body text-xs text-pribega-text-secondary mb-4">Нажмите на фото чтобы заменить</p>
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-2">
                    {media.portfolio.map((item, i) => (
                      <div key={i} className="relative group">
                        {item.type === 'img' ? (
                          <img src={`${MEDIA_BASE}${item.src}`} alt={`Portfolio ${i+1}`}
                            className="w-full aspect-square object-cover cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => { setEditingPhoto({ type: 'portfolio', position: i }); setNewPhotoUrl(''); }} />
                        ) : (
                          <div className="w-full aspect-square bg-pribega-bg flex items-center justify-center text-pribega-text-secondary text-[10px]">
                            VIDEO
                          </div>
                        )}
                        <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1 rounded">{i+1}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Edit Photo Modal */}
                {editingPhoto && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div className="bg-pribega-bg border border-pribega-border p-6 max-w-lg w-full"
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-heading text-lg font-light text-pribega-text">
                          Заменить фото #{editingPhoto.position + 1} ({editingPhoto.type === 'instagram' ? 'Instagram' : 'Портфолио'})
                        </h4>
                        <button onClick={() => setEditingPhoto(null)} className="text-pribega-text-secondary hover:text-pribega-text">
                          <X size={20} />
                        </button>
                      </div>
                      
                      <div className="mb-4">
                        <p className="font-body text-xs text-pribega-text-secondary mb-2">Текущее фото:</p>
                        <img src={`${MEDIA_BASE}${media[editingPhoto.type][editingPhoto.position].src}`} 
                          alt="Current" className="w-32 h-32 object-cover" />
                      </div>
                      
                      <div className="mb-4">
                        <label className="font-body text-[10px] uppercase tracking-[0.2em] text-pribega-text-secondary block mb-2">
                          Имя файла нового фото
                        </label>
                        <input type="text" value={newPhotoUrl} onChange={e => setNewPhotoUrl(e.target.value)}
                          placeholder="example_photo.jpg"
                          className="w-full bg-pribega-surface border border-pribega-border px-4 py-3 font-body text-sm text-pribega-text focus:border-pribega-accent focus:outline-none" />
                        <p className="font-body text-[10px] text-pribega-text-secondary mt-2">
                          Загрузите фото в чат и скопируйте имя файла (например: abc123_photo.jpg)
                        </p>
                      </div>
                      
                      <div className="flex gap-3">
                        <button onClick={() => updatePhoto(editingPhoto.type, editingPhoto.position)}
                          className="flex-1 bg-pribega-text text-pribega-bg py-3 font-body text-[10px] uppercase tracking-[0.2em] hover:bg-pribega-accent transition-colors flex items-center justify-center gap-2">
                          <Save size={14} /> Сохранить
                        </button>
                        <button onClick={() => setEditingPhoto(null)}
                          className="px-6 py-3 border border-pribega-border font-body text-[10px] uppercase tracking-[0.2em] text-pribega-text-secondary hover:border-pribega-text transition-colors">
                          Отмена
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}

                <div className="bg-pribega-surface/50 border border-pribega-border p-4">
                  <p className="font-body text-xs text-pribega-text-secondary">
                    <strong>Как заменить фото:</strong><br/>
                    1. Загрузите новое фото в этот чат<br/>
                    2. Скопируйте имя файла (например: abc123_photo.jpg)<br/>
                    3. Нажмите на фото которое хотите заменить<br/>
                    4. Вставьте имя файла и нажмите "Сохранить"
                  </p>
                </div>
              </div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
              <div className="space-y-6">
                <div className="flex justify-end">
                  {editingServices ? (
                    <div className="flex gap-2">
                      <button onClick={() => setEditingServices(false)} className="px-4 py-2 border border-pribega-border font-body text-xs uppercase tracking-wider text-pribega-text-secondary hover:border-pribega-text transition-colors">
                        <X size={14} className="inline mr-1" />Отмена
                      </button>
                      <button onClick={saveServices} className="px-4 py-2 bg-pribega-accent text-white font-body text-xs uppercase tracking-wider hover:bg-pribega-text transition-colors">
                        <Save size={14} className="inline mr-1" />Сохранить
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setEditingServices(true)} className="px-4 py-2 border border-pribega-border font-body text-xs uppercase tracking-wider text-pribega-text-secondary hover:border-pribega-accent hover:text-pribega-accent transition-colors">
                      <Edit3 size={14} className="inline mr-1" />Редактировать
                    </button>
                  )}
                </div>

                {services.map((category, catIndex) => (
                  <div key={category.id} className="bg-pribega-surface border border-pribega-border p-6">
                    <h3 className="font-heading text-lg font-light text-pribega-text mb-4">{category.title_ru}</h3>
                    <div className="space-y-3">
                      {category.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center gap-4 py-2 border-b border-pribega-border last:border-0">
                          {editingServices ? (
                            <>
                              <input type="text" value={item.name} onChange={(e) => updateServiceItem(catIndex, itemIndex, 'name', e.target.value)}
                                className="flex-1 bg-pribega-bg border border-pribega-border px-3 py-2 font-body text-sm text-pribega-text focus:border-pribega-accent focus:outline-none" />
                              <input type="text" value={item.price} onChange={(e) => updateServiceItem(catIndex, itemIndex, 'price', e.target.value)}
                                className="w-24 bg-pribega-bg border border-pribega-border px-3 py-2 font-body text-sm text-pribega-text focus:border-pribega-accent focus:outline-none text-right" />
                            </>
                          ) : (
                            <>
                              <span className="flex-1 font-body text-sm text-pribega-text">{item.name}</span>
                              <span className="font-heading text-base text-pribega-text">{item.price}</span>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="max-w-lg">
                <div className="bg-pribega-surface border border-pribega-border p-6 space-y-6">
                  <div>
                    <h3 className="font-heading text-lg font-light text-pribega-text mb-4">Telegram уведомления</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="font-body text-[10px] uppercase tracking-[0.2em] text-pribega-text-secondary block mb-2">Chat ID канала/группы</label>
                        <input type="text" value={settings.chat_id || ''} onChange={(e) => setSettings({ ...settings, chat_id: e.target.value })}
                          placeholder="-1001234567890"
                          className="w-full bg-pribega-bg border border-pribega-border px-4 py-3 font-body text-sm text-pribega-text focus:border-pribega-accent focus:outline-none" />
                        <p className="font-body text-[10px] text-pribega-text-secondary mt-2">Добавьте бота в канал и получите Chat ID через @userinfobot</p>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={saveSettings}
                          className="px-6 py-3 bg-pribega-text text-pribega-bg font-body text-[10px] uppercase tracking-[0.2em] hover:bg-pribega-accent transition-colors">
                          Сохранить
                        </button>
                        <button onClick={testTelegram}
                          className="px-6 py-3 border border-pribega-border font-body text-[10px] uppercase tracking-[0.2em] text-pribega-text-secondary hover:border-pribega-accent hover:text-pribega-accent transition-colors">
                          <Send size={12} className="inline mr-1" />Тест
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (auth) setIsLoggedIn(true);
  }, []);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) return <LoginForm onLogin={handleLogin} />;
  return <Dashboard onLogout={handleLogout} />;
}
