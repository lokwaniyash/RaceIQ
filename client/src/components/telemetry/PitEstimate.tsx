import type { TelemetryPacket, LivePitData, GameId } from "@shared/types";
import { PitWindow } from "./PitWindow";

interface PitEstimateProps {
  packet: TelemetryPacket;
  pit: LivePitData | null;
  gameId: GameId | null;
}

/**
 * PitEstimate — Displays server-computed fuel and tire estimates.
 * All computation happens server-side in PitTracker; this component just renders.
 */
export function PitEstimate({ packet, pit, gameId }: PitEstimateProps) {
  // Forza: Fuel is 0..1 fraction → percentage. ACC/AC Evo/F1: Fuel is in litres/kg.
  const fuelIsLitres = gameId === "acc" || gameId === "ac-evo" || gameId === "f1-2025";
  const fuelPct = fuelIsLitres ? Math.min(100, packet.Fuel) : packet.Fuel * 100;
  const fuelDisplay = fuelIsLitres ? `${packet.Fuel.toFixed(1)}L` : `${fuelPct.toFixed(0)}%`;
  const fuelColor = fuelIsLitres
    ? packet.Fuel < 5
      ? "text-red-400"
      : packet.Fuel < 15
        ? "text-amber-400"
        : "text-emerald-400"
    : fuelPct < 20
      ? "text-red-400"
      : fuelPct < 40
        ? "text-amber-400"
        : "text-emerald-400";

  const fuelLaps = pit?.fuelLapsRemaining ?? null;

  const pitStatus = packet.acc?.pitStatus;
  const pitBadge =
    pitStatus === "in_pit"
      ? { label: "IN PIT", cls: "bg-sky-500/20 text-sky-300 border-sky-500/30" }
      : pitStatus === "pit_lane"
        ? { label: "PIT LANE", cls: "bg-amber-500/20 text-amber-300 border-amber-500/30" }
        : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        {pitBadge ? <span className={`text-xs font-bold px-2 py-0.5 rounded border tracking-widest uppercase ${pitBadge.cls}`}>{pitBadge.label}</span> : <span />}
        <PitWindow pit={pit} gameId={gameId} />
      </div>
      <div className="space-y-3">
        {/* Fuel row */}
        <div className="py-1">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-app-text-muted uppercase tracking-wider font-semibold">Fuel</div>
            <div className={`text-lg font-mono font-bold tabular-nums ${fuelLaps != null ? fuelColor : "text-app-text-dim"}`}>{fuelLaps != null ? `~${fuelLaps.toFixed(1)} laps` : "—"}</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-3 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${fuelPct < 20 ? "bg-red-500" : fuelPct < 40 ? "bg-amber-400" : "bg-emerald-400"}`} style={{ width: `${fuelPct}%` }} />
            </div>
            <div className={`text-2xl font-mono font-black tabular-nums leading-none ${fuelIsLitres ? "w-20" : "w-14"} text-right ${fuelColor}`}>{fuelDisplay}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
