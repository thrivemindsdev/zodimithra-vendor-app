interface SessionButtonProps {
  title: string;
  handleClick: () => void;
  disabled: boolean;
}

const SessionButton = ({
  title,
  handleClick,
  disabled,
}: SessionButtonProps) => {
  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className="
          mt-4 h-11 w-full rounded-xl
          bg-linear-to-r from-[#e74439] to-[#d9342c]
          text-sm font-semibold
          shadow-md
          transition
          hover:opacity-90
          text-white
        "
    >
      {title}
    </button>
  );
};

export default SessionButton;
