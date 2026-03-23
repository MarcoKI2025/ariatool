import React from 'react';

export function UseRestrictionBanner() {
  return (
    <div className="rounded-xl p-4 mb-5 border-2 border-fragile bg-fragile-bg">
      <div className="flex items-start gap-3">
        <span className="text-fragile text-lg flex-shrink-0 mt-[1px]">⚠</span>
        <div>
          <div className="text-[10px] font-bold tracking-[0.1em] uppercase text-fragile mb-1">
            Governance Intelligence Platform — Strict Use Restriction
          </div>
          <div className="text-[11px] text-fragile leading-[1.55] mb-2">
            Dieses Tool erzeugt ausschließlich Entscheidungsunterstützungssignale. Es produziert <strong>KEINE</strong> bindenden Underwriting-Entscheidungen, <strong>KEINE</strong> Wahrscheinlichkeiten, <strong>KEINE</strong> Preisfestsetzungen, <strong>KEINE</strong> actuarial loss predictions und <strong>KEINE</strong> regulatorischen Zertifizierungen.
          </div>
          <div className="text-[11px] text-fragile leading-[1.55]">
            Alle Ausgaben erfordern <strong>zwingend menschliche Überprüfung und explizite Freigabe</strong> durch autorisierte Personen. Keine versicherungsmathematische Validierung. Nutzung auf eigenes Risiko.
          </div>
        </div>
      </div>
    </div>
  );
}
