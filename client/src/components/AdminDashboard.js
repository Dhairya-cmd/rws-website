import React,{useState,useEffect,useRef} from 'react';
import './AdminDashboard.css';

const CATS=['Robotic Welding','Manual Welding','CNC Machining','Metal Fabrication','Fixture & Tooling','Sub-Assembly'];

const SVG={
  IconRoboticArm:()=><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="22" y="50" width="20" height="6" rx="1" fill="currentColor" fillOpacity=".15"/><line x1="32" y1="50" x2="32" y2="42"/><circle cx="32" cy="42" r="3" fill="currentColor" fillOpacity=".2"/><line x1="32" y1="42" x2="20" y2="26"/><circle cx="20" cy="26" r="2.5" fill="currentColor" fillOpacity=".2"/><line x1="20" y1="26" x2="36" y2="14"/><line x1="36" y1="14" x2="46" y2="18"/><path d="M46 17L50 19L48 23L44 21Z" fill="currentColor" fillOpacity=".3"/><circle cx="50" cy="22" r="1.2" fill="currentColor"/></svg>,
  IconWeldingTorch:()=><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 50L26 34" strokeWidth="3"/><rect x="24" y="30" width="14" height="10" rx="2" transform="rotate(-45 31 35)" fill="currentColor" fillOpacity=".2"/><path d="M38 26L46 18" strokeWidth="2"/><circle cx="48" cy="16" r="1.5" fill="currentColor"/><path d="M50 14l3-2M52 18l3-1M50 20l3 1" strokeWidth="1.5"/></svg>,
  IconCNC:()=><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="6" y="14" width="52" height="40" rx="2" fill="currentColor" fillOpacity=".08"/><line x1="10" y1="26" x2="54" y2="26"/><rect x="28" y="22" width="8" height="8" fill="currentColor" fillOpacity=".3"/><line x1="32" y1="30" x2="32" y2="38"/><path d="M28 38L36 38L34 42L30 42Z" fill="currentColor" fillOpacity=".4"/></svg>,
  IconFabrication:()=><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="8" y="8" width="36" height="36" rx="1" fill="currentColor" fillOpacity=".08"/><line x1="8" y1="20" x2="44" y2="20"/><line x1="8" y1="32" x2="44" y2="32"/><line x1="20" y1="8" x2="20" y2="44"/><line x1="32" y1="8" x2="32" y2="44"/><circle cx="46" cy="46" r="9" fill="currentColor" fillOpacity=".15"/><circle cx="46" cy="46" r="3" fill="currentColor" fillOpacity=".3"/></svg>,
  IconFixture:()=><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="6" y="46" width="52" height="8" rx="1" fill="currentColor" fillOpacity=".2"/><rect x="14" y="34" width="6" height="12" fill="currentColor" fillOpacity=".25"/><rect x="44" y="34" width="6" height="12" fill="currentColor" fillOpacity=".25"/><rect x="22" y="38" width="20" height="8" fill="currentColor" fillOpacity=".4"/><line x1="17" y1="34" x2="17" y2="22"/><line x1="47" y1="34" x2="47" y2="22"/><circle cx="17" cy="20" r="2.5" fill="currentColor" fillOpacity=".3"/><circle cx="47" cy="20" r="2.5" fill="currentColor" fillOpacity=".3"/></svg>,
  IconAssembly:()=><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 22L32 12L54 22L54 48L32 58L10 48Z" fill="currentColor" fillOpacity=".1"/><path d="M10 22L32 32L54 22"/><line x1="32" y1="32" x2="32" y2="58"/></svg>,
  IconForge:()=><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="12" y="34" width="40" height="20" rx="2" fill="currentColor" fillOpacity=".1"/><path d="M18 34L32 12L46 34"/><rect x="26" y="44" width="12" height="10" rx="1" fill="currentColor" fillOpacity=".3"/><path d="M28 20q2-4 4-2t4-2" strokeWidth="1.5" strokeDasharray="2 2"/></svg>,
  IconGear:()=><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="32" cy="32" r="10" fill="currentColor" fillOpacity=".12"/><circle cx="32" cy="32" r="4" fill="currentColor" fillOpacity=".3"/><path d="M32 14v5M32 45v5M14 32h5M45 32h5M19.5 19.5l3.5 3.5M41 41l3.5 3.5M44.5 19.5l-3.5 3.5M23 41l-3.5 3.5" strokeWidth="2.5"/></svg>,
  IconBlueprint:()=><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="10" y="10" width="44" height="44" rx="2" fill="currentColor" fillOpacity=".08"/><line x1="20" y1="22" x2="44" y2="22" strokeOpacity=".5"/><line x1="20" y1="32" x2="44" y2="32" strokeOpacity=".5"/><line x1="20" y1="42" x2="36" y2="42" strokeOpacity=".5"/><path d="M38 38l6 6M44 38l-6 6" strokeOpacity=".7"/></svg>,
  IconAnvil:()=><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M8 22Q32 28 56 22L52 40H12Z" fill="currentColor" fillOpacity=".12"/><path d="M8 22Q32 28 56 22L52 40H12Z"/><rect x="22" y="40" width="20" height="14" rx="1" fill="currentColor" fillOpacity=".2"/><rect x="18" y="50" width="28" height="6" rx="1" fill="currentColor" fillOpacity=".15"/><path d="M40 22V14Q48 12 50 8" strokeWidth="1.8"/></svg>,
  IconHammer:()=><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="8" y="20" width="30" height="16" rx="3" fill="currentColor" fillOpacity=".2"/><rect x="8" y="20" width="30" height="16" rx="3"/><line x1="32" y1="28" x2="56" y2="52" strokeWidth="5" strokeLinecap="round"/></svg>,
  IconLathe:()=><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="4" y="20" width="56" height="28" rx="2" fill="currentColor" fillOpacity=".07"/><circle cx="16" cy="34" r="8" fill="currentColor" fillOpacity=".1"/><circle cx="16" cy="34" r="4" fill="currentColor" fillOpacity=".2"/><rect x="30" y="26" width="22" height="16" rx="1" fill="currentColor" fillOpacity=".12"/><line x1="4" y1="48" x2="60" y2="48"/><rect x="8" y="48" width="8" height="8" fill="currentColor" fillOpacity=".2"/><rect x="48" y="48" width="8" height="8" fill="currentColor" fillOpacity=".2"/></svg>,
  IconDrill:()=><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="8" y="22" width="32" height="20" rx="2" fill="currentColor" fillOpacity=".12"/><path d="M40 28L56 32L40 36Z" fill="currentColor" fillOpacity=".25"/><line x1="20" y1="42" x2="20" y2="56"/><path d="M16 56h8M14 58h12"/><circle cx="20" cy="32" r="4" fill="currentColor" fillOpacity=".2"/></svg>,
  IconGrinder:()=><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="8" y="28" width="30" height="20" rx="2" fill="currentColor" fillOpacity=".1"/><circle cx="42" cy="36" r="12" fill="currentColor" fillOpacity=".08"/><circle cx="42" cy="36" r="8" strokeDasharray="3 2"/><circle cx="42" cy="36" r="3" fill="currentColor" fillOpacity=".3"/><path d="M8 36h10M30 28l4-8"/></svg>,
  IconPlasma:()=><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 8L16 24h8L12 56" strokeWidth="2.5"/><path d="M34 8L30 24h8L26 56" strokeWidth="2.5"/><path d="M48 8L44 24h8L40 56" strokeWidth="2.5"/><line x1="8" y1="24" x2="56" y2="24" strokeOpacity=".4"/></svg>,
  IconPipe:()=><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="6" y="24" width="52" height="16" rx="8" fill="currentColor" fillOpacity=".1"/><rect x="6" y="24" width="52" height="16" rx="8"/><ellipse cx="58" cy="32" rx="4" ry="8" fill="currentColor" fillOpacity=".15"/><ellipse cx="6" cy="32" rx="4" ry="8" fill="currentColor" fillOpacity=".15"/><line x1="10" y1="32" x2="54" y2="32" strokeOpacity=".3" strokeDasharray="4 4"/></svg>,
  IconValve:()=><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="32" cy="36" r="14" fill="currentColor" fillOpacity=".1"/><rect x="26" y="32" width="12" height="8" fill="currentColor" fillOpacity=".3"/><line x1="4" y1="36" x2="18" y2="36"/><line x1="46" y1="36" x2="60" y2="36"/><line x1="32" y1="8" x2="32" y2="22"/><line x1="24" y1="10" x2="40" y2="10" strokeWidth="3"/></svg>,
  IconPump:()=><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="36" cy="36" r="16" fill="currentColor" fillOpacity=".08"/><circle cx="36" cy="36" r="8" fill="currentColor" fillOpacity=".15"/><rect x="8" y="28" width="12" height="16" rx="1" fill="currentColor" fillOpacity=".2"/><line x1="20" y1="36" x2="28" y2="36"/><line x1="44" y1="36" x2="56" y2="36"/><line x1="36" y1="8" x2="36" y2="20"/></svg>,
  IconPress:()=><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="16" y="6" width="32" height="8" rx="1" fill="currentColor" fillOpacity=".2"/><rect x="22" y="14" width="20" height="28" rx="1" fill="currentColor" fillOpacity=".1"/><rect x="10" y="42" width="44" height="10" rx="1" fill="currentColor" fillOpacity=".2"/><rect x="18" y="52" width="28" height="6" rx="1" fill="currentColor" fillOpacity=".15"/><line x1="32" y1="6" x2="32" y2="14" strokeWidth="3"/></svg>,
  IconConveyor:()=><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="8" y1="36" x2="56" y2="36" strokeWidth="4"/><circle cx="12" cy="44" r="8" fill="currentColor" fillOpacity=".1"/><circle cx="12" cy="44" r="4" fill="currentColor" fillOpacity=".2"/><circle cx="52" cy="44" r="8" fill="currentColor" fillOpacity=".1"/><circle cx="52" cy="44" r="4" fill="currentColor" fillOpacity=".2"/><rect x="20" y="22" width="12" height="14" rx="1" fill="currentColor" fillOpacity=".3"/></svg>,
  IconWire:()=><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="32" cy="32" r="18" fill="currentColor" fillOpacity=".07"/><circle cx="32" cy="32" r="12" fill="currentColor" fillOpacity=".1"/><circle cx="32" cy="32" r="5" fill="currentColor" fillOpacity=".2"/><path d="M14 32Q20 20 32 20Q44 20 50 32" strokeDasharray="3 3" strokeOpacity=".6"/></svg>,
  IconShield:()=><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M32 8L54 18V36Q54 52 32 58Q10 52 10 36V18Z" fill="currentColor" fillOpacity=".1"/><path d="M32 8L54 18V36Q54 52 32 58Q10 52 10 36V18Z"/><path d="M22 34l8 8 14-16" strokeWidth="2.5"/></svg>,
  IconSafety:()=><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 20Q32 14 54 20V44Q54 56 32 60Q10 56 10 44Z" fill="currentColor" fillOpacity=".08"/><ellipse cx="32" cy="28" rx="12" ry="8" fill="currentColor" fillOpacity=".15"/><line x1="32" y1="20" x2="32" y2="36"/><line x1="24" y1="28" x2="40" y2="28"/></svg>,
  IconHelmet:()=><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 36Q10 14 32 14Q54 14 54 36" fill="currentColor" fillOpacity=".1"/><path d="M10 36Q10 14 32 14Q54 14 54 36"/><rect x="6" y="36" width="52" height="8" rx="1" fill="currentColor" fillOpacity=".2"/><rect x="18" y="44" width="28" height="6" rx="1" fill="currentColor" fillOpacity=".15"/><rect x="28" y="22" width="8" height="6" rx="1" fill="currentColor" fillOpacity=".3"/></svg>,
  IconWelder:()=><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="32" cy="14" r="8" fill="currentColor" fillOpacity=".15"/><path d="M18 30Q18 24 32 24Q46 24 46 30V50H18Z" fill="currentColor" fillOpacity=".1"/><line x1="18" y1="50" x2="14" y2="60"/><line x1="46" y1="50" x2="50" y2="60"/><path d="M38 36l8 10M46 36l-4 3" strokeWidth="1.5"/></svg>,
  IconTank:()=><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><ellipse cx="32" cy="20" rx="20" ry="8" fill="currentColor" fillOpacity=".15"/><rect x="12" y="20" width="40" height="28" fill="currentColor" fillOpacity=".08"/><rect x="12" y="20" width="40" height="28"/><ellipse cx="32" cy="48" rx="20" ry="8" fill="currentColor" fillOpacity=".15"/><line x1="32" y1="4" x2="32" y2="12"/><line x1="26" y1="8" x2="38" y2="8" strokeWidth="3"/></svg>,
  IconFilter:()=><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M8 14L26 34V54L38 48V34L56 14Z" fill="currentColor" fillOpacity=".1"/><path d="M8 14L26 34V54L38 48V34L56 14Z"/><line x1="8" y1="14" x2="56" y2="14"/></svg>,
  IconCrane:()=><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="8" x2="12" y2="56"/><line x1="12" y1="8" x2="52" y2="16"/><line x1="12" y1="14" x2="36" y2="18"/><line x1="52" y1="16" x2="52" y2="24"/><line x1="36" y1="18" x2="36" y2="26"/><rect x="30" y="26" width="12" height="10" rx="1" fill="currentColor" fillOpacity=".2"/><rect x="6" y="52" width="12" height="8" rx="1" fill="currentColor" fillOpacity=".2"/></svg>,
  IconMeasure:()=><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="6" y="24" width="52" height="16" rx="2" fill="currentColor" fillOpacity=".1"/><line x1="14" y1="24" x2="14" y2="30"/><line x1="22" y1="24" x2="22" y2="34"/><line x1="30" y1="24" x2="30" y2="30"/><line x1="38" y1="24" x2="38" y2="34"/><line x1="46" y1="24" x2="46" y2="30"/><line x1="54" y1="24" x2="54" y2="34"/><circle cx="22" cy="36" r="2" fill="currentColor"/><circle cx="38" cy="36" r="2" fill="currentColor"/></svg>,
  IconCaliper:()=><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="10" y1="10" x2="10" y2="54" strokeWidth="3"/><line x1="54" y1="10" x2="54" y2="54" strokeWidth="3"/><line x1="10" y1="10" x2="54" y2="10"/><line x1="10" y1="38" x2="30" y2="38"/><line x1="34" y1="38" x2="54" y2="38"/><line x1="10" y1="54" x2="22" y2="54"/><line x1="42" y1="54" x2="54" y2="54"/><rect x="28" y="32" width="8" height="28" rx="1" fill="currentColor" fillOpacity=".2"/></svg>,
  IconWrench:()=><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M16 10Q8 14 8 22Q8 30 16 32L42 56Q46 60 50 58Q54 56 54 52Q52 48 48 46L24 20Q26 10 16 10Z" fill="currentColor" fillOpacity=".12"/><path d="M16 10Q8 14 8 22Q8 30 16 32L42 56Q46 60 50 58Q54 56 54 52Q52 48 48 46L24 20Q26 10 16 10Z"/><circle cx="48" cy="52" r="3" fill="currentColor" fillOpacity=".4"/></svg>,
  IconBolt:()=><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="34,6 14,36 30,36 30,58 50,28 34,28" fill="currentColor" fillOpacity=".18"/><polygon points="34,6 14,36 30,36 30,58 50,28 34,28"/></svg>,
  IconSpanner:()=><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="16" cy="16" r="10" fill="currentColor" fillOpacity=".1"/><circle cx="16" cy="16" r="5" fill="currentColor" fillOpacity=".2"/><line x1="20" y1="20" x2="54" y2="54" strokeWidth="5"/><circle cx="54" cy="54" r="6" fill="currentColor" fillOpacity=".1"/><circle cx="54" cy="54" r="3" fill="currentColor" fillOpacity=".2"/></svg>,
  IconWireframe:()=><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="10" y="10" width="18" height="18" fill="currentColor" fillOpacity=".12"/><rect x="36" y="10" width="18" height="18" fill="currentColor" fillOpacity=".12"/><rect x="10" y="36" width="18" height="18" fill="currentColor" fillOpacity=".12"/><rect x="36" y="36" width="18" height="18" fill="currentColor" fillOpacity=".12"/><line x1="28" y1="19" x2="36" y2="19"/><line x1="28" y1="45" x2="36" y2="45"/><line x1="19" y1="28" x2="19" y2="36"/><line x1="45" y1="28" x2="45" y2="36"/></svg>,
  IconLaser:()=><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="8" y="24" width="24" height="16" rx="2" fill="currentColor" fillOpacity=".15"/><line x1="32" y1="32" x2="56" y2="32" strokeWidth="2.5"/><path d="M52 24l4 8-4 8" strokeWidth="1.5"/><circle cx="36" cy="32" r="2" fill="currentColor"/><path d="M50 14q2 4 0 8M54 10q4 6 0 12" strokeOpacity=".5" strokeWidth="1.5"/></svg>,
  IconArcWeld:()=><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="8" x2="32" y2="48" strokeWidth="3"/><line x1="32" y1="48" x2="52" y2="8" strokeWidth="1.5" strokeOpacity=".4"/><path d="M26 42q3 6 6 6t6-6" strokeWidth="1.5" strokeDasharray="2 2"/><path d="M30 50q-2 3 0 5M32 50q0 3 2 5" strokeWidth="1.5"/><circle cx="32" cy="48" r="3" fill="currentColor" fillOpacity=".4"/></svg>,
  IconSpray:()=><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="8" y="28" width="22" height="28" rx="2" fill="currentColor" fillOpacity=".12"/><rect x="30" y="20" width="10" height="14" rx="1" fill="currentColor" fillOpacity=".15"/><path d="M40 24Q50 20 54 28Q58 36 50 38"/><path d="M44 18l2-6M50 20l4-4M52 26l6-2" strokeWidth="1.5"/></svg>,
  IconInspect:()=><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="28" cy="26" r="16" fill="currentColor" fillOpacity=".08"/><line x1="40" y1="38" x2="56" y2="54" strokeWidth="4"/><circle cx="28" cy="26" r="10" strokeDasharray="3 3"/><line x1="22" y1="26" x2="34" y2="26"/><line x1="28" y1="20" x2="28" y2="32"/></svg>,
  IconCutting:()=><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="16" cy="48" r="8" fill="currentColor" fillOpacity=".12"/><circle cx="16" cy="48" r="4" fill="currentColor" fillOpacity=".2"/><circle cx="16" cy="16" r="8" fill="currentColor" fillOpacity=".12"/><circle cx="16" cy="16" r="4" fill="currentColor" fillOpacity=".2"/><line x1="22" y1="20" x2="56" y2="10"/><line x1="22" y1="44" x2="56" y2="54"/></svg>,
  IconBend:()=><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M8 48V24Q8 12 20 12H48" strokeWidth="3"/><path d="M40 6l8 6-8 6" strokeWidth="2"/><rect x="8" y="44" width="20" height="8" rx="1" fill="currentColor" fillOpacity=".2"/></svg>,
  IconPunchPress:()=><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="14" y="6" width="36" height="12" rx="2" fill="currentColor" fillOpacity=".2"/><rect x="26" y="18" width="12" height="22" rx="1" fill="currentColor" fillOpacity=".15"/><rect x="8" y="40" width="48" height="8" rx="2" fill="currentColor" fillOpacity=".12"/><rect x="14" y="48" width="36" height="10" rx="1" fill="currentColor" fillOpacity=".2"/><line x1="32" y1="6" x2="32" y2="18" strokeWidth="3"/></svg>,
  IconRoller:()=><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="16" cy="32" r="14" fill="currentColor" fillOpacity=".08"/><circle cx="16" cy="32" r="8" strokeDasharray="3 3"/><circle cx="16" cy="32" r="3" fill="currentColor" fillOpacity=".3"/><circle cx="48" cy="32" r="14" fill="currentColor" fillOpacity=".08"/><circle cx="48" cy="32" r="8" strokeDasharray="3 3"/><circle cx="48" cy="32" r="3" fill="currentColor" fillOpacity=".3"/><line x1="4" y1="24" x2="60" y2="24" strokeWidth="3"/><line x1="4" y1="40" x2="60" y2="40" strokeWidth="3"/></svg>,
  IconExtrude:()=><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="6" y="18" width="24" height="28" rx="2" fill="currentColor" fillOpacity=".1"/><rect x="30" y="26" width="28" height="12" fill="currentColor" fillOpacity=".15"/><rect x="30" y="26" width="28" height="12"/><circle cx="18" cy="32" r="6" fill="currentColor" fillOpacity=".2"/><path d="M56 30l6 2-6 4" strokeWidth="2"/></svg>,
  IconSensor:()=><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="20" y="20" width="24" height="24" rx="4" fill="currentColor" fillOpacity=".12"/><circle cx="32" cy="32" r="6" fill="currentColor" fillOpacity=".25"/><path d="M10 10Q18 10 18 18M54 10Q46 10 46 18M10 54Q18 54 18 46M54 54Q46 54 46 46" strokeWidth="1.8"/></svg>,
  IconMotor:()=><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="14" y="18" width="28" height="28" rx="3" fill="currentColor" fillOpacity=".1"/><circle cx="28" cy="32" r="8" fill="currentColor" fillOpacity=".15"/><circle cx="28" cy="32" r="3" fill="currentColor" fillOpacity=".35"/><line x1="42" y1="32" x2="56" y2="32" strokeWidth="3"/><line x1="4" y1="26" x2="14" y2="26"/><line x1="4" y1="32" x2="14" y2="32"/><line x1="4" y1="38" x2="14" y2="38"/></svg>,
};

const ICONS_LIST=Object.keys(SVG);

function Toast({msg,onDone}){
  useEffect(()=>{const t=setTimeout(onDone,2500);return()=>clearTimeout(t)},[]);
  return <div className="adm-toast"><span>✓</span>{msg}</div>;
}

export default function AdminDashboard({onLogout}){
  const[tab,setTab]=useState('gallery');
  const[content,setContent]=useState({services:[],gallery:[]});
  const[files,setFiles]=useState([]);
  const[cat,setCat]=useState(CATS[0]);
  const[mtype,setMtype]=useState('image');
  const[loading,setLoading]=useState(false);
  const[toast,setToast]=useState('');
  const[svcTitle,setSvcTitle]=useState('');
  const[svcDesc,setSvcDesc]=useState('');
  const[svcIcon,setSvcIcon]=useState('IconRoboticArm');
  const[editSvc,setEditSvc]=useState(null);
  const[showPicker,setShowPicker]=useState(false);
  const fileRef=useRef(null);
  const token=localStorage.getItem('adminToken');
  const auth={'Authorization':`Bearer ${token}`};

  const load=async()=>{
    try{const r=await fetch('/api/admin/all-content');const d=await r.json();setContent(d);}catch{}
  };
  useEffect(()=>{load();},[]);

  const handleFiles=e=>{
    const arr=Array.from(e.target.files);
    setFiles(p=>[...p,...arr]);
  };

  const clearFiles=()=>{setFiles([]);if(fileRef.current)fileRef.current.value='';};

  const uploadGallery=async e=>{
    e.preventDefault();if(!files.length)return;
    setLoading(true);
    const fd=new FormData();
    files.forEach(f=>fd.append('files',f));
    fd.append('category',cat);fd.append('mediaType',mtype);
    await fetch('/api/admin/gallery',{method:'POST',body:fd,headers:auth});
    clearFiles();await load();setLoading(false);setToast('Media uploaded successfully');
  };

  const deleteGallery=async id=>{
    await fetch(`/api/admin/gallery/${id}`,{method:'DELETE',headers:auth});
    await load();setToast('Item deleted');
  };

  const startEditSvc=s=>{setEditSvc(s);setSvcTitle(s.title);setSvcDesc(s.desc);setSvcIcon(s.icon||'IconRoboticArm')};
  const cancelEdit=()=>{setEditSvc(null);setSvcTitle('');setSvcDesc('');setSvcIcon('IconRoboticArm')};
  const submitSvc=async e=>{
    e.preventDefault();
    await fetch('/api/admin/services',{method:'POST',headers:{...auth,'Content-Type':'application/json'},body:JSON.stringify({id:editSvc?._id,title:svcTitle,desc:svcDesc,icon:svcIcon})});
    cancelEdit();await load();setToast(editSvc?'Service updated':'Service added');
  };
  const deleteSvc=async id=>{
    await fetch(`/api/admin/services/${id}`,{method:'DELETE',headers:auth});
    await load();setToast('Service deleted');
  };

  const Icon=({name})=>{const C=SVG[name]||SVG.IconFabrication;return<div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}><C/></div>};

  return(
    <div className="adm">
      {toast&&<Toast msg={toast} onDone={()=>setToast('')}/>}
      <div className="adm-header">
        <div className="adm-logo">RWS<span>.</span>ADMIN</div>
        <div className="adm-tabs">
          <button className={tab==='gallery'?'active':''} onClick={()=>setTab('gallery')}>Gallery</button>
          <button className={tab==='services'?'active':''} onClick={()=>setTab('services')}>Services</button>
        </div>
        <button className="adm-close" onClick={onLogout}>Logout</button>
      </div>
      <div className="adm-body">
        {tab==='gallery'&&(
          <>
            <div className="adm-title">Media Library</div>
            <div className="adm-sub">Upload and manage photos and videos for the gallery.</div>
            <div className="adm-card">
              <div className="adm-card-title">Upload Media</div>
              <form onSubmit={uploadGallery}>
                <div className="adm-row">
                  <div className="adm-group">
                    <div className="adm-label">Category</div>
                    <select className="adm-select" value={cat} onChange={e=>setCat(e.target.value)}>
                      {CATS.map(c=><option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="adm-group">
                    <div className="adm-label">Media Type</div>
                    <select className="adm-select" value={mtype} onChange={e=>setMtype(e.target.value)}>
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                  <div className="adm-group">
                    <div className="adm-label">Files</div>
                    <label className="adm-file-label">
                      <span>+ Choose Files</span>
                      <input ref={fileRef} type="file" multiple accept="image/*,video/*" className="adm-file-input" onChange={handleFiles}/>
                    </label>
                  </div>
                  <div className="adm-group">
                    <div className="adm-label">&nbsp;</div>
                    <button type="submit" className="adm-btn" disabled={loading||!files.length}>{loading?'Uploading…':'Upload'}</button>
                  </div>
                </div>
                {files.length>0&&(
                  <div className="queue-box">
                    <div className="queue-header">
                      <h4>{files.length} file(s) ready</h4>
                      <button
                        type="button"
                        className="adm-btn adm-btn--ghost adm-btn--sm"
                        onClick={clearFiles}
                        disabled={files.length<=1}
                        title={files.length<=1?'Add more files to enable Clear All':'Remove all selected files'}
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="queue-row">
                      {files.map((f,i)=>(
                        <div key={i} className="q-item">
                          <div className="q-frame">
                            {f.type.startsWith('image')?<img src={URL.createObjectURL(f)} alt=""/>:<video src={URL.createObjectURL(f)}/>}
                          </div>
                          <div className="q-name">{f.name}</div>
                          <button type="button" className="q-remove" onClick={()=>setFiles(files.filter((_,j)=>j!==i))}>✕</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </form>
            </div>
            <div className="adm-card">
              <div className="adm-card-title">Gallery ({content.gallery?.length||0} items)</div>
              {content.gallery?.length===0?<div className="adm-empty">No media uploaded yet.</div>:(
                <div className="adm-gallery-grid">
                  {content.gallery?.map(item=>(
                    <div key={item._id} className="adm-gallery-item">
                      {item.type==='image'?<img src={item.mediaUrl} alt={item.category} loading="lazy"/>:<video src={item.mediaUrl} muted playsInline preload="metadata"/>}
                      <button className="adm-gallery-delete" onClick={()=>deleteGallery(item._id)}>✕</button>
                      <div className="adm-gallery-label">{item.category}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
        {tab==='services'&&(
          <>
            <div className="adm-title">Services</div>
            <div className="adm-sub">Manage the services displayed on the website.</div>
            <div className="adm-card">
              <div className="adm-card-title">{editSvc?'Edit Service':'Add Service'}</div>
              <form onSubmit={submitSvc}>
                <div className="adm-svc-row">
                  <div className="adm-group"><div className="adm-label">Title</div><input className="adm-input" value={svcTitle} onChange={e=>setSvcTitle(e.target.value)} placeholder="Service title" required/></div>
                  <div className="adm-group">
                    <div className="adm-label">Icon</div>
                    <div style={{display:'flex',gap:'0.5rem',alignItems:'center'}}>
                      <div className="adm-icon-trigger" onClick={()=>setShowPicker(!showPicker)} title="Pick an icon">
                        <Icon name={svcIcon}/>
                      </div>
                      <span style={{fontSize:'0.72rem',color:'#636B77',fontFamily:'monospace'}}>{svcIcon}</span>
                    </div>
                  </div>
                </div>
                {showPicker&&(
                  <div className="icon-picker">
                    <div className="adm-label" style={{marginBottom:'0.6rem'}}>Choose Icon — {ICONS_LIST.length} available</div>
                    <div className="icon-grid">
                      {ICONS_LIST.map(n=>(
                        <div key={n} className={`icon-opt ${svcIcon===n?'selected':''}`} onClick={()=>{setSvcIcon(n);setShowPicker(false)}} title={n.replace('Icon','')}>
                          <Icon name={n}/>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="adm-group" style={{marginTop:'1rem'}}>
                  <div className="adm-label">Description</div>
                  <textarea className="adm-textarea" value={svcDesc} onChange={e=>setSvcDesc(e.target.value)} placeholder="Short description of the service" required/>
                </div>
                <div className="adm-svc-actions">
                  <button type="submit" className="adm-btn">{editSvc?'Update Service':'Add Service'}</button>
                  {editSvc&&<button type="button" className="adm-btn adm-btn--ghost" onClick={cancelEdit}>Cancel</button>}
                </div>
              </form>
            </div>
            <div className="adm-card">
              <div className="adm-card-title">All Services ({content.services?.length||0})</div>
              {content.services?.length===0?<div className="adm-empty">No services yet.</div>:(
                <table className="adm-table">
                  <thead><tr><th>Icon</th><th>Title</th><th>Description</th><th>Actions</th></tr></thead>
                  <tbody>
                    {content.services?.map(s=>(
                      <tr key={s._id}>
                        <td><div className="svc-thumb"><Icon name={s.icon}/></div></td>
                        <td style={{color:'#F0F1F3',fontWeight:500}}>{s.title}</td>
                        <td style={{maxWidth:'300px'}}>{s.desc}</td>
                        <td>
                          <div style={{display:'flex',gap:'0.5rem'}}>
                            <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={()=>startEditSvc(s)}>Edit</button>
                            <button className="adm-btn adm-btn--danger adm-btn--sm" onClick={()=>deleteSvc(s._id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}