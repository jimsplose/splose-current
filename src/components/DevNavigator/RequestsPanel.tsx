"use client";

export default function RequestsPanel({ onNewRequest }: { onNewRequest?: () => void }) {
  return (
    <div style={{ padding: 16, color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
      <div>Requests panel — coming soon</div>
      {onNewRequest && (
        <button onClick={onNewRequest} style={{ marginTop: 8, background: '#7c3aed', border: 'none', borderRadius: 4, color: '#fff', fontSize: 11, padding: '4px 10px', cursor: 'pointer' }}>
          + New Request
        </button>
      )}
    </div>
  );
}
