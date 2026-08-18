export function StatCard({ title, value, variant = 'primary' }) {
  return (
    <div className="col-md-6 col-xl-3">
      <div className={`card border-${variant} card-hover`}>
        <div className="card-body">
          <h6 className="card-subtitle text-muted">{title}</h6>
          <h3 className="card-title mt-2 mb-0">{value}</h3>
        </div>
      </div>
    </div>
  )
}
