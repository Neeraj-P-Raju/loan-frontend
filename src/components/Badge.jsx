// Coloured label for statuses.
const colours = {
  Approved: 'b-green', 'Likely Approved': 'b-green',
  Rejected: 'b-red', 'Likely Not Approved': 'b-red',
  Pending: 'b-amber',
};
export default function Badge({ text }) {
  return <span className={'badge ' + (colours[text] || 'b-gray')}>{text}</span>;
}
