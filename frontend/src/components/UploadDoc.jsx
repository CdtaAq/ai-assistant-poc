import React, { useRef, useState } from 'react';

export default function UploadDoc() {
  const inputRef = useRef();
  const [status, setStatus] = useState('');

  async function upload() {
    const file = inputRef.current.files?.[0];
    if (!file) return alert('Choose a file');
    const form = new FormData();
    form.append('file', file, file.name);
    setStatus('uploading...');
    const resp = await fetch('http://localhost:3000/docs/upload', {
      method: 'POST', body: form
    });
    const data = await resp.json();
    setStatus(JSON.stringify(data));
    setTimeout(()=>setStatus(''), 5000);
  }

  return (
    <div>
      <input ref={inputRef} type="file" />
      <button onClick={upload} className="small-btn">Upload Doc</button>
      <div>{status}</div>
    </div>
  );
}
