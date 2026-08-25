import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Check, ChevronDown, CircleHelp, Copy, Globe2, Heart, Info, KeyRound, ShieldCheck, Sparkles, Swords, Trophy, UserRound, X, Zap } from 'lucide-react';

type Language = 'en' | 'es' | 'pt' | 'ru';
type Game = { id: string; name: string; description: string; tag: string; banner: string; icon: typeof Zap; url: string };

const copy = {
  en: {
    welcome: 'Welcome to the Condo',
    subtitle: 'The ultimate destination for exclusive Roblox games. Pick your game, jump in, and dominate.',
    featured: 'Featured Games',
    available: '4 games available',
    action: 'Action',
    social: 'Social',
    combat: 'Combat',
    exclusive: 'Exclusive',
    play: 'Play Now',
    entry: 'Entry Requirements',
    account: 'Accounts under 80 days old',
    security: 'Our game uses advanced security bots to protect against reports and ensure a safe experience.',
    note: 'are not allowed to join in order to prevent abuse and keep our experiences online.',
    generate: 'Generate your',
    tokenNote: 'below to verify your session and enter the game.',
    generateAccess: 'Generate Access Token',
    access: 'Access Game',
    copied: 'Token copied to clipboard',
    generated: 'Access token generated',
    warning: 'Generate a token first to access the game.',
    choose: 'Choose your language',
    chooseNote: 'Select a language to continue to Roblox Condo.',
    language: 'Language',
  },
  es: {
    welcome: 'Bienvenido al Condo',
    subtitle: 'El destino definitivo para juegos exclusivos de Roblox. Elige tu juego, entra y domina.',
    featured: 'Juegos Destacados', available: '4 juegos disponibles', action: 'Acción', social: 'Social', combat: 'Combate', exclusive: 'Exclusivo', play: 'Jugar Ahora',
    entry: 'Requisitos de Entrada', account: 'Cuentas menores de 80 días', security: 'Nuestro juego utiliza bots de seguridad avanzados para proteger contra reportes y garantizar una experiencia segura.', note: 'no pueden unirse para evitar abusos y mantener nuestras experiencias en línea.',
    generate: 'Genera tu', tokenNote: 'a continuación para verificar tu sesión y entrar al juego.', generateAccess: 'Generar Token de Acceso', access: 'Acceder al Juego', copied: 'Token copiado', generated: 'Token de acceso generado', warning: 'Genera un token primero para acceder al juego.', choose: 'Elige tu idioma', chooseNote: 'Selecciona un idioma para continuar.', language: 'Idioma',
  },
  pt: {
    welcome: 'Bem-vindo ao Condo',
    subtitle: 'O destino definitivo para jogos exclusivos de Roblox. Escolha seu jogo, entre e domine.',
    featured: 'Jogos em Destaque', available: '4 jogos disponíveis', action: 'Ação', social: 'Social', combat: 'Combate', exclusive: 'Exclusivo', play: 'Jogar Agora',
    entry: 'Requisitos de Entrada', account: 'Contas com menos de 80 dias', security: 'Nosso jogo usa bots de segurança avançados para proteger contra denúncias e garantir uma experiência segura.', note: 'não têm permissão para entrar, a fim de evitar abusos e manter nossas experiências online.',
    generate: 'Gere seu', tokenNote: 'abaixo para verificar sua sessão e entrar no jogo.', generateAccess: 'Gerar Token de Acesso', access: 'Acessar Jogo', copied: 'Token copiado', generated: 'Token de acesso gerado', warning: 'Gere um token primeiro para acessar o jogo.', choose: 'Escolha seu idioma', chooseNote: 'Selecione um idioma para continuar.', language: 'Idioma',
  },
  ru: {
    welcome: 'Добро пожаловать в Condo',
    subtitle: 'Лучшее место для эксклюзивных игр Roblox. Выбери игру, врывайся и побеждай.',
    featured: 'Избранные игры', available: '4 игры доступны', action: 'Экшн', social: 'Социальное', combat: 'Боевое', exclusive: 'Эксклюзив', play: 'Играть',
    entry: 'Требования для входа', account: 'Аккаунты моложе 80 дней', security: 'Наша игра использует продвинутые боты безопасности для защиты от жалоб и обеспечения безопасного опыта.', note: 'не могут присоединиться, чтобы предотвратить злоупотребления и сохранить наши серверы.',
    generate: 'Создайте свой', tokenNote: 'ниже, чтобы подтвердить сессию и войти в игру.', generateAccess: 'Создать токен доступа', access: 'Войти в игру', copied: 'Токен скопирован', generated: 'Токен доступа создан', warning: 'Сначала создайте токен, чтобы войти в игру.', choose: 'Выберите язык', chooseNote: 'Выберите язык, чтобы продолжить.', language: 'Язык',
  },
} as const;

const languageNames: Record<Language, string> = { en: 'English', es: 'Español', pt: 'Português', ru: 'Русский' };

function Logo() {
  return <div className="brand-mark" aria-hidden="true"><Globe2 /></div>;
}

function GameIcon({ icon: Icon }: { icon: Game['icon'] }) {
  return <Icon aria-hidden="true" />;
}

function App() {
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('rc2_lang') as Language) || 'en');
  const [showLanguage, setShowLanguage] = useState(() => !localStorage.getItem('rc2_lang'));
  const [selected, setSelected] = useState<Game | null>(null);
  const [token, setToken] = useState('');
  const [toast, setToast] = useState('');
  const t = copy[language];

  const games = useMemo<Game[]>(() => [
    { id: 'fun-combat', name: 'Fun Combat', description: 'Jump into intense battles with friends. Fast-paced action with unique mechanics and epic arenas that keep you on the edge of your seat.', tag: t.action, banner: '/assets/hero-banner.png', icon: Zap, url: 'https://www.roblox.com/games/120550559221143/Fur-Infection-OutBreak' },
    { id: 'sex-game', name: 'Sex Game', description: 'Explore a creative interactive world filled with challenges, surprises, and social gameplay. Connect with players from around the globe.', tag: t.social, banner: '/assets/hero-banner.png', icon: Heart, url: 'https://www.roblox.com/games/134922313437159/Titles-Another-Infection-Game' },
    { id: 'sword-game', name: 'Sword Game', description: 'Master the art of blade combat. Duel opponents, unlock legendary weapons, and rise through the ranks to become the ultimate swordsman.', tag: t.combat, banner: '/assets/alt-banner.png', icon: Swords, url: 'https://www.roblox.com/games/14153443454/Meet-a-neko' },
    { id: 'sword-game-duplicate', name: 'Sword Game', description: 'Master the art of blade combat. Duel opponents, unlock legendary weapons, and rise through the ranks to become the ultimate swordsman.', tag: t.combat, banner: '/assets/alt-banner.png', icon: Swords, url: 'https://www.roblox.com/games/76838459031868/just-an-innocent-game' },
  ], [t]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  function changeLanguage(next: Language) {
    setLanguage(next);
    localStorage.setItem('rc2_lang', next);
    setShowLanguage(false);
  }

  function openGame(game: Game) {
    setSelected(game);
    setToken('');
  }

  function generateToken() {
    const value = `RC-${crypto.randomUUID().replaceAll('-', '').slice(0, 24).toUpperCase()}`;
    setToken(value);
    setToast(t.generated);
  }

  function accessGame() {
    if (!token) {
      setToast(t.warning);
      return;
    }
    if (selected) {
      window.open(selected.url, '_blank', 'noopener,noreferrer');
      setToast(`${t.play}: ${selected.name}`);
    }
  }

  async function copyToken() {
    if (!token) return;
    await navigator.clipboard?.writeText(token);
    setToast(t.copied);
  }

  return (
    <div className="site-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <button className="brand" data-testid="button-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Logo /><span>Roblox Condo</span>
          </button>
          <div className="topbar-actions">
            <div className="online-pill" data-testid="status-online"><span className="online-dot" /> servers online</div>
            <button className="lang-button" data-testid="button-language" onClick={() => setShowLanguage(true)} aria-label={t.language}>
              <Globe2 size={14} /> {language.toUpperCase()} <ChevronDown size={13} />
            </button>
          </div>
        </div>
      </header>

      <main className="container">
        <section className="hero" data-testid="section-hero">
          <div className="eyebrow"><Sparkles size={13} /> private experiences / live</div>
          <h1>{t.welcome.split(' ').slice(0, -1).join(' ')} <span>{t.welcome.split(' ').at(-1)}</span></h1>
          <p>{t.subtitle}</p>
          <div className="hero-rule" />
        </section>

        <section aria-labelledby="featured-title">
          <div className="section-head">
            <div><div className="section-kicker">01 / choose your experience</div><h2 id="featured-title">{t.featured}</h2></div>
            <span className="section-count">{t.available}</span>
          </div>
          <div className="games">
            {games.map((game) => (
              <button key={game.id} className="game-card" data-testid={`card-game-${game.id}`} onClick={() => openGame(game)}>
                <span className="game-icon"><GameIcon icon={game.icon} /></span>
                <span className="game-copy">
                  <span className="game-name">{game.name}</span>
                  <span className="game-description">{game.description}</span>
                  <span className="game-meta"><span className="tag">{game.tag}</span><span className="game-status"><span className="online-dot" /> available now</span></span>
                </span>
                <span className="game-arrow"><ArrowRight size={16} /></span>
              </button>
            ))}
          </div>
        </section>

        <section aria-labelledby="requirements-title">
          <div className="section-head"><div><div className="section-kicker">02 / play responsibly</div><h2 id="requirements-title">{t.entry}</h2></div></div>
          <div className="requirements">
            <div className="info-panel" data-testid="info-account-age">
              <div className="info-label"><UserRound size={16} /> {t.account}</div><p>{t.note}</p>
            </div>
            <div className="info-panel" data-testid="info-security">
              <div className="info-label"><ShieldCheck size={16} /> safety first</div><p>{t.security}</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer"><div className="container footer-inner"><span>Roblox Condo</span><span className="footer-note">visual preview / no data collected</span></div></footer>

      {selected && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setSelected(null)}>
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="game-modal-title">
            <button className="modal-close" data-testid="button-close-modal" onClick={() => setSelected(null)} aria-label="Close"><X size={17} /></button>
            <div className="modal-banner"><img src={selected.banner} alt="" /><span className="modal-icon"><GameIcon icon={selected.icon} /></span></div>
            <div className="modal-content">
              <h2 className="modal-title" id="game-modal-title">{selected.name}</h2>
              <p className="modal-copy">{selected.description}</p>
              <div className="requirement-box"><strong><CircleHelp /> {t.generate} <span className="tag">{t.exclusive}</span></strong><p>{t.tokenNote}</p></div>
              {token && <div className="token-box"><KeyRound size={15} color="#60a5fa" /><span className="token-text" data-testid="text-access-token">{token}</span><button className="copy-button" data-testid="button-copy-token" onClick={copyToken} aria-label={t.copied}><Copy size={14} /></button></div>}
              <div className="modal-actions">
                <button className="primary-button" data-testid="button-generate-token" onClick={generateToken}><KeyRound size={16} /> {token ? t.generated : t.generateAccess}</button>
                <button className="secondary-button" data-testid="button-access-game" onClick={accessGame}><Trophy size={16} /> {t.access}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast" data-testid="status-toast"><Check size={14} style={{ verticalAlign: 'middle', marginRight: 7 }} />{toast}</div>}

      {showLanguage && (
        <div className="language-overlay">
          <div className="language-card" role="dialog" aria-labelledby="language-title">
            <div className="language-logo"><Globe2 size={22} /></div>
            <h2 id="language-title">{t.choose}</h2>
            <p>{t.chooseNote}</p>
            <div className="language-options">
              {(Object.keys(languageNames) as Language[]).map((key) => <button className="language-option" data-testid={`button-language-${key}`} key={key} onClick={() => changeLanguage(key)}>{languageNames[key]}</button>)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;