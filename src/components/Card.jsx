import "../styles/Card.css";
export default function Card({ card, handleClick }) {
  return (
    <div className="card glow">
      <img className="card-image" src={card.imageUrl} id={card.id} onClick={handleClick}/>
      <p className="card-title">{card.name}</p>
    </div>
  );
}
