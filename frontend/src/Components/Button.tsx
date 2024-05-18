import { MouseEventHandler } from 'react';

export const Button = ({
  onClick,
  children,
  ...props
}: {
  onClick: MouseEventHandler;
  children: React.ReactNode;
}) => {
  return (
    <button {...props} onClick={onClick} className="rounded bg-green-400 p-4 text-lg font-bold text-white shadow-md">
      {children}
    </button>
  );
};
