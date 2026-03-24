import { Button } from '../ui/Button'

export function PrescriptionActions({
  onSave,
  onCopy,
  onExportPdf,
  onPrint,
  onClear,
  isPdfLocked,
}) {
  return (
    <div className="panel action-panel">
      <div className="panel-heading">
        <div>
          <p className="section-eyebrow">Actions</p>
          <h3>Finish the prescription</h3>
        </div>
      </div>

      <div className="actions-grid">
        <Button onClick={onSave}>Save</Button>
        <Button variant="secondary" onClick={onCopy}>
          Copy text
        </Button>
        <Button variant="secondary" onClick={onPrint}>
          Print
        </Button>
        <Button variant="ghost" onClick={onExportPdf} disabled={isPdfLocked}>
          {isPdfLocked ? 'PDF locked on Free' : 'Export PDF'}
        </Button>
        <Button variant="ghost" onClick={onClear}>
          Clear form
        </Button>
      </div>
    </div>
  )
}
