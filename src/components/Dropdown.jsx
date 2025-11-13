import "../styles/Dropdown.css";
export default function Dropdown({ items, id, label, selectedItem = "", handleChange}) {
  return (
    <>
      <div className="drop-down-container">
        <label htmlFor={id}>{label}</label>
        <select
          id={id}
          name={id}
          className="drop-down"
          defaultValue={selectedItem} onChange={handleChange}
        >
          {items.map((item) => {
            return (
              <option value={item.id} key={item.key}>
                {item.name}
              </option>
            );
          })}
        </select>
      </div>
    </>
  );
}
