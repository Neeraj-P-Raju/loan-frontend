// Very small bar chart made from divs. values are shown as given.
export default function BarList({ rows, max, format = (v) => v, teal }) {
  const top = max || Math.max(...rows.map((r) => r.value), 1);
  return (
    <div>
      {rows.map((r) => (
        <div className="bar-row" key={r.label}>
          <div className="name">{r.label}</div>
          <div className="bar-track">
            <div className={'bar-fill' + (teal ? ' teal' : '')} style={{ width: (r.value / top) * 100 + '%' }} />
          </div>
          <div className="bar-val">{format(r.value)}</div>
        </div>
      ))}
    </div>
  );
}
