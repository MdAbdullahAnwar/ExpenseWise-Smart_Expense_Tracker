export function Form({ children, onSubmit, className }) {
  return (
    <form onSubmit={onSubmit} className={className}>
      {children}
    </form>
  );
}
