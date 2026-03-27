import { Shield, Award, Globe, Phone, Mail, MapPin, CheckCircle } from 'lucide-react';
import VaultLogo from '../components/VaultLogo';
const certifications = ['FSCA Regulated','ISO 9001:2015 Certified','PCI DSS Level 1 Compliant','SABS Certified','AMSEC UL Listed Vault Storage','SANS/IEC 27001 Certified'];
const milestones = [{year:'1980',event:'VaultSecure SA founded in Johannesburg'},{year:'1995',event:'Received FSCA regulatory certification'},{year:'2000',event:'Achieved ISO 9001 certification'},{year:'2010',event:'Expanded to serve over 1,000 clients'},{year:'2018',event:'Launched digital client portal'},{year:'2024',event:'Celebrating 44 years of protecting generational wealth'}];
export default function About() {
  return (
    <div className="max-w-4xl space-y-8">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-amber-400/20 rounded-2xl p-8 text-center">
        <div className="flex justify-center mb-5"><VaultLogo size={80}/></div>
        <h1 className="text-4xl font-bold text-white mb-3">VaultSecure SA</h1>
        <p className="text-amber-400 text-xl font-medium mb-4">Protecting Generational Wealth Since 1980</p>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed">For over four decades, VaultSecure SA has been South Africa's most trusted name in secure asset storage.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[{icon:Shield,title:'Our Mission',desc:'To provide the highest level of security for our clients\' most valuable assets.'},{icon:Award,title:'Our Values',desc:'Integrity, discretion, and excellence guide everything we do.'},{icon:Globe,title:'Our Reach',desc:'Serving high-net-worth individuals across Southern Africa and beyond.'}].map(item=>(
          <div key={item.title} className="bg-slate-900 border border-amber-400/20 rounded-xl p-6"><div className="p-2 bg-amber-400/10 rounded-lg w-fit mb-4"><item.icon size={22} className="text-amber-400"/></div><h3 className="text-white font-semibold mb-2">{item.title}</h3><p className="text-slate-400 text-sm">{item.desc}</p></div>
        ))}
      </div>
      <div className="bg-slate-900 border border-amber-400/20 rounded-xl p-6">
        <h2 className="text-white font-semibold text-xl mb-6">Our History</h2>
        <div className="space-y-4">{milestones.map((m,i)=>(
          <div key={i} className="flex gap-4"><div className="flex flex-col items-center"><div className="w-12 h-8 bg-amber-400/10 border border-amber-400/30 rounded-lg flex items-center justify-center flex-shrink-0"><span className="text-amber-400 text-xs font-bold">{m.year}</span></div>{i<milestones.length-1&&<div className="w-px flex-1 bg-slate-700 mt-2"/>}</div><div className="pb-4"><p className="text-slate-300 text-sm">{m.event}</p></div></div>
        ))}</div>
      </div>
      <div className="bg-slate-900 border border-amber-400/20 rounded-xl p-6">
        <h2 className="text-white font-semibold text-xl mb-5">Certifications</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{certifications.map((c,i)=><div key={i} className="flex items-start gap-3"><CheckCircle size={16} className="text-green-400 mt-0.5 flex-shrink-0"/><span className="text-slate-300 text-sm">{c}</span></div>)}</div>
      </div>
      <div className="bg-slate-900 border border-amber-400/20 rounded-xl p-6">
        <h2 className="text-white font-semibold text-xl mb-5">Contact</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">{[{icon:Phone,label:'Phone',value:'+27 11 800 1980',sub:'Mon-Fri 8am-6pm'},{icon:Mail,label:'Email',value:'support@vaultsecure.co.za',sub:'24/7 support'},{icon:MapPin,label:'Address',value:'1 Vault Tower, Sandton',sub:'Johannesburg, 2196'}].map(c=>(
          <div key={c.label} className="flex items-start gap-3 p-4 bg-slate-800 rounded-xl"><div className="p-2 bg-amber-400/10 rounded-lg"><c.icon size={16} className="text-amber-400"/></div><div><p className="text-slate-500 text-xs uppercase tracking-wide mb-1">{c.label}</p><p className="text-white text-sm font-medium">{c.value}</p><p className="text-slate-500 text-xs mt-0.5">{c.sub}</p></div></div>
        ))}</div>
      </div>
    </div>
  );
}
