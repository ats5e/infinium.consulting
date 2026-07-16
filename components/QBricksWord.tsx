/*
 * The QBricks wordmark, reproduced exactly as it appears on
 * qbricks.vercel.app: Quicksand (their brand face, 2.5KB glyph subset),
 * capital "Q" bold in the brand ember red (#FF3A26), "Bricks" in the
 * current high-contrast heading colour. Never uppercased. Client-directed.
 */
export function QBricksWord({ className }: { className?: string }) {
  return (
    <span className={`font-qbricks whitespace-nowrap normal-case ${className ?? ""}`}>
      <span className="font-bold text-[#FF3A26]">Q</span>
      <span className="font-normal text-paper">Bricks</span>
    </span>
  );
}
