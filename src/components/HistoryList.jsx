import { useState } from 'react';
import './HistoryList.css'; 

const HistoryList = ({ history, onClick, onDelete }) => {
  const [selectedIds, setSelectedIds] = useState([]);

  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDelete = () => {
    onDelete(selectedIds);
    setSelectedIds([]);
  };

  return (
    <div>
      <div className="history-header">
        <h3>Search History</h3>
        {selectedIds.length > 0 && (
          <button className="delete-button" onClick={handleDelete}>Delete Selected</button>
        )}
      </div>
      <ul>
        {history.map((item, index) => (
          <li key={index}>
            <input
              type="checkbox"
              checked={selectedIds.includes(item.id)}
              onChange={() => handleCheckboxChange(item.id)}
            />
            <span onClick={() => onClick(item)}>
            {item.ip} - {item.city}, {item.region}, {item.country}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistoryList;
