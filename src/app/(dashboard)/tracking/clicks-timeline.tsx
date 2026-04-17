'use client'

type Point = { date: string; clicks: number; spend: number; impressions: number }

export function ClicksTimeline({ data }: { data: Point[] }) {
  if (data.length === 0) return <p className="text-sm text-secondary">Nessun dato.</p>

  const maxClicks = Math.max(1, ...data.map((d) => d.clicks))
  const maxSpend = Math.max(0.01, ...data.map((d) => d.spend))

  return (
    <div className="space-y-2">
      <div className="flex items-end gap-1 h-40">
        {data.map((d) => {
          const clickH = (d.clicks / maxClicks) * 100
          const spendH = (d.spend / maxSpend) * 100
          return (
            <div key={d.date} className="flex-1 min-w-0 h-full flex items-end group relative">
              <div className="w-full h-full flex items-end gap-0.5">
                <div className="w-1/2 bg-primary rounded-t-sm transition-all group-hover:bg-primary/80" style={{ height: `${clickH}%` }} />
                <div className="w-1/2 bg-[#ff9f0a] rounded-t-sm transition-all group-hover:bg-[#ff9f0a]/80" style={{ height: `${spendH}%` }} />
              </div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background text-[11px] rounded-md px-2 py-1 whitespace-nowrap z-10 pointer-events-none">
                <p className="font-semibold">{d.date}</p>
                <p>{d.clicks} click</p>
                <p>€{d.spend.toFixed(2)} spend</p>
                {d.impressions > 0 && <p>{d.impressions.toLocaleString('de-DE')} impr.</p>}
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex items-center justify-between text-[10px] text-secondary">
        <span>{data[0]?.date}</span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-primary inline-block" />Click affiliate</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-[#ff9f0a] inline-block" />Spend TikTok</span>
        </div>
        <span>{data[data.length - 1]?.date}</span>
      </div>
    </div>
  )
}
