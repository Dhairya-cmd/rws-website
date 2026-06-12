import{useState,useEffect,useCallback}from'react';
export function useTheme(){
  const[theme,setTheme]=useState(()=>localStorage.getItem('rws-theme')||'dark');
  useEffect(()=>{
    document.documentElement.setAttribute('data-theme',theme);
    localStorage.setItem('rws-theme',theme);
  },[theme]);
  const toggle=useCallback(()=>setTheme(t=>t==='dark'?'light':'dark'),[]);
  return{theme,toggle};
}