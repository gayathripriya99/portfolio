/** Fixed ambient layer: slow-drifting gradient fields, a masked grid and static grain. Purely decorative. */
export function Background() {
  return (
    <div className="ambient" aria-hidden="true">
      <div className="ambient-field ambient-field--a" />
      <div className="ambient-field ambient-field--b" />
      <div className="ambient-field ambient-field--c" />
      <div className="ambient-grid" />
      <div className="ambient-grain" />
    </div>
  )
}
