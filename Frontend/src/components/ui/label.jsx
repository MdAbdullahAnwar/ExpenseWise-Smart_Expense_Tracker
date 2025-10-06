export function Label({ children, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="block mb-1 font-medium text-gray-700">
      {children}
    </label>
  );
}
