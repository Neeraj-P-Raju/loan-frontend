// Small confirmation dialog used for delete, archive and similar actions.
export default function Modal({ title, children, onCancel, onConfirm, confirmText = 'Confirm', danger }) {
  return (
    <div className="modal-back">
      <div className="modal">
        <h3>{title}</h3>
        <div className="modal-body">{children}</div>
        <div className="modal-actions">
          <button className="btn btn-light" onClick={onCancel}>Cancel</button>
          <button className={'btn ' + (danger ? 'btn-danger' : 'btn-primary')} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
