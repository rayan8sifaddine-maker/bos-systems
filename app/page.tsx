// app/page.tsx
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'BOS Systems — Le systeme d\'exploitation des PME marocaines',
}

const STATS = [
  { value: '−78%', label: 'de rendez-vous manques' },
  { value: '24/7', label: 'disponibilite IA' },
  { value: '+40%', label: 'de clients convertis' },
  { value: '3 sec', label: 'temps de reponse moyen' },
]

const FEATURES = [
  {
    icon: '💬',
    title: 'Assistant IA WhatsApp',
    desc: 'Repond a vos clients instantanement, 24h/24. Tarifs, disponibilites, FAQ — l\'IA gere dans votre style.'
  },
  {
    icon: '📅',
    title: 'Gestion des rendez-vous',
    desc: 'Le client demande un creneau, l\'IA consulte l\'agenda, propose et confirme. Zero friction.'
  },
  {
    icon: '🔔',
    title: 'Rappels automatiques',
    desc: 'Un rappel la veille, un autre 2h avant. Le taux de no-show chute de 78%.'
  },
  {
    icon: '📊',
    title: 'Dashboard dirigeant',
    desc: 'Prospects, conversions, CA, performance equipe — tout en temps reel sur une seule vue.'
  },
  {
    icon: '🔄',
    title: 'Relances intelligentes',
    desc: 'BOS identifie les clients inactifs et les relance automatiquement au bon moment.'
  },
  {
    icon: '👥',
    title: 'CRM integre',
    desc: 'Historique complet de chaque client, notes, tags, activites — tout centralise.'
  },
]

const SECTORS = [
  { icon: '🏥', name: 'Cliniques', desc: 'RDV, suivis, rappels' },
  { icon: '🚗', name: 'Garages', desc: 'Devis, entretiens' },
  { icon: '🏠', name: 'Immobilier', desc: 'Visites, prospects' },
  { icon: '🎓', name: 'Ecoles privees', desc: 'Inscriptions, infos' },
  { icon: '⚖️', name: 'Avocats', desc: 'Consultations' },
  { icon: '💇', name: 'Salons', desc: 'RDV, fidelisation' },
  { icon: '🏨', name: 'Hotels & Riads', desc: 'Reservations' },
  { icon: '🍽️', name: 'Restaurants', desc: 'Tables, menus' },
]

const FAQS = [
  {
    q: 'Est-ce que BOS fonctionne avec mon WhatsApp actuel ?',
    a: 'Oui. On connecte votre numero WhatsApp Business existant. La configuration prend moins de 10 minutes.'
  },
  {
    q: 'Ai-je besoin de competences techniques ?',
    a: 'Aucune. BOS est concu pour les dirigeants de PME, pas pour les developpeurs. Interface intuitive, support inclus.'
  },
  {
    q: 'Mes donnees sont-elles securisees ?',
    a: 'Vos donnees sont chiffrees, stockees au Maroc, et ne sont jamais partagees. Conformite RGPD complète.'
  },
  {
    q: 'Puis-je annuler a tout moment ?',
    a: 'Oui. Aucun engagement. Vous annulez quand vous voulez depuis votre espace client.'
  },
  {
    q: 'Est-ce que l\'essai gratuit necessite une carte bancaire ?',
    a: 'Non. 14 jours d\'essai gratuit sans carte bancaire. Vous passez au payant uniquement si vous etes satisfait.'
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 md:px-12 bg-white/90 backdrop-blur-xl border-b border-[rgba(12,14,18,0.06)]">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#0C0E12] rounded-lg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="6" height="6" rx="1.5" fill="white"/>
              <rect x="9" y="1" width="6" height="6" rx="1.5" fill="white" opacity=".5"/>
              <rect x="1" y="9" width="6" height="6" rx="1.5" fill="white" opacity=".5"/>
              <rect x="9" y="9" width="6" height="6" rx="1.5" fill="white"/>
            </svg>
          </div>
          <span className="font-bold text-[15px] tracking-wide text-[#0C0E12]">BOS SYSTEMS</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {[['Fonctionnalites', '/fonctionnalites'], ['Secteurs', '/secteurs'], ['Tarifs', '/tarifs'], ['Blog', '/blog']].map(([label, href]) => (
            <Link key={href} href={href} className="px-4 py-2 text-sm text-[#3A3D45] hover:text-[#0C0E12] hover:bg-[#F7F8FA] rounded-lg transition-all">
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/connexion" className="hidden md:block px-4 py-2 text-sm text-[#3A3D45] border border-[rgba(12,14,18,0.1)] rounded-xl hover:bg-[#F7F8FA] transition-all">
            Se connecter
          </Link>
          <Link href="/inscription" className="btn-primary text-sm px-5 py-2.5">
            Commencer gratuitement
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-32 pb-24 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 bg-[#EEF2FF] border border-[rgba(26,86,255,0.15)] rounded-full text-[#1A56FF] text-xs font-semibold tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1A56FF] animate-pulse"></span>
            Disponible au Maroc — Essai 14 jours gratuit
          </div>

          <h1 className="text-[52px] md:text-[72px] lg:text-[88px] font-bold leading-[1.02] tracking-tight text-[#0C0E12] mb-8">
            L'infrastructure client<br />
            des <span className="text-gradient">PME modernes.</span>
          </h1>

          <p className="text-xl text-[#3A3D45] leading-relaxed max-w-2xl mx-auto mb-12 font-light">
            BOS remplace WhatsApp, Excel et le carnet papier par un systeme intelligent — rendez-vous automatises, reponses instantanees, visibilite totale.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link href="/inscription" className="btn-primary px-8 py-4 text-base">
              Commencer gratuitement
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
            <Link href="/demo" className="btn-secondary px-8 py-4 text-base">
              Voir la demo
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l6 4-6 4V4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 border-t border-[rgba(12,14,18,0.06)]">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold text-[#0C0E12] tracking-tight">{s.value}</div>
                <div className="text-sm text-[#7A7F8E] mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTORS TICKER */}
      <div className="border-y border-[rgba(12,14,18,0.06)] py-4 bg-[#F7F8FA] overflow-hidden">
        <div className="flex gap-8 whitespace-nowrap animate-[ticker_20s_linear_infinite]" style={{animation: 'none'}}>
          {[...SECTORS, ...SECTORS].map((s, i) => (
            <span key={i} className="inline-flex items-center gap-2 text-sm text-[#7A7F8E] px-4">
              <span>{s.icon}</span> {s.name}
            </span>
          ))}
        </div>
      </div>

      {/* PROBLEM */}
      <section className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="section-label">Le probleme</div>
        <h2 className="text-[40px] md:text-[52px] font-bold leading-tight tracking-tight text-[#0C0E12] mb-6 max-w-2xl">
          Vos outils actuels vous coutent des clients.
        </h2>
        <p className="text-lg text-[#3A3D45] max-w-xl mb-16 font-light leading-relaxed">
          Des centaines de milliers de PME marocaines perdent des revenus chaque jour a cause d'outils non conçus pour la gestion client.
        </p>

        <div className="grid md:grid-cols-2 gap-px bg-[rgba(12,14,18,0.06)] border border-[rgba(12,14,18,0.06)] rounded-2xl overflow-hidden">
          {[
            { n: '01', t: 'Messages perdus dans WhatsApp', d: 'Un client ecrit, sa demande se noie dans 200 autres conversations. Il ne rappellera pas.' },
            { n: '02', t: 'Rendez-vous non confirmes', d: 'Sans rappel automatique, 18% des patients ne se presentent pas. Ce sont des creneaux vides.' },
            { n: '03', t: 'Disponibilite limitee', d: 'Un client qui cherche un RDV a 22h ne peut pas etre servi. Il ira chez le concurrent.' },
            { n: '04', t: 'Zero donnees decisionnelles', d: 'Vous ne savez pas combien de prospects vous avez perdus ce mois. Vous ne pouvez pas decider.' },
          ].map((item) => (
            <div key={item.n} className="p-8 bg-white hover:bg-[#F7F8FA] transition-colors">
              <div className="text-xs font-mono text-[#B0B5C3] mb-4">{item.n}</div>
              <div className="text-base font-semibold text-[#0C0E12] mb-2">{item.t}</div>
              <div className="text-sm text-[#7A7F8E] leading-relaxed">{item.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-6 md:px-12 max-w-6xl mx-auto border-t border-[rgba(12,14,18,0.06)]">
        <div className="section-label">Fonctionnalites</div>
        <h2 className="text-[40px] md:text-[52px] font-bold leading-tight tracking-tight text-[#0C0E12] mb-6 max-w-2xl">
          Tout ce dont votre entreprise a besoin.
        </h2>
        <p className="text-lg text-[#3A3D45] max-w-xl mb-16 font-light leading-relaxed">
          Chaque fonctionnalite resout un probleme reel. Rien d'inutile.
        </p>

        <div className="grid md:grid-cols-3 gap-px bg-[rgba(12,14,18,0.06)] border border-[rgba(12,14,18,0.06)] rounded-2xl overflow-hidden">
          {FEATURES.map((f) => (
            <div key={f.title} className="p-8 bg-white hover:bg-[#F7F8FA] transition-colors group">
              <div className="text-2xl mb-4">{f.icon}</div>
              <div className="text-base font-semibold text-[#0C0E12] mb-2">{f.title}</div>
              <div className="text-sm text-[#7A7F8E] leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/fonctionnalites" className="btn-secondary">
            Voir toutes les fonctionnalites →
          </Link>
        </div>
      </section>

      {/* SECTORS */}
      <section className="py-24 px-6 md:px-12 max-w-6xl mx-auto border-t border-[rgba(12,14,18,0.06)]">
        <div className="section-label">Secteurs</div>
        <h2 className="text-[40px] md:text-[52px] font-bold leading-tight tracking-tight text-[#0C0E12] mb-16 max-w-2xl">
          Une plateforme. Tous les secteurs.
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {SECTORS.map((s) => (
            <div key={s.name} className="p-6 border border-[rgba(12,14,18,0.08)] rounded-2xl bg-white hover:border-[rgba(26,86,255,0.2)] hover:bg-[#EEF2FF] transition-all cursor-default group">
              <div className="text-2xl mb-3">{s.icon}</div>
              <div className="text-sm font-semibold text-[#0C0E12] mb-1">{s.name}</div>
              <div className="text-xs text-[#7A7F8E]">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING PREVIEW */}
      <section className="py-24 px-6 md:px-12 max-w-6xl mx-auto border-t border-[rgba(12,14,18,0.06)]">
        <div className="section-label">Tarifs</div>
        <h2 className="text-[40px] md:text-[52px] font-bold leading-tight tracking-tight text-[#0C0E12] mb-4 max-w-2xl">
          Simple. Transparent. Sans surprise.
        </h2>
        <p className="text-lg text-[#3A3D45] mb-16 font-light">Abonnement mensuel. Annulez a tout moment.</p>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            { plan: 'Starter', price: '500', period: 'DH/mois', featured: false, cta: 'Commencer', features: ['Assistant IA WhatsApp', 'Gestion des RDV', 'Rappels automatiques', '200 conversations/mois', '1 utilisateur'] },
            { plan: 'Pro', price: '1 500', period: 'DH/mois', featured: true, cta: 'Commencer', features: ['Tout ce qui est dans Starter', 'Relances automatiques', 'CRM complet', 'Conversations illimitees', '3 utilisateurs', 'Support prioritaire'] },
            { plan: 'Enterprise', price: 'Sur devis', period: '', featured: false, cta: 'Nous contacter', features: ['Tout ce qui est dans Pro', 'Configuration sur mesure', 'Integrations personnalisees', 'Utilisateurs illimites', 'Account manager dedie'] },
          ].map((p) => (
            <div key={p.plan} className={`p-8 rounded-2xl border ${p.featured ? 'bg-[#0C0E12] border-[#0C0E12] scale-[1.02]' : 'bg-white border-[rgba(12,14,18,0.08)]'} transition-transform`}>
              {p.featured && <div className="inline-block px-3 py-1 bg-white/10 text-white/70 text-xs font-semibold tracking-wider uppercase rounded-full mb-4">Le plus choisi</div>}
              <div className={`text-xs font-semibold tracking-wider uppercase mb-3 ${p.featured ? 'text-white/50' : 'text-[#7A7F8E]'}`}>{p.plan}</div>
              <div className={`text-4xl font-bold tracking-tight mb-1 ${p.featured ? 'text-white' : 'text-[#0C0E12]'}`}>{p.price}</div>
              <div className={`text-sm mb-6 ${p.featured ? 'text-white/40' : 'text-[#7A7F8E]'}`}>{p.period}</div>
              <hr className={`mb-6 ${p.featured ? 'border-white/10' : 'border-[rgba(12,14,18,0.06)]'}`} />
              <ul className="space-y-2.5 mb-8">
                {p.features.map((f) => (
                  <li key={f} className={`flex items-center gap-2.5 text-sm ${p.featured ? 'text-white/70' : 'text-[#3A3D45]'}`}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7l3 3 6-6" stroke={p.featured ? 'white' : '#1A56FF'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={p.plan === 'Enterprise' ? '/contact' : '/inscription'} className={`block text-center py-3 rounded-xl text-sm font-medium transition-all ${p.featured ? 'bg-white text-[#0C0E12] hover:bg-gray-100' : 'border border-[rgba(12,14,18,0.1)] text-[#0C0E12] hover:bg-[#F7F8FA]'}`}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 md:px-12 max-w-3xl mx-auto border-t border-[rgba(12,14,18,0.06)]">
        <div className="section-label">FAQ</div>
        <h2 className="text-[40px] font-bold tracking-tight text-[#0C0E12] mb-16">Questions frequentes</h2>

        <div className="space-y-0 divide-y divide-[rgba(12,14,18,0.06)]">
          {FAQS.map((faq) => (
            <details key={faq.q} className="group py-5 cursor-pointer list-none">
              <summary className="flex items-center justify-between text-base font-medium text-[#0C0E12] list-none">
                {faq.q}
                <svg className="flex-shrink-0 transition-transform group-open:rotate-180" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="#7A7F8E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </summary>
              <p className="mt-3 text-sm text-[#7A7F8E] leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-[#F7F8FA] border border-[rgba(12,14,18,0.06)] rounded-3xl p-12 md:p-16 overflow-hidden">
            <div className="absolute right-0 bottom-0 text-[180px] font-bold text-[rgba(12,14,18,0.04)] leading-none select-none pointer-events-none">BOS</div>
            <div className="relative z-10 max-w-xl">
              <div className="section-label mb-6">Pret a commencer</div>
              <h2 className="text-[40px] md:text-[52px] font-bold tracking-tight text-[#0C0E12] leading-tight mb-6">
                Votre entreprise merite un systeme qui tourne sans vous.
              </h2>
              <p className="text-lg text-[#3A3D45] mb-8 font-light">14 jours d'essai gratuit. Sans carte bancaire.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/inscription" className="btn-primary px-8 py-4 text-base">
                  Commencer gratuitement →
                </Link>
                <Link href="/contact" className="btn-secondary px-8 py-4 text-base">
                  Parler a l'equipe
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[rgba(12,14,18,0.06)] py-10 px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#0C0E12] rounded-lg flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="1" width="6" height="6" rx="1.5" fill="white"/>
                <rect x="9" y="1" width="6" height="6" rx="1.5" fill="white" opacity=".5"/>
                <rect x="1" y="9" width="6" height="6" rx="1.5" fill="white" opacity=".5"/>
                <rect x="9" y="9" width="6" height="6" rx="1.5" fill="white"/>
              </svg>
            </div>
            <span className="font-bold text-sm tracking-wide text-[#0C0E12]">BOS SYSTEMS</span>
          </div>
          <div className="flex items-center gap-6">
            {[['Confidentialite', '/legal/confidentialite'], ['Conditions', '/legal/conditions'], ['Contact', '/contact'], ['Blog', '/blog']].map(([label, href]) => (
              <Link key={href} href={href} className="text-sm text-[#7A7F8E] hover:text-[#0C0E12] transition-colors">{label}</Link>
            ))}
          </div>
          <div className="text-sm text-[#B0B5C3]">© 2025 BOS Systems — Casablanca, Maroc</div>
        </div>
      </footer>
    </div>
  )
}
