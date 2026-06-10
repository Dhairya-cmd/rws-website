import React,{useState} from 'react';
import './AdminLogin.css';
export default function AdminLogin({onLoginSuccess,onClose}){
  const[creds,setCreds]=useState({username:'',password:''});
  const[error,setError]=useState('');
  const[loading,setLoading]=useState(false);
  const submit=async e=>{
    e.preventDefault();setLoading(true);setError('');
    try{
      const res=await fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(creds)});
      const data=await res.json();
      if(data.success){localStorage.setItem('adminToken',data.token);onLoginSuccess();}
      else setError(data.message||'Invalid credentials');
    }catch{setError('Server error — is the backend running?');}
    finally{setLoading(false);}
  };
  return(
    <div className="admin-login-overlay">
      <div className="admin-login-modal">
        <button className="close-modal" onClick={onClose}>✕</button>
        <div className="login-header">
          <div className="tag">Restricted Area</div>
          <h2>Admin Login</h2>
        </div>
        <form onSubmit={submit}>
          <div className="form-group"><label>Username</label><input name="username" type="text" onChange={e=>setCreds({...creds,username:e.target.value})} placeholder="Enter username" required disabled={loading}/></div>
          <div className="form-group"><label>Password</label><input name="password" type="password" onChange={e=>setCreds({...creds,password:e.target.value})} placeholder="Enter password" required disabled={loading}/></div>
          {error&&<p className="login-error">{error}</p>}
          <button type="submit" className="btn--primary" disabled={loading}>{loading?'Verifying…':'Login to Dashboard →'}</button>
        </form>
      </div>
    </div>
  );
}
