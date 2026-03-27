import React from 'react';

export function UseRestrictionBanner() {
  return (
    <div className="text-[10px] text-center py-2 mb-4" style={{ color: 'hsl(var(--t3))' }}>
      Heuristic tool — not actuarially certified. All outputs require professional review before use in underwriting decisions.
    </div>
  );
}
