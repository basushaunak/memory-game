import "../styles/ScoreCard.css";

export default function ScoreCard({score, highScore,runCount=0,style={}}){
    return(
        <div className="score-card" style={style}>
            <p className="score-card-para">Score:</p>
            <p className="score">{score}</p>
            <p className="score-card-para">High:</p>
            <p className="high-score">{highScore}</p>
            {runCount === 0 ? null: <><p className="score-card-para">Game#:</p><p className="score">{runCount}</p></>}
        </div>
    )
}