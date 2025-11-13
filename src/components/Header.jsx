import "../styles/Header.css"
export default function Header({ icon, title, style }) {
  return (
    <>
      <div style={style} className="heading">
        <div className="logo-container">
        <img className="logo" src={icon} />
        </div>
        <h1 className="title">{title}</h1>
      </div>
    </>
  );
}
