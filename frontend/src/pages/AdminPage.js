import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  Users, MessageSquare, Settings, LogOut, Trash2, Check, Clock, 
  Phone, Calendar, Send, RefreshCw, ChevronRight, Edit3, Save, X
} from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

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
      <motion.div 
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-heading text-3xl font-light text-pribega-text text-center mb-2">
          PRIBEGA
        </h1>
        <p className="font-body text-xs uppercase tracking-[0.2em] text-pribega-text-secondary text-center mb-10">
          Admin Panel
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="font-body text-[10px] uppercase tracking-[0.2em] text-pribega-text-secondary block mb-2">
              Логин
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full bg-pribega-surface border border-pribega-border px-4 py-3 font-body text-sm text-pribega-text focus:border-pribega-accent focus:outline-none transition-colors"
              data-testid="admin-username"
            />
          </div>
          <div>
            <label className="font-body text-[10px] uppercase tracking-[0.2em] text-pribega-text-secondary block mb-2">
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-pribega-surface border border-pribega-border px-4 py-3 font-body text-sm text-pribega-text focus:border-pribega-accent focus:outline-none transition-colors"
              data-testid="admin-password"
            />
          </div>
          
          {error && (
            <p className="font-body text-xs text-red-500 text-center">{error}</p>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pribega-text text-pribega-bg py-3 font-body text-[10px] uppercase tracking-[0.25em] hover:bg-pribega-accent transition-colors duration-300 disabled:opacity-50"
            data-testid="admin-login-btn"
          >
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
  const [loading, setLoading] = useState(true);
  const [editingServices, setEditingServices] = useState(false);

  const getAuthHeader = () => {
    const auth = localStorage.getItem('adminAuth');
    return { Authorization: `Basic ${auth}` };
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, contactsRes, servicesRes, settingsRes] = await Promise.all([
        axios.get(`${API}/admin/stats`, { headers: getAuthHeader() }),
        axios.get(`${API}/admin/contacts`, { headers: getAuthHeader() }),
        axios.get(`${API}/admin/services`, { headers: getAuthHeader() }),
        axios.get(`${API}/admin/settings`, { headers: getAuthHeader() }),
      ]);
      setStats(statsRes.data);
      setContacts(contactsRes.data);
      setServices(servicesRes.data);
      setSettings(settingsRes.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        localStorage.removeItem('adminAuth');
        onLogout();
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

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
    } catch (err) { 
      alert('Ошибка отправки');
    }
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

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  const tabs = [
    { id: 'contacts', label: 'Заявки', icon: Users },
    { id: 'services', label: 'Услуги', icon: Edit3 },
    { id: 'settings', label: 'Настройки', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-pribega-bg">
      {/* Header */}
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
        {/* Stats */}
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

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-pribega-border">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-body text-xs uppercase tracking-[0.15em] transition-colors border-b-2 -mb-px ${
                activeTab === tab.id 
                  ? 'text-pribega-accent border-pribega-accent' 
                  : 'text-pribega-text-secondary border-transparent hover:text-pribega-text'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
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
                    <motion.div 
                      key={contact.id}
                      className={`bg-pribega-surface border p-4 flex items-center gap-4 ${
                        contact.status === 'new' ? 'border-pribega-accent' : 'border-pribega-border'
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <p className="font-heading text-base font-light text-pribega-text">{contact.name}</p>
                          {contact.status === 'new' && (
                            <span className="px-2 py-0.5 bg-pribega-accent/10 text-pribega-accent font-body text-[9px] uppercase tracking-wider">
                              Новая
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <a href={`tel:${contact.phone}`} className="flex items-center gap-1 font-body text-sm text-pribega-text hover:text-pribega-accent">
                            <Phone size={12} />
                            {contact.phone}
                          </a>
                          <span className="flex items-center gap-1 font-body text-xs text-pribega-text-secondary">
                            <Calendar size={12} />
                            {formatDate(contact.created_at)}
                          </span>
                          <span className="font-body text-[10px] uppercase tracking-wider text-pribega-text-secondary">
                            {contact.source}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {contact.status === 'new' && (
                          <button 
                            onClick={() => updateContactStatus(contact.id, 'processed')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Обработано"
                          >
                            <Check size={16} />
                          </button>
                        )}
                        <button 
                          onClick={() => deleteContact(contact.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                          title="Удалить"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
              <div className="space-y-6">
                <div className="flex justify-end">
                  {editingServices ? (
                    <div className="flex gap-2">
                      <button onClick={() => setEditingServices(false)} className="px-4 py-2 border border-pribega-border font-body text-xs uppercase tracking-wider text-pribega-text-secondary hover:border-pribega-text transition-colors">
                        <X size={14} className="inline mr-1" />
                        Отмена
                      </button>
                      <button onClick={saveServices} className="px-4 py-2 bg-pribega-accent text-white font-body text-xs uppercase tracking-wider hover:bg-pribega-text transition-colors">
                        <Save size={14} className="inline mr-1" />
                        Сохранить
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setEditingServices(true)} className="px-4 py-2 border border-pribega-border font-body text-xs uppercase tracking-wider text-pribega-text-secondary hover:border-pribega-accent hover:text-pribega-accent transition-colors">
                      <Edit3 size={14} className="inline mr-1" />
                      Редактировать
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
                              <input
                                type="text"
                                value={item.name}
                                onChange={(e) => updateServiceItem(catIndex, itemIndex, 'name', e.target.value)}
                                className="flex-1 bg-pribega-bg border border-pribega-border px-3 py-2 font-body text-sm text-pribega-text focus:border-pribega-accent focus:outline-none"
                              />
                              <input
                                type="text"
                                value={item.price}
                                onChange={(e) => updateServiceItem(catIndex, itemIndex, 'price', e.target.value)}
                                className="w-24 bg-pribega-bg border border-pribega-border px-3 py-2 font-body text-sm text-pribega-text focus:border-pribega-accent focus:outline-none text-right"
                              />
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
                        <label className="font-body text-[10px] uppercase tracking-[0.2em] text-pribega-text-secondary block mb-2">
                          Chat ID канала/группы
                        </label>
                        <input
                          type="text"
                          value={settings.chat_id || ''}
                          onChange={(e) => setSettings({ ...settings, chat_id: e.target.value })}
                          placeholder="-1001234567890"
                          className="w-full bg-pribega-bg border border-pribega-border px-4 py-3 font-body text-sm text-pribega-text focus:border-pribega-accent focus:outline-none"
                          data-testid="telegram-chat-id"
                        />
                        <p className="font-body text-[10px] text-pribega-text-secondary mt-2">
                          Добавьте бота в канал и получите Chat ID через @userinfobot
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={saveSettings}
                          className="px-6 py-3 bg-pribega-text text-pribega-bg font-body text-[10px] uppercase tracking-[0.2em] hover:bg-pribega-accent transition-colors"
                        >
                          Сохранить
                        </button>
                        <button
                          onClick={testTelegram}
                          className="px-6 py-3 border border-pribega-border font-body text-[10px] uppercase tracking-[0.2em] text-pribega-text-secondary hover:border-pribega-accent hover:text-pribega-accent transition-colors"
                        >
                          <Send size={12} className="inline mr-1" />
                          Тест
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
    if (auth) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return <Dashboard onLogout={handleLogout} />;
}
