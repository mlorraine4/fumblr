const Button = ({ type, children, style, onClick }) => {
  return (
    <button style={style} onClick={onClick} type={type}>
      {children}
    </button>
  );
};

export default Button;