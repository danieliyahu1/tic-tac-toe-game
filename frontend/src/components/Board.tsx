type BoardProps = {
  handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disable: boolean;
}

const Board = ({ handleClick, disable }: BoardProps) => {

  return (
    <div className="grid grid-cols-3 gap-1 mb-5">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((id) => (
        <button
          key={id}
          id={`button-${id}`}
          onClick={!disable ? handleClick : undefined}
          className={`flex rounded items-center justify-center bg-gray-200 border-2 border-gray-600 w-16 h-16 text-lg ${
            !disable ? "hover:bg-gray-300 hover:border-gray-700" : ""
          } ${disable ? "cursor-not-allowed" : ""}`}
          disabled={disable}
        >
        </button>
      ))}
    </div>
  );
}

export default Board;
